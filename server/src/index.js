require("dotenv").config();

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const { z } = require("zod");

const { createToken, getBearerToken, verifyToken } = require("./auth");
const { ensureSchema, pool } = require("./db/pool");

const app = express();
const port = Number(process.env.PORT || 3333);
const distPath = path.resolve(__dirname, "../../dist");
const indexHtmlPath = path.join(distPath, "index.html");

const loginField = z
  .string()
  .trim()
  .min(3, "Informe um usuário com pelo menos 3 caracteres.")
  .max(40, "Use um usuário com até 40 caracteres.")
  .regex(/^[a-zA-Z0-9._-]+$/, "Use apenas letras, números, ponto, traço ou underline no usuário.")
  .transform((value) => value.toLowerCase());

const registerSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome."),
  login: loginField,
  password: z.string().min(6, "Use uma senha com pelo menos 6 caracteres."),
  confirmPassword: z.string().min(6, "Repita sua senha para continuar."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas precisam ser iguais.",
  path: ["confirmPassword"],
});

const loginSchema = z.object({
  login: loginField,
  password: z.string().min(6, "Use uma senha com pelo menos 6 caracteres."),
});

const recoverSchema = z.object({
  login: loginField,
  password: z.string().min(6, "Use uma senha com pelo menos 6 caracteres."),
  confirmPassword: z.string().min(6, "Repita sua senha para continuar."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas precisam ser iguais.",
  path: ["confirmPassword"],
});

function corsOptions() {
  const configuredOrigins = (process.env.CORS_ORIGIN || "*")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return {
    origin(origin, callback) {
      if (!origin || configuredOrigins.includes("*") || configuredOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origem não permitida pelo CORS."));
    },
  };
}

function sendValidationError(response, error) {
  const firstIssue = error.issues?.[0];
  response.status(400).json({
    message: firstIssue?.message || "Revise os dados enviados.",
  });
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    login: user.login,
  };
}

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);
app.use(cors(corsOptions()));
app.use(express.json({ limit: "1mb" }));

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

app.get("/health", (_request, response) => {
  response.json({
    ok: true,
    service: "riff-records-api",
  });
});

app.post("/auth/register", async (request, response, next) => {
  try {
    const parsed = registerSchema.safeParse(request.body);

    if (!parsed.success) {
      sendValidationError(response, parsed.error);
      return;
    }

    const { name, login, password } = parsed.data;
    const existingUser = await pool.query("SELECT id FROM users WHERE login = $1", [login]);

    if (existingUser.rowCount) {
      response.status(409).json({ message: "Este usuário já está em uso." });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO users (
        id,
        name,
        login,
        password_hash
      )
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, login`,
      [
        crypto.randomUUID(),
        name,
        login,
        passwordHash,
      ]
    );

    response.status(201).json({
      ok: true,
      user: publicUser(result.rows[0]),
      message: "Conta criada com sucesso. Você já pode entrar.",
    });
  } catch (error) {
    next(error);
  }
});

app.post("/auth/login", async (request, response, next) => {
  try {
    const parsed = loginSchema.safeParse(request.body);

    if (!parsed.success) {
      sendValidationError(response, parsed.error);
      return;
    }

    const { login, password } = parsed.data;
    const result = await pool.query(
      "SELECT id, name, login, password_hash FROM users WHERE login = $1",
      [login]
    );
    const user = result.rows[0];
    const validPassword = user
      ? await bcrypt.compare(password, user.password_hash)
      : false;

    if (!user || !validPassword) {
      response.status(401).json({ message: "Login ou senha inválidos." });
      return;
    }

    response.json({
      user: publicUser(user),
      token: createToken(user),
    });
  } catch (error) {
    next(error);
  }
});

app.post("/auth/recover", async (request, response, next) => {
  try {
    const parsed = recoverSchema.safeParse(request.body);

    if (!parsed.success) {
      sendValidationError(response, parsed.error);
      return;
    }

    const { login, password } = parsed.data;
    const passwordHash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `UPDATE users
       SET password_hash = $1,
           updated_at = NOW()
       WHERE login = $2
       RETURNING id`,
      [passwordHash, login]
    );

    if (!result.rowCount) {
      response.status(404).json({ message: "Não encontramos uma conta com esse usuário." });
      return;
    }

    response.json({
      ok: true,
      message: "Senha atualizada. Você já pode entrar.",
    });
  } catch (error) {
    next(error);
  }
});

app.get("/auth/me", async (request, response) => {
  const token = getBearerToken(request.headers.authorization);

  if (!token) {
    response.status(401).json({ message: "Acesso não autorizado." });
    return;
  }

  try {
    const payload = verifyToken(token);
    response.json({
      user: {
        id: payload.sub,
        name: payload.name,
        login: payload.login,
      },
    });
  } catch {
    response.status(401).json({ message: "Sessão expirada. Entre novamente." });
  }
});

if (fs.existsSync(indexHtmlPath)) {
  app.use((request, response, next) => {
    const acceptsHtml = request.headers.accept?.includes("text/html");

    if (request.method !== "GET" || !acceptsHtml || request.path.startsWith("/auth")) {
      next();
      return;
    }

    response.sendFile(indexHtmlPath);
  });
}

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({
    message: "Não foi possível concluir sua solicitação agora.",
  });
});

ensureSchema()
  .then(() => {
    app.listen(port, () => {
      console.log(`API pronta em http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Falha ao iniciar a API:", error.message);
    process.exit(1);
  });

const nodemailer = require("nodemailer");

const brandName = "Riff Records";

function normalizeUrl(value) {
  return value ? value.replace(/\/$/, "") : "";
}

function getAppUrl() {
  return normalizeUrl(
    process.env.APP_URL ||
      process.env.RENDER_EXTERNAL_URL ||
      "http://localhost:8081"
  );
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getFromAddress() {
  return process.env.MAIL_FROM || `${brandName} <no-reply@localhost>`;
}

function parseFromAddress(value) {
  const match = value.match(/^(.*)<(.+)>$/);

  if (!match) {
    return {
      email: value,
      name: brandName,
    };
  }

  return {
    email: match[2].trim(),
    name: match[1].replace(/"/g, "").trim() || brandName,
  };
}

function buildTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

function buildButtonHtml(label, url) {
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="border-collapse:separate;margin:0 auto;width:auto;">
      <tr>
        <td bgcolor="#B91F1A" style="background:#B91F1A;border:1px solid #D7A83C;border-radius:16px;text-align:center;">
          <a href="${url}" style="color:#FFF4E2;display:inline-block;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:800;min-width:220px;padding:16px 24px;text-decoration:none;text-align:center;">${label}</a>
        </td>
      </tr>
    </table>
  `;
}

function emailShell({ title, eyebrow, intro, actionLabel, actionUrl, note, footer }) {
  const safeActionUrl = escapeHtml(actionUrl);

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style="background:#F6EFE3;margin:0;padding:0;width:100%;">
        <span style="color:transparent;display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${title} - ${brandName}</span>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#F6EFE3;border-collapse:collapse;margin:0;padding:0;width:100%;">
          <tr>
            <td align="center" style="padding:36px 16px;">
              <table role="presentation" width="620" cellspacing="0" cellpadding="0" border="0" style="background:#FFFDF7;border:1px solid #D7C4AE;border-collapse:separate;border-radius:24px;max-width:620px;overflow:hidden;width:100%;">
                <tr>
                  <td align="center" bgcolor="#17110F" style="background:#17110F;padding:28px 28px 22px;text-align:center;">
                    <p style="color:#FFF4E2;font-family:Arial,Helvetica,sans-serif;font-size:26px;font-weight:900;letter-spacing:.02em;margin:0;">RIFF RECORDS</p>
                    <p style="color:#FFCF57;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:900;letter-spacing:.08em;margin:8px 0 0;text-transform:uppercase;">Vinis de rock</p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:34px 34px 30px;text-align:center;">
                    <p style="color:#B91F1A;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:900;letter-spacing:.04em;margin:0 0 12px;text-transform:uppercase;">${eyebrow}</p>
                    <h1 style="color:#18110F;font-family:Arial,Helvetica,sans-serif;font-size:32px;font-weight:900;line-height:38px;margin:0 0 14px;">${title}</h1>
                    <p style="color:#5F514A;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:500;line-height:25px;margin:0 auto 28px;max-width:470px;">${intro}</p>
                    ${buildButtonHtml(actionLabel, safeActionUrl)}
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:separate;margin:30px 0 0;width:100%;">
                      <tr>
                        <td style="background:#FFF3D6;border:1px solid #E4C66D;border-radius:18px;padding:16px 18px;text-align:left;">
                          <p style="color:#6E4B12;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;line-height:20px;margin:0;">${note}</p>
                        </td>
                      </tr>
                    </table>
                    <p style="color:#87756F;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;margin:20px 0 0;word-break:break-all;">Se o botão não abrir, copie este link:<br>${safeActionUrl}</p>
                  </td>
                </tr>
              </table>
              <p style="color:#87756F;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;margin:18px auto 0;max-width:620px;text-align:center;">${footer}</p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

async function sendEmail({ to, subject, html, text }) {
  if (process.env.BREVO_API_KEY) {
    const sender = parseFromAddress(getFromAddress());
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender,
        to: [{ email: to }],
        subject,
        htmlContent: html,
        textContent: text,
      }),
    });

    if (!response.ok) {
      const details = await response.text().catch(() => "");
      throw new Error(`Falha ao enviar e-mail pela Brevo API. ${details}`);
    }

    return response.json().catch(() => ({ provider: "brevo" }));
  }

  const transporter = buildTransporter();

  if (!transporter) {
    console.log("[email:dev]", { to, subject, text });
    return { preview: "logged" };
  }

  return transporter.sendMail({
    from: getFromAddress(),
    to,
    subject,
    html,
    text,
  });
}

async function sendVerificationEmail({ email, name, token }) {
  const url = `${getAppUrl()}/verify-email?token=${token}`;
  const displayName = escapeHtml(name);

  return sendEmail({
    to: email,
    subject: `Confirme sua conta na ${brandName}`,
    html: emailShell({
      eyebrow: "Primeiro acesso",
      title: "Confirme seu e-mail",
      intro: `Olá, ${displayName}. Sua conta na ${brandName} está quase pronta. Confirme seu e-mail para liberar seu acesso.`,
      actionLabel: "Confirmar minha conta",
      actionUrl: url,
      note: "Este link expira em 24 horas. Se você não criou essa conta, ignore este e-mail.",
      footer: `${brandName} - sua loja de vinis de rock.`,
    }),
    text: `Confirme sua conta na ${brandName}: ${url}`,
  });
}

async function sendPasswordResetEmail({ email, name, token }) {
  const url = `${getAppUrl()}/reset-password?token=${token}`;
  const displayName = escapeHtml(name);

  return sendEmail({
    to: email,
    subject: `Redefina sua senha na ${brandName}`,
    html: emailShell({
      eyebrow: "Recuperação de senha",
      title: "Crie uma nova senha",
      intro: `Olá, ${displayName}. Recebemos uma solicitação para redefinir a senha da sua conta ${brandName}.`,
      actionLabel: "Criar nova senha",
      actionUrl: url,
      note: "Este link expira em 1 hora. Se você não solicitou essa alteração, ignore este e-mail.",
      footer: `${brandName} - acesso protegido para sua coleção.`,
    }),
    text: `Redefina sua senha na ${brandName}: ${url}`,
  });
}

module.exports = {
  sendPasswordResetEmail,
  sendVerificationEmail,
};

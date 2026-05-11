import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react-native";

import { AuthButton } from "@/components/AuthButton";
import { AuthInput } from "@/components/AuthInput";
import { AuthScaffold } from "@/components/AuthScaffold";

type Feedback = {
  text: string;
  tone: "error" | "success" | "info";
};

export default function LoginScreen() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const canSubmit = useMemo(
    () => login.trim().length >= 3 && password.length >= 4,
    [login, password]
  );

  async function handleLogin() {
    setFeedback(null);

    if (!canSubmit) {
      setFeedback({
        tone: "error",
        text: "Digite seu login e sua senha para entrar na loja.",
      });
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
    setFeedback({
      tone: "success",
      text: "Login confirmado. Bem-vindo a Riff Records.",
    });
  }

  function handleRecoverPassword() {
    setFeedback({
      tone: "info",
      text: "Recuperação selecionada. Informe seu e-mail no login para receber as instruções.",
    });
  }

  function handleCreateAccount() {
    setFeedback({
      tone: "info",
      text: "Cadastro selecionado. A próxima tela seria o formulário para novos clientes.",
    });
  }

  return (
    <AuthScaffold
      eyebrow="Bem-vindo de volta"
      title="Entre na sua conta"
      subtitle="Acesse sua área para comprar vinis, salvar favoritos e acompanhar pedidos."
    >
      <AuthInput
        autoCapitalize="none"
        autoComplete="username"
        icon={<Mail size={21} color="#8F251F" />}
        label="Login ou e-mail"
        onChangeText={setLogin}
        placeholder="cliente@riffrecords.com"
        returnKeyType="next"
        value={login}
      />

      <AuthInput
        autoCapitalize="none"
        icon={<LockKeyhole size={21} color="#8F251F" />}
        label="Senha"
        onChangeText={setPassword}
        onSubmitEditing={handleLogin}
        placeholder="Digite sua senha"
        returnKeyType="go"
        secureTextEntry
        secureToggle
        value={password}
      />

      <View style={styles.actionsRow}>
        <Pressable onPress={handleRecoverPassword} style={styles.linkHitArea}>
          <Text style={styles.link}>Esqueci minha senha</Text>
        </Pressable>
      </View>

      {feedback ? (
        <Text style={[styles.feedback, styles[feedback.tone]]}>
          {feedback.text}
        </Text>
      ) : null}

      <AuthButton
        disabled={!canSubmit}
        icon={<ArrowRight size={20} color="#FFF4E2" />}
        loading={loading}
        onPress={handleLogin}
      >
        Entrar na loja
      </AuthButton>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Ainda não tem acesso?</Text>
        <Pressable onPress={handleCreateAccount} style={styles.linkHitArea}>
          <Text style={styles.linkStrong}>Criar uma conta</Text>
        </Pressable>
      </View>
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  actionsRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: -4,
  },
  linkHitArea: {
    paddingVertical: 4,
  },
  link: {
    color: "#8F251F",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0,
  },
  feedback: {
    borderRadius: 14,
    borderWidth: 1,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0,
    lineHeight: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  error: {
    backgroundColor: "#F9E8E4",
    borderColor: "#F0C3BA",
    color: "#963D35",
  },
  info: {
    backgroundColor: "#FFF3D6",
    borderColor: "#E4C66D",
    color: "#6E4B12",
  },
  success: {
    backgroundColor: "#E7F2EA",
    borderColor: "#C5DEC9",
    color: "#1E5B35",
  },
  footerRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    justifyContent: "center",
  },
  footerText: {
    color: "#5F514A",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0,
  },
  linkStrong: {
    color: "#B91F1A",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0,
  },
});

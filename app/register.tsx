import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { ArrowLeft, LockKeyhole, UserPlus, UserRound } from "lucide-react-native";

import { AuthButton } from "@/components/AuthButton";
import { AuthInput } from "@/components/AuthInput";
import { AuthScaffold } from "@/components/AuthScaffold";
import { apiRequest, ApiMessage } from "@/lib/api";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const canSubmit = useMemo(
    () =>
      name.trim().length >= 2 &&
      login.trim().length >= 3 &&
      password.length >= 6 &&
      password === confirmPassword,
    [confirmPassword, login, name, password]
  );

  async function handleRegister() {
    setMessage("");
    setSuccess(false);

    if (!canSubmit) {
      setMessage("Informe seus dados e repita a mesma senha para continuar.");
      return;
    }

    try {
      setLoading(true);
      const result = await apiRequest<ApiMessage>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          login: login.trim(),
          password,
          confirmPassword,
        }),
      });

      setSuccess(true);
      setMessage(result.message);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível criar sua conta agora."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScaffold
      eyebrow="Novo acesso"
      title="Crie sua conta"
      subtitle="Cadastre-se para salvar favoritos, acompanhar pedidos e receber novidades."
    >
      <AuthInput
        autoCapitalize="words"
        icon={<UserRound size={21} color="#8F251F" />}
        label="Nome"
        onChangeText={setName}
        placeholder="Como devemos chamar você?"
        returnKeyType="next"
        value={name}
      />

      <AuthInput
        autoCapitalize="none"
        autoComplete="username"
        icon={<UserRound size={21} color="#8F251F" />}
        label="Usuário"
        onChangeText={setLogin}
        placeholder="Escolha um usuário"
        returnKeyType="next"
        value={login}
      />

      <AuthInput
        autoCapitalize="none"
        icon={<LockKeyhole size={21} color="#8F251F" />}
        label="Senha"
        onChangeText={setPassword}
        placeholder="Crie uma senha segura"
        returnKeyType="next"
        secureTextEntry
        secureToggle
        value={password}
      />

      <AuthInput
        autoCapitalize="none"
        icon={<LockKeyhole size={21} color="#8F251F" />}
        label="Confirmar senha"
        onChangeText={setConfirmPassword}
        onSubmitEditing={handleRegister}
        placeholder="Repita a mesma senha"
        returnKeyType="go"
        secureTextEntry
        secureToggle
        value={confirmPassword}
      />

      {message ? (
        <Text style={[styles.feedback, success ? styles.success : styles.error]}>
          {message}
        </Text>
      ) : null}

      <AuthButton
        disabled={!canSubmit}
        icon={<UserPlus size={19} color="#FFF4E2" />}
        loading={loading}
        onPress={handleRegister}
      >
        Criar conta
      </AuthButton>

      <View style={styles.footerRow}>
        <Pressable onPress={() => router.back()} style={styles.backLink}>
          <ArrowLeft size={18} color="#8F251F" />
          <Text style={styles.backText}>Voltar para entrar</Text>
        </Pressable>
      </View>
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
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
  success: {
    backgroundColor: "#E7F2EA",
    borderColor: "#C5DEC9",
    color: "#1E5B35",
  },
  footerRow: {
    alignItems: "center",
  },
  backLink: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    paddingVertical: 4,
  },
  backText: {
    color: "#8F251F",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0,
  },
});

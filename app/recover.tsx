import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { ArrowLeft, LockKeyhole, Save, UserRound } from "lucide-react-native";

import { AuthButton } from "@/components/AuthButton";
import { AuthInput } from "@/components/AuthInput";
import { AuthScaffold } from "@/components/AuthScaffold";
import { apiRequest } from "@/lib/api";

export default function RecoverScreen() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const canSubmit = useMemo(
    () =>
      login.trim().length >= 3 &&
      password.length >= 6 &&
      password === confirmPassword,
    [confirmPassword, login, password]
  );

  async function handleRecover() {
    setMessage("");
    setSuccess(false);

    if (!canSubmit) {
      setMessage("Informe o usuário e repita a nova senha corretamente.");
      return;
    }

    try {
      setLoading(true);
      const result = await apiRequest<{ ok: boolean; message: string }>("/auth/recover", {
        method: "POST",
        body: JSON.stringify({
          login: login.trim(),
          password,
          confirmPassword,
        }),
      });
      setMessage(result.message || "Senha atualizada. Você já pode entrar.");
      setSuccess(true);
    } catch (error) {
      setSuccess(false);
      setMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar a senha agora."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScaffold
      eyebrow="Recuperar acesso"
      title="Crie uma nova senha"
      subtitle="Informe o usuário da conta e defina uma senha nova localmente."
    >
      <AuthInput
        autoCapitalize="none"
        autoComplete="username"
        icon={<UserRound size={21} color="#8F251F" />}
        label="Usuário"
        onChangeText={setLogin}
        placeholder="Digite seu usuário"
        returnKeyType="next"
        value={login}
      />

      <AuthInput
        autoCapitalize="none"
        icon={<LockKeyhole size={21} color="#8F251F" />}
        label="Nova senha"
        onChangeText={setPassword}
        placeholder="Digite a nova senha"
        returnKeyType="next"
        secureTextEntry
        secureToggle
        value={password}
      />

      <AuthInput
        autoCapitalize="none"
        icon={<LockKeyhole size={21} color="#8F251F" />}
        label="Confirmar nova senha"
        onChangeText={setConfirmPassword}
        onSubmitEditing={handleRecover}
        placeholder="Repita a nova senha"
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
        icon={<Save size={19} color="#FFF4E2" />}
        loading={loading}
        onPress={handleRecover}
      >
        Salvar nova senha
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

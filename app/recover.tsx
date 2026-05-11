import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { ArrowLeft, Mail, Send } from "lucide-react-native";

import { AuthButton } from "@/components/AuthButton";
import { AuthInput } from "@/components/AuthInput";
import { AuthScaffold } from "@/components/AuthScaffold";
import { apiRequest } from "@/lib/api";

export default function RecoverScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const canSubmit = useMemo(() => email.trim().includes("@"), [email]);

  async function handleRecover() {
    setMessage("");
    setSuccess(false);

    if (!canSubmit) {
      setMessage("Informe o e-mail cadastrado para continuar.");
      return;
    }

    try {
      setLoading(true);
      await apiRequest<{ ok: boolean; message: string }>("/auth/recover", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      });
      setSuccess(true);
      setMessage("Se este e-mail estiver cadastrado, você receberá as instruções.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível solicitar a recuperação agora."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScaffold
      eyebrow="Recuperar acesso"
      title="Vamos ajudar você"
      subtitle="Digite o e-mail da sua conta para receber o próximo passo."
    >
      <AuthInput
        autoCapitalize="none"
        autoComplete="email"
        icon={<Mail size={21} color="#8F251F" />}
        keyboardType="email-address"
        label="E-mail"
        onChangeText={setEmail}
        onSubmitEditing={handleRecover}
        placeholder="cliente@riffrecords.com"
        returnKeyType="send"
        value={email}
      />

      {message ? (
        <Text style={[styles.feedback, success ? styles.success : styles.error]}>
          {message}
        </Text>
      ) : null}

      <AuthButton
        disabled={!canSubmit}
        icon={<Send size={19} color="#FFF4E2" />}
        loading={loading}
        onPress={handleRecover}
      >
        Enviar instruções
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

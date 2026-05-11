import { Platform, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { CheckCircle2, LogOut, ShieldCheck } from "lucide-react-native";

import { AuthButton } from "@/components/AuthButton";

export default function HomeScreen() {
  const params = useLocalSearchParams<{ name?: string; email?: string }>();
  const { width } = useWindowDimensions();
  const isWide = width >= 760;
  const displayName = params.name || "você";

  return (
    <View style={styles.screen}>
      <View style={[styles.panel, isWide ? styles.panelWide : styles.panelNarrow]}>
        <View style={styles.iconBadge}>
          <CheckCircle2 size={34} color="#8F251F" />
        </View>

        <Text style={styles.eyebrow}>Acesso liberado</Text>
        <Text style={styles.title}>Olá, {displayName}</Text>
        <Text style={styles.subtitle}>
          Sua conta está pronta para comprar vinis e acompanhar seus pedidos.
        </Text>

        <View style={styles.statusBox}>
          <ShieldCheck size={22} color="#8F251F" />
          <View style={styles.statusTextGroup}>
            <Text style={styles.statusTitle}>Sessão segura</Text>
            <Text style={styles.statusText}>
              {params.email || "Seu acesso"} foi validado com sucesso.
            </Text>
          </View>
        </View>

        <AuthButton
          icon={<LogOut size={20} color="#FFF4E2" />}
          onPress={() => router.replace("/")}
        >
          Sair
        </AuthButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: "center",
    backgroundColor: "#F6EFE3",
    flex: 1,
    justifyContent: "center",
    padding: 22,
  },
  panel: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D7C4AE",
    borderRadius: 28,
    borderWidth: 1,
    gap: 18,
    padding: 26,
    ...Platform.select({
      web: {
        boxShadow: "0 20px 30px rgba(31, 18, 14, 0.13)",
      },
      default: {
        shadowColor: "#1F120E",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.13,
        shadowRadius: 30,
        elevation: 8,
      },
    }),
  },
  panelWide: {
    maxWidth: 520,
    width: "100%",
  },
  panelNarrow: {
    width: "100%",
  },
  iconBadge: {
    alignItems: "center",
    backgroundColor: "#FFF3D6",
    borderRadius: 22,
    height: 68,
    justifyContent: "center",
    width: 68,
  },
  eyebrow: {
    color: "#B91F1A",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  title: {
    color: "#18110F",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 40,
  },
  subtitle: {
    color: "#5F514A",
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0,
    lineHeight: 24,
  },
  statusBox: {
    alignItems: "center",
    backgroundColor: "#FCF5EA",
    borderColor: "#D7C4AE",
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 16,
  },
  statusTextGroup: {
    flex: 1,
    gap: 4,
  },
  statusTitle: {
    color: "#18110F",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0,
  },
  statusText: {
    color: "#5F514A",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 20,
  },
});

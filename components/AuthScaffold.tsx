import { ReactNode } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Disc3, Zap } from "lucide-react-native";

type AuthScaffoldProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AuthScaffold({
  eyebrow,
  title,
  subtitle,
  children,
}: AuthScaffoldProps) {
  const { width } = useWindowDimensions();
  const isWaitingForWebWidth = Platform.OS === "web" && (!width || width < 1);
  const isWide = isWaitingForWebWidth || width >= 900;
  const isCompact = !isWide && width < 560;
  const isPhone = !isWide && width < 430;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboard}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <View
            nativeID="auth-shell"
            style={[
              styles.shell,
              isWide ? styles.scrollWide : styles.scrollNarrow,
            ]}
          >
            <View
              nativeID="auth-hero"
              style={[
                styles.heroPane,
                isWide ? styles.heroWide : styles.heroNarrow,
                isCompact && styles.heroCompact,
                isPhone && styles.heroPhone,
              ]}
            >
              <Image
                nativeID="auth-hero-image"
                source={require("../assets/images/rock-login-wide.jpg")}
                resizeMode="cover"
                style={[
                  styles.heroImage,
                  isWide ? styles.heroImageWide : styles.heroImageNarrow,
                  isCompact && styles.heroImageCompact,
                ]}
              />
              <View style={[styles.heroOverlay, isCompact && styles.heroOverlayCompact]} />

              <View
                nativeID="auth-hero-copy"
                style={[
                  styles.heroCopy,
                  !isWide && styles.heroCopyNarrow,
                  isCompact && styles.heroCopyCompact,
                  isPhone && styles.heroCopyPhone,
                ]}
              >
                <Text style={styles.heroKicker}>Riff Records</Text>
                <Text
                  nativeID="auth-hero-title"
                  style={[
                    styles.heroTitle,
                    !isWide && styles.heroTitleNarrow,
                    isCompact && styles.heroTitleCompact,
                    isPhone && styles.heroTitlePhone,
                  ]}
                >
                  Seu vinil de rock começa aqui.
                </Text>
                <Text
                  nativeID="auth-hero-subtitle"
                  style={[
                    styles.heroSubtitle,
                    isCompact && styles.heroSubtitleCompact,
                    isPhone && styles.heroSubtitlePhone,
                  ]}
                >
                  Entre para guardar favoritos, acompanhar pedidos e descobrir discos
                  que merecem volume alto.
                </Text>
              </View>
            </View>

            <View
              nativeID="auth-form-pane"
              style={[
                styles.formPane,
                isWide ? styles.formWide : styles.formNarrow,
                isCompact && styles.formCompact,
                isPhone && styles.formPhone,
              ]}
            >
              <View
                nativeID="auth-form-content"
                style={[
                  styles.formContent,
                  isCompact && styles.formContentCompact,
                  isPhone && styles.formContentPhone,
                ]}
              >
                <View style={styles.logoWrap}>
                  <View
                    nativeID="auth-brand-mark"
                    accessibilityLabel="Riff Records"
                    style={[styles.brandMark, isCompact && styles.brandMarkCompact]}
                  >
                    <Disc3 size={isCompact ? 44 : 54} color="#FFF4E2" />
                    <View style={styles.brandBolt}>
                      <Zap size={isCompact ? 18 : 21} color="#FFCF57" fill="#FFCF57" />
                    </View>
                  </View>
                  <Text style={[styles.brandName, isCompact && styles.brandNameCompact]}>
                    RIFF RECORDS
                  </Text>
                  <Text style={styles.brandTagline}>Vinis de rock</Text>
                </View>
                <View style={styles.formDivider}>
                  <View style={styles.formDividerLine} />
                  <View style={styles.formDividerDot} />
                  <View style={styles.formDividerLine} />
                </View>
                <Text style={[styles.eyebrow, isCompact && styles.eyebrowCompact]}>
                  {eyebrow}
                </Text>
                <Text
                  nativeID="auth-title"
                  style={[
                    styles.title,
                    isCompact && styles.titleCompact,
                    isPhone && styles.titlePhone,
                  ]}
                >
                  {title}
                </Text>
                <Text
                  nativeID="auth-subtitle"
                  style={[
                    styles.subtitle,
                    isCompact && styles.subtitleCompact,
                    isPhone && styles.subtitlePhone,
                  ]}
                >
                  {subtitle}
                </Text>
                <View style={[styles.formBody, isCompact && styles.formBodyCompact]}>
                  {children}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#0F0D0B",
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  shell: {
    flexGrow: 1,
    width: "100%",
  },
  scrollWide: {
    flexDirection: "row",
    minHeight: "100%",
  },
  scrollNarrow: {
    paddingBottom: 28,
  },
  heroPane: {
    backgroundColor: "#120D0B",
    overflow: "hidden",
    position: "relative",
  },
  heroWide: {
    alignSelf: "stretch",
    minHeight: 760,
    width: "58%",
  },
  heroNarrow: {
    height: 320,
    width: "100%",
  },
  heroCompact: {
    height: 280,
  },
  heroPhone: {
    height: 260,
  },
  heroImage: {
    bottom: 0,
    height: "100%",
    opacity: 0.9,
    position: "absolute",
    right: 0,
    top: 0,
    width: "100%",
  },
  heroImageWide: {
    width: "100%",
  },
  heroImageNarrow: {
    width: "100%",
  },
  heroImageCompact: {
    opacity: 0.72,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 5, 4, 0.24)",
  },
  heroOverlayCompact: {
    backgroundColor: "rgba(10, 5, 4, 0.48)",
  },
  heroCopy: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 560,
    paddingHorizontal: 44,
    paddingVertical: 42,
    position: "relative",
    zIndex: 1,
  },
  heroCopyNarrow: {
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
  heroCopyCompact: {
    maxWidth: 350,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  heroCopyPhone: {
    maxWidth: 188,
    paddingHorizontal: 18,
    paddingVertical: 22,
    width: 188,
  },
  heroKicker: {
    color: "#FFCF57",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0,
    marginBottom: 16,
    textTransform: "uppercase",
  },
  heroTitle: {
    color: "#FFF3E0",
    fontSize: 48,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 54,
  },
  heroTitleNarrow: {
    fontSize: 34,
    lineHeight: 40,
  },
  heroTitleCompact: {
    fontSize: 28,
    lineHeight: 34,
  },
  heroTitlePhone: {
    fontSize: 24,
    lineHeight: 30,
    maxWidth: 176,
  },
  heroSubtitle: {
    color: "#E9D3BC",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0,
    lineHeight: 28,
    marginTop: 18,
  },
  heroSubtitleCompact: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 12,
  },
  heroSubtitlePhone: {
    fontSize: 13,
    lineHeight: 20,
    maxWidth: 176,
  },
  formPane: {
    alignItems: "center",
    backgroundColor: "#F6EFE3",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 44,
    width: "100%",
  },
  formWide: {
    alignSelf: "stretch",
    flex: 1,
  },
  formNarrow: {
    alignSelf: "center",
  },
  formCompact: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  formPhone: {
    paddingHorizontal: 18,
    paddingVertical: 28,
  },
  formContent: {
    maxWidth: 470,
    width: "100%",
  },
  formContentCompact: {
    maxWidth: 410,
  },
  formContentPhone: {
    maxWidth: 380,
  },
  logoWrap: {
    alignItems: "center",
    gap: 8,
    marginBottom: 18,
    width: "100%",
  },
  brandMark: {
    alignItems: "center",
    backgroundColor: "#17110F",
    borderColor: "#C4211C",
    borderRadius: 36,
    borderWidth: 2,
    height: 84,
    justifyContent: "center",
    position: "relative",
    width: 84,
  },
  brandMarkCompact: {
    borderRadius: 30,
    height: 70,
    width: 70,
  },
  brandBolt: {
    alignItems: "center",
    backgroundColor: "#B91F1A",
    borderRadius: 999,
    bottom: 2,
    height: 30,
    justifyContent: "center",
    position: "absolute",
    right: 0,
    width: 30,
  },
  brandName: {
    color: "#17110F",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 0,
  },
  brandNameCompact: {
    fontSize: 22,
  },
  brandTagline: {
    color: "#8F251F",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  formDivider: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginBottom: 24,
  },
  formDividerLine: {
    backgroundColor: "#C89B3F",
    height: 2,
    maxWidth: 72,
    opacity: 0.65,
    width: "22%",
  },
  formDividerDot: {
    backgroundColor: "#B91F1A",
    borderRadius: 999,
    height: 8,
    width: 8,
  },
  eyebrow: {
    color: "#B91F1A",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
    marginBottom: 12,
    textTransform: "uppercase",
  },
  eyebrowCompact: {
    fontSize: 12,
  },
  title: {
    color: "#18110F",
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 48,
  },
  titleCompact: {
    fontSize: 32,
    lineHeight: 38,
  },
  titlePhone: {
    fontSize: 30,
    lineHeight: 36,
  },
  subtitle: {
    color: "#5F514A",
    fontSize: 17,
    fontWeight: "500",
    letterSpacing: 0,
    lineHeight: 26,
    marginTop: 14,
  },
  subtitleCompact: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
  },
  subtitlePhone: {
    fontSize: 14,
    lineHeight: 21,
  },
  formBody: {
    gap: 18,
    marginTop: 32,
  },
  formBodyCompact: {
    gap: 15,
    marginTop: 26,
  },
});

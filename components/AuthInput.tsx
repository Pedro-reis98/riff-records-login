import { ReactNode, useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";

type AuthInputProps = TextInputProps & {
  label: string;
  icon: ReactNode;
  error?: string;
  secureToggle?: boolean;
};

export function AuthInput({
  label,
  icon,
  error,
  secureTextEntry,
  secureToggle,
  onBlur,
  onFocus,
  style,
  ...props
}: AuthInputProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(Boolean(secureTextEntry));
  const focusAnim = useRef(new Animated.Value(0)).current;

  function setFocus(nextFocused: boolean) {
    setFocused(nextFocused);
    Animated.timing(focusAnim, {
      toValue: nextFocused ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [error ? "#C7443D" : "#D7C4AE", "#B91F1A"],
  });

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <Animated.View
        style={[
          styles.inputShell,
          {
            borderColor,
            backgroundColor: focused ? "#FFFDF7" : "#FCF5EA",
          },
        ]}
      >
        <View style={styles.iconSlot}>{icon}</View>
        <TextInput
          {...props}
          onBlur={(event) => {
            setFocus(false);
            onBlur?.(event);
          }}
          onFocus={(event) => {
            setFocus(true);
            onFocus?.(event);
          }}
          placeholderTextColor="#87756F"
          secureTextEntry={hidden}
          style={[styles.input, style]}
        />
        {secureToggle ? (
          <Pressable
            accessibilityLabel={hidden ? "Mostrar senha" : "Ocultar senha"}
            onPress={() => setHidden((value) => !value)}
            style={styles.eyeButton}
          >
            {hidden ? (
              <Eye size={20} color="#5F514A" />
            ) : (
              <EyeOff size={20} color="#5F514A" />
            )}
          </Pressable>
        ) : null}
      </Animated.View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    color: "#201714",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0,
  },
  inputShell: {
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 60,
    paddingHorizontal: 14,
    ...Platform.select({
      web: {
        boxShadow: "0 10px 24px rgba(31, 18, 14, 0.07)",
      },
      default: {
        shadowColor: "#1F120E",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 1,
      },
    }),
  },
  iconSlot: {
    alignItems: "center",
    backgroundColor: "#EAD8BE",
    borderRadius: 12,
    height: 34,
    justifyContent: "center",
    marginRight: 12,
    width: 34,
  },
  input: {
    color: "#1B1412",
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0,
    minWidth: 0,
    outlineStyle: "none" as never,
    paddingVertical: 14,
  },
  eyeButton: {
    alignItems: "center",
    height: 38,
    justifyContent: "center",
    marginLeft: 8,
    width: 38,
  },
  error: {
    color: "#B91F1A",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0,
  },
});

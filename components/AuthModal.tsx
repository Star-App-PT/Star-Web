import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSkip?: () => void;
}

// TESTING ONLY - remove skip link before going live
export default function AuthModal({ visible, onClose, onSuccess, onSkip }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const reset = () => {
    setEmail("");
    setPassword("");
    setName("");
    setMode("signup");
  };

  const handleSubmit = () => {
    reset();
    onSuccess();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <Pressable onPress={handleClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#111827" />
          </Pressable>
          <Text style={styles.headerTitle}>
            {mode === "signup" ? "Sign up" : "Log in"}
          </Text>
          <View style={styles.closeBtn} />
        </View>

        <View style={styles.body}>
          <Text style={styles.welcomeTitle}>Welcome to STAR</Text>
          <Text style={styles.welcomeSubtitle}>
            {mode === "signup"
              ? "Create an account to get started"
              : "Log in to your account"}
          </Text>

          {mode === "signup" && (
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Full name</Text>
              <TextInput
                style={styles.input}
                placeholder="Your full name"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Your password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <Pressable style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>
              {mode === "signup" ? "Sign up" : "Log in"}
            </Text>
          </Pressable>

          {/* TESTING ONLY - remove skip link before going live */}
          {onSkip && (
            <Pressable style={styles.skipLink} onPress={onSkip}>
              <Text style={styles.skipLinkText}>Skip (Testing Only)</Text>
            </Pressable>
          )}

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>
              {mode === "signup"
                ? "Already have an account?"
                : "Don't have an account?"}
            </Text>
            <Pressable
              onPress={() => setMode(mode === "signup" ? "login" : "signup")}
            >
              <Text style={styles.switchLink}>
                {mode === "signup" ? "Log in" : "Sign up"}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  closeBtn: { width: 40, alignItems: "center" },
  headerTitle: { fontSize: 16, fontWeight: "600", color: "#111827" },
  body: { padding: 24 },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 28,
  },
  field: { marginBottom: 16 },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
  },
  submitBtn: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: "#1B4FBA",
    alignItems: "center",
  },
  submitBtnText: { fontSize: 16, fontWeight: "600", color: "#FFFFFF" },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    gap: 6,
  },
  skipLink: { alignItems: "center" as const, marginTop: 14 },
  skipLinkText: { fontSize: 12, color: "#9CA3AF" },
  switchText: { fontSize: 14, color: "#6B7280" },
  switchLink: { fontSize: 14, fontWeight: "600", color: "#111827" },
});

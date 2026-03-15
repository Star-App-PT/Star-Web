import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
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
  const [phone, setPhone] = useState("");

  const reset = () => {
    setPhone("");
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
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={handleClose} style={styles.closeBtn}>
            <Ionicons name="close" size={22} color="#111827" />
          </Pressable>
          <Text style={styles.headerTitle}>Log in or sign up</Text>
          <View style={styles.closeBtn} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.welcomeTitle}>Welcome to STAR</Text>

          <View style={styles.phoneBox}>
            <View style={styles.countryRow}>
              <Text style={styles.countryLabel}>Country/Region</Text>
              <View style={styles.countrySelector}>
                <Text style={styles.countryValue}>🇵🇹 Portugal (+351)</Text>
                <Ionicons name="chevron-down" size={18} color="#6B7280" />
              </View>
            </View>
            <View style={styles.phoneDivider} />
            <TextInput
              style={styles.phoneInput}
              placeholder="Phone number"
              placeholderTextColor="#9CA3AF"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <Text style={styles.phoneHint}>
            We'll call or text you to confirm your number.
          </Text>

          <Pressable style={styles.continueBtn} onPress={handleSubmit}>
            <Text style={styles.continueBtnText}>Continue</Text>
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable style={styles.socialBtn} onPress={handleSubmit}>
            <Text style={styles.socialIcon}>G</Text>
            <Text style={styles.socialBtnText}>Continue with Google</Text>
          </Pressable>

          <Pressable style={styles.socialBtn} onPress={handleSubmit}>
            <Ionicons name="logo-apple" size={20} color="#111827" />
            <Text style={styles.socialBtnText}>Continue with Apple</Text>
          </Pressable>

          <Pressable style={styles.socialBtn} onPress={handleSubmit}>
            <Ionicons name="mail-outline" size={20} color="#111827" />
            <Text style={styles.socialBtnText}>Continue with email</Text>
          </Pressable>

          {/* TESTING ONLY - remove skip link before going live */}
          {onSkip && (
            <Pressable style={styles.skipLink} onPress={onSkip}>
              <Text style={styles.skipLinkText}>Skip (Testing Only)</Text>
            </Pressable>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scroll: { flex: 1 },
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
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
  },
  phoneBox: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 8,
  },
  countryRow: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  countryLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 2,
  },
  countrySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  countryValue: {
    fontSize: 15,
    color: "#111827",
  },
  phoneDivider: {
    height: 1,
    backgroundColor: "#D1D5DB",
  },
  phoneInput: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: "#111827",
  },
  phoneHint: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 20,
  },
  continueBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#1B4FBA",
    alignItems: "center",
    marginBottom: 20,
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    fontSize: 13,
    color: "#6B7280",
  },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#111827",
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
    gap: 10,
  },
  socialIcon: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4285F4",
  },
  socialBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  skipLink: {
    alignItems: "center",
    marginTop: 8,
  },
  skipLinkText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
});

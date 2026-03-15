import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useState } from "react";
import { useRouter, Redirect } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";

export default function FinishProfile() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isLoggedIn) {
    return <Redirect href="/" />;
  }

  const handleContinue = () => {
    router.push("/worker/commitment");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Finish your profile</Text>
      <Text style={styles.subtitle}>
        We need a few details to set up your STAR account.
      </Text>

      <View style={styles.row}>
        <View style={[styles.field, styles.half]}>
          <Text style={styles.fieldLabel}>Legal first name</Text>
          <TextInput
            style={styles.input}
            placeholder="First name"
            placeholderTextColor="#9CA3AF"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
          />
        </View>
        <View style={[styles.field, styles.half]}>
          <Text style={styles.fieldLabel}>Legal last name</Text>
          <TextInput
            style={styles.input}
            placeholder="Last name"
            placeholderTextColor="#9CA3AF"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
          />
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Date of birth</Text>
        <TextInput
          style={styles.input}
          placeholder="DD / MM / YYYY"
          placeholderTextColor="#9CA3AF"
          value={dob}
          onChangeText={setDob}
        />
      </View>

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
          placeholder="Create a password"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <Text style={styles.legalText}>
        By selecting Agree and continue, I agree to STAR's Terms of Service,
        Payments Terms of Service, and Nondiscrimination Policy and acknowledge
        the Privacy Policy.
      </Text>

      <Pressable style={styles.agreeBtn} onPress={handleContinue}>
        <Text style={styles.agreeBtnText}>Agree and continue</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { padding: 24, paddingBottom: 48 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 28,
  },
  row: { flexDirection: "row", gap: 12 },
  field: { marginBottom: 16 },
  half: { flex: 1 },
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
  legalText: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 18,
    marginBottom: 20,
    marginTop: 8,
  },
  agreeBtn: {
    paddingVertical: 16,
    borderRadius: 999,
    backgroundColor: "#1B4FBA",
    alignItems: "center",
  },
  agreeBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

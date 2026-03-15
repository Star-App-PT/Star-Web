import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import AppHeader from "../../components/AppHeader";

export default function CommunityCommitment() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Redirect href="/" />;
  }

  const handleAgree = () => {
    router.replace("/worker/category");
  };

  const handleDecline = () => {
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.starIconWrap}>
            <Ionicons name="star" size={36} color="#1B4FBA" />
          </View>

          <Text style={styles.label}>Our community commitment</Text>

          <Text style={styles.heading}>
            STAR is a community where everyone is welcome
          </Text>

          <Text style={styles.body}>
            To ensure this, we're asking you to commit to the following:
          </Text>

          <Text style={styles.commitment}>
            I agree to treat everyone in the STAR community — regardless of
            their race, religion, national origin, ethnicity, disability, sex,
            gender identity, sexual orientation, or age — with respect, and
            without judgment or bias.
          </Text>

          <Pressable style={styles.agreeBtn} onPress={handleAgree}>
            <Text style={styles.agreeBtnText}>Agree and continue</Text>
          </Pressable>

          <Pressable style={styles.declineBtn} onPress={handleDecline}>
            <Text style={styles.declineBtnText}>Decline</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },
  scroll: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    maxWidth: 480,
    alignSelf: "center",
    width: "100%",
  },
  starIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EBF0FA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 30,
  },
  body: {
    fontSize: 15,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  commitment: {
    fontSize: 15,
    color: "#374151",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 28,
    paddingHorizontal: 4,
  },
  agreeBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 999,
    backgroundColor: "#1B4FBA",
    alignItems: "center",
    marginBottom: 12,
  },
  agreeBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  declineBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
  },
  declineBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
});

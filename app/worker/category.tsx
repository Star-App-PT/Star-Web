import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter, Redirect } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";

const CATEGORIES = [
  {
    id: "cleaner",
    label: "Cleaner",
    description: "Cleaning homes, offices, cars and more",
    image: require("../../assets/icon-clean.png"),
    route: "/worker/profile/cleaner" as const,
  },
  {
    id: "handyman",
    label: "Handyman",
    description: "Plumbing, electrical, bricklaying and repairs",
    image: require("../../assets/icon-repair.png"),
    route: "/worker/profile/cleaner" as const,
  },
  {
    id: "services",
    label: "Services",
    description: "Hair, massage, home spa and personal care",
    image: require("../../assets/icon-services.png"),
    route: "/worker/profile/cleaner" as const,
  },
] as const;

export default function WorkerCategorySelection() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Redirect href="/" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What work best describes you?</Text>
      <Text style={styles.subtitle}>
        Choose a category to get started. You can always add more later.
      </Text>

      <View style={styles.cards}>
        {CATEGORIES.map((cat) => (
          <Pressable
            key={cat.id}
            style={styles.card}
            onPress={() => router.push(cat.route)}
          >
            <Image
              source={cat.image}
              style={styles.cardImage}
              resizeMode="contain"
            />
            <View style={styles.cardText}>
              <Text style={styles.cardLabel}>{cat.label}</Text>
              <Text style={styles.cardDescription}>{cat.description}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 32,
  },
  cards: { gap: 16 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardImage: {
    width: 72,
    height: 72,
    marginRight: 16,
  },
  cardText: { flex: 1 },
  cardLabel: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
});

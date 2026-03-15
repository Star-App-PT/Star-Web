import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useLocalSearchParams, useRouter, Redirect } from "expo-router";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

interface SubcategoryItem {
  id: string;
  label: string;
  icon: string;
}

const SUBCATEGORIES: Record<string, SubcategoryItem[]> = {
  cleaning: [
    { id: "deep-clean", label: "Deep Clean", icon: "🧹" },
    { id: "regular-clean", label: "Regular Clean", icon: "🏠" },
    { id: "post-build", label: "Post-Build", icon: "🏗️" },
    { id: "end-tenancy", label: "End Tenancy", icon: "🔑" },
    { id: "office-clean", label: "Office Clean", icon: "🏢" },
    { id: "carpet-clean", label: "Carpet Clean", icon: "🧽" },
    { id: "windows", label: "Windows", icon: "🪟" },
    { id: "oven-clean", label: "Oven Clean", icon: "🍳" },
    { id: "garage-clean", label: "Garage Clean", icon: "🚗" },
    { id: "after-party", label: "After-Party", icon: "🎉" },
    { id: "car-detailing", label: "Car Detailing", icon: "✨" },
  ],
  repairs: [
    { id: "plumbing", label: "Plumbing", icon: "🔧" },
    { id: "electrical", label: "Electrical", icon: "⚡" },
    { id: "painting", label: "Painting", icon: "🎨" },
    { id: "tiling", label: "Tiling", icon: "🔲" },
    { id: "carpentry", label: "Carpentry", icon: "🪚" },
    { id: "assembly", label: "Assembly", icon: "🛠️" },
    { id: "appliances", label: "Appliances", icon: "🔌" },
    { id: "flooring", label: "Flooring", icon: "🪵" },
    { id: "plastering", label: "Plastering", icon: "🧱" },
    { id: "locksmith", label: "Locksmith", icon: "🔐" },
  ],
  services: [
    { id: "photography", label: "Photography", icon: "📸" },
    { id: "chefs", label: "Chefs", icon: "👨‍🍳" },
    { id: "massage", label: "Massage", icon: "💆" },
    { id: "prepared-meals", label: "Prepared Meals", icon: "🍱" },
    { id: "training", label: "Training", icon: "💪" },
    { id: "makeup", label: "Makeup", icon: "💄" },
    { id: "hair", label: "Hair", icon: "💇" },
    { id: "spa-treatments", label: "Spa Treatments", icon: "🧖" },
    { id: "catering", label: "Catering", icon: "🍽️" },
    { id: "nails", label: "Nails", icon: "💅" },
  ],
};

const COLUMNS = 5;
const CARD_GAP = 12;

export default function SubcategorySelection() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { category } = useLocalSearchParams<{ category: string }>();
  const { width: screenWidth } = useWindowDimensions();

  const [selected, setSelected] = useState<string[]>([]);

  if (!isLoggedIn) {
    return <Redirect href="/" />;
  }

  const items = SUBCATEGORIES[category ?? ""] ?? SUBCATEGORIES.cleaning;

  const contentPadding = 32;
  const availableWidth = Math.min(screenWidth, 720) - contentPadding * 2;
  const cardWidth = (availableWidth - CARD_GAP * (COLUMNS - 1)) / COLUMNS;

  const toggleSelection = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const canContinue = selected.length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <View style={styles.topBarSpacer} />
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Back</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Which service will you provide?</Text>
        <Text style={styles.subtitle}>
          You can always add more services later.
        </Text>

        <View style={[styles.grid, { maxWidth: 720 }]}>
          {items.map((item) => {
            const isSelected = selected.includes(item.id);
            return (
              <Pressable
                key={item.id}
                style={[
                  styles.card,
                  { width: cardWidth },
                  isSelected && styles.cardSelected,
                ]}
                onPress={() => toggleSelection(item.id)}
              >
                <Text style={styles.cardIcon}>{item.icon}</Text>
                <Text
                  style={[
                    styles.cardLabel,
                    isSelected && styles.cardLabelSelected,
                  ]}
                  numberOfLines={2}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerInner}>
          <Pressable
            style={[styles.continueBtn, !canContinue && styles.continueBtnDisabled]}
            onPress={() => {
              if (canContinue) {
                router.push("/worker/profile/cleaner");
              }
            }}
            disabled={!canContinue}
          >
            <Text
              style={[
                styles.continueBtnText,
                !canContinue && styles.continueBtnTextDisabled,
              ]}
            >
              Continue
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  topBarSpacer: { flex: 1 },
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  scroll: { flex: 1 },
  scrollContent: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 36,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: CARD_GAP,
    justifyContent: "center",
    alignSelf: "center",
    width: "100%",
  },
  card: {
    aspectRatio: 0.9,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    paddingVertical: 12,
  },
  cardSelected: {
    borderColor: "#1B4FBA",
    borderWidth: 2.5,
    backgroundColor: "#F5F8FF",
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
    lineHeight: 17,
  },
  cardLabelSelected: {
    color: "#1B4FBA",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  footerInner: {
    flexDirection: "row",
    justifyContent: "flex-end",
    maxWidth: 720,
    alignSelf: "center",
    width: "100%",
  },
  continueBtn: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: "#1B4FBA",
  },
  continueBtnDisabled: {
    backgroundColor: "#93A8D6",
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  continueBtnTextDisabled: {
    color: "#D6DFF2",
  },
});

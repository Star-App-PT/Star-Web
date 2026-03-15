import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

const CLEANER_SKILL_IDS = [
  "deepCleaning",
  "glassCleaning",
  "exitCleaning",
  "homeCleaning",
  "bathCleaning",
  "kitchenClean",
  "fridgeDetail",
  "floorCleaning",
  "sofaCleaning",
  "workCleaning",
  "buildCleaning",
  "hostCleaning",
  "laundryClean",
  "patioCleanup",
  "carValeting",
  "autoDetailing",
] as const;

const SKILL_LABELS: Record<(typeof CLEANER_SKILL_IDS)[number], string> = {
  deepCleaning: "Deep Cleaning",
  glassCleaning: "Glass Cleaning",
  exitCleaning: "Exit Cleaning",
  homeCleaning: "Home Cleaning",
  bathCleaning: "Bath Cleaning",
  kitchenClean: "Kitchen Clean",
  fridgeDetail: "Fridge Detail",
  floorCleaning: "Floor Cleaning",
  sofaCleaning: "Sofa Cleaning",
  workCleaning: "Work Cleaning",
  buildCleaning: "Build Cleaning",
  hostCleaning: "Host Cleaning",
  laundryClean: "Laundry Clean",
  patioCleanup: "Patio Cleanup",
  carValeting: "Car Valeting",
  autoDetailing: "Auto Detailing",
};

export default function WorkerProfileCleaner() {
  const router = useRouter();

  // Skills
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [otherSkill, setOtherSkill] = useState("");

  // Basic info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("");
  const [dob, setDob] = useState("");

  const toggleSkill = (id: string) => {
    setSelectedSkills((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Tell us more about you</Text>
      <Text style={styles.subtitle}>
        Choose the cleaning services you offer. You can select more than one.
      </Text>

      {/* Cleaning skills */}
      <Text style={styles.sectionLabel}>Your cleaning services</Text>
      <Text style={styles.hint}>Click on every one that applies to you.</Text>
      <View style={styles.skillsWrap}>
        {CLEANER_SKILL_IDS.map((id) => (
          <Pressable
            key={id}
            style={[
              styles.skillPill,
              selectedSkills.includes(id) && styles.skillPillSelected,
            ]}
            onPress={() => toggleSkill(id)}
          >
            <Text
              style={[
                styles.skillPillText,
                selectedSkills.includes(id) && styles.skillPillTextSelected,
              ]}
            >
              {SKILL_LABELS[id]}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Other */}
      <Text style={styles.sectionLabel}>Other</Text>
      <TextInput
        style={styles.otherInput}
        placeholder="Add any other cleaning skills here"
        placeholderTextColor="#9CA3AF"
        value={otherSkill}
        onChangeText={setOtherSkill}
        multiline
      />

      {/* Basic information */}
      <Text style={styles.sectionLabel}>Basic information</Text>

      <View style={styles.row}>
        <View style={[styles.field, styles.half]}>
          <Text style={styles.fieldLabel}>First name</Text>
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
          <Text style={styles.fieldLabel}>Last name</Text>
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
        <Text style={styles.fieldLabel}>Phone number</Text>
        <TextInput
          style={styles.input}
          placeholder="+351 912 345 678"
          placeholderTextColor="#9CA3AF"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Street and number"
          placeholderTextColor="#9CA3AF"
          value={addressLine1}
          onChangeText={setAddressLine1}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Address line 2 (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Apartment, suite, etc."
          placeholderTextColor="#9CA3AF"
          value={addressLine2}
          onChangeText={setAddressLine2}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.field, styles.half]}>
          <Text style={styles.fieldLabel}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="City"
            placeholderTextColor="#9CA3AF"
            value={city}
            onChangeText={setCity}
            autoCapitalize="words"
          />
        </View>
        <View style={[styles.field, styles.half]}>
          <Text style={styles.fieldLabel}>Postcode</Text>
          <TextInput
            style={styles.input}
            placeholder="Postcode"
            placeholderTextColor="#9CA3AF"
            value={postcode}
            onChangeText={setPostcode}
            keyboardType="default"
          />
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Country</Text>
        <TextInput
          style={styles.input}
          placeholder="Country"
          placeholderTextColor="#9CA3AF"
          value={country}
          onChangeText={setCountry}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Date of birth</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#9CA3AF"
          value={dob}
          onChangeText={setDob}
        />
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Back</Text>
        </Pressable>
        <Pressable
          style={styles.continueBtn}
          onPress={() => router.push("/worker/commitment")}
        >
          <Text style={styles.continueBtnText}>Continue</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  content: { padding: 16, paddingBottom: 40 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginTop: 20,
    marginBottom: 6,
  },
  hint: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 12,
  },
  skillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFF",
  },
  skillPillSelected: {
    borderColor: "#111827",
    backgroundColor: "#F3F4F6",
  },
  skillPillText: { fontSize: 14, fontWeight: "600", color: "#374151" },
  skillPillTextSelected: { color: "#111827" },
  otherInput: {
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
    minHeight: 80,
    textAlignVertical: "top",
  },
  row: { flexDirection: "row", gap: 12 },
  field: { marginBottom: 14 },
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
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 28,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 12,
  },
  backBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  backBtnText: { fontSize: 16, fontWeight: "600", color: "#374151" },
  continueBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: "#1B4FBA",
    alignItems: "center",
  },
  continueBtnText: { fontSize: 16, fontWeight: "600", color: "#FFF" },
});

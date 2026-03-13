import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState<
    "cleaners" | "handymen" | "services"
  >("cleaners");
  const [searchBarHovered, setSearchBarHovered] = useState(false);
  const pickedDatesLabel = "Aug 1 – Aug 3";

  const CITY_NAME = "Porto";
  const categoryLabel =
    selectedCategory === "cleaners"
      ? "cleaners"
      : selectedCategory === "handymen"
      ? "workers"
      : "services";

  const cleaners = [
    { id: "c1", name: "Maria S.", image: require("../assets/card-clean-1.png"), pricePerHour: 28, rating: 5.0 },
    { id: "c2", name: "Ana R.", image: require("../assets/card-clean-2.png"), pricePerHour: 32, rating: 4.89 },
    { id: "c3", name: "Inês T.", image: require("../assets/card-clean-3.png"), pricePerHour: 25, rating: 4.95 },
    { id: "c4", name: "Patrícia L.", image: require("../assets/card-clean-2.png"), pricePerHour: 30, rating: 4.8 },
    { id: "c5", name: "Helena V.", image: require("../assets/card-clean-1.png"), pricePerHour: 27, rating: 4.9 },
    { id: "c6", name: "Sara G.", image: require("../assets/card-clean-3.png"), pricePerHour: 29, rating: 4.7 },
    { id: "c7", name: "Joana C.", image: require("../assets/card-clean-2.png"), pricePerHour: 31, rating: 4.85 },
    { id: "c8", name: "Beatriz F.", image: require("../assets/card-clean-1.png"), pricePerHour: 26, rating: 4.9 },
    { id: "c9", name: "Andreia P.", image: require("../assets/card-clean-3.png"), pricePerHour: 33, rating: 4.88 },
    { id: "c10", name: "Carla N.", image: require("../assets/card-clean-2.png"), pricePerHour: 30, rating: 4.92 },
  ];

  const handymen = [
    { id: "h1", name: "João P.", image: require("../assets/card-repair-1.png"), pricePerHour: 35, rating: 4.92 },
    { id: "h2", name: "Miguel F.", image: require("../assets/card-repair-2.png"), pricePerHour: 42, rating: 5.0 },
    { id: "h3", name: "Rui L.", image: require("../assets/card-repair-3.png"), pricePerHour: 38, rating: 4.78 },
    { id: "h4", name: "Carlos D.", image: require("../assets/card-repair-2.png"), pricePerHour: 40, rating: 4.9 },
    { id: "h5", name: "Pedro S.", image: require("../assets/card-repair-1.png"), pricePerHour: 37, rating: 4.85 },
    { id: "h6", name: "Bruno T.", image: require("../assets/card-repair-3.png"), pricePerHour: 39, rating: 4.8 },
    { id: "h7", name: "Nuno R.", image: require("../assets/card-repair-1.png"), pricePerHour: 36, rating: 4.75 },
    { id: "h8", name: "Filipe M.", image: require("../assets/card-repair-2.png"), pricePerHour: 41, rating: 4.95 },
    { id: "h9", name: "Alex A.", image: require("../assets/card-repair-3.png"), pricePerHour: 34, rating: 4.7 },
    { id: "h10", name: "Daniel J.", image: require("../assets/card-repair-1.png"), pricePerHour: 38, rating: 4.88 },
  ];

  const services = [
    { id: "s1", name: "Carlos M.", image: require("../assets/card-services-1.png"), pricePerHour: 45, rating: 4.85 },
    { id: "s2", name: "Sofia N.", image: require("../assets/card-services-2.png"), pricePerHour: 55, rating: 5.0 },
    { id: "s3", name: "Tiago C.", image: require("../assets/card-services-3.png"), pricePerHour: 22, rating: 4.7 },
    { id: "s4", name: "Rita Q.", image: require("../assets/card-services-2.png"), pricePerHour: 48, rating: 4.9 },
    { id: "s5", name: "Luís H.", image: require("../assets/card-services-1.png"), pricePerHour: 52, rating: 4.95 },
    { id: "s6", name: "Marta E.", image: require("../assets/card-services-3.png"), pricePerHour: 30, rating: 4.8 },
    { id: "s7", name: "Patrícia J.", image: require("../assets/card-services-2.png"), pricePerHour: 60, rating: 5.0 },
    { id: "s8", name: "Gonçalo F.", image: require("../assets/card-services-1.png"), pricePerHour: 47, rating: 4.76 },
    { id: "s9", name: "Ingrid L.", image: require("../assets/card-services-3.png"), pricePerHour: 28, rating: 4.82 },
    { id: "s10", name: "Helder K.", image: require("../assets/card-services-1.png"), pricePerHour: 50, rating: 4.9 },
  ];

  const currentList =
    selectedCategory === "cleaners"
      ? cleaners
      : selectedCategory === "handymen"
      ? handymen
      : services;

  const subcategoryGroups =
    selectedCategory === "cleaners"
      ? [
          { label: "Car detailing", workers: cleaners.slice(0, 3) },
          { label: "Deep cleaning", workers: cleaners.slice(3, 6) },
          { label: "Yard cleaning", workers: cleaners.slice(6, 10) },
        ]
      : selectedCategory === "handymen"
      ? [
          { label: "Plumbing", workers: handymen.slice(0, 3) },
          { label: "Electrical", workers: handymen.slice(3, 6) },
          { label: "Brick layers", workers: handymen.slice(6, 10) },
        ]
      : [
          { label: "Hair", workers: services.slice(0, 3) },
          { label: "Massage", workers: services.slice(3, 6) },
          { label: "Home spa", workers: services.slice(6, 10) },
        ];

  const handleCategoryPress = (category: string) => {
    if (category === "CLEAN") setSelectedCategory("cleaners");
    if (category === "REPAIR") setSelectedCategory("handymen");
    if (category === "SERVICES") setSelectedCategory("services");
    Alert.alert("Coming soon", `${category} flow is not ready yet.`);
  };

  const handleSubcategoryPress = (subcategory: string) => {
    Alert.alert(subcategory, `Coming soon: ${subcategory} workers in your area.`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[styles.searchBar, searchBarHovered && styles.searchBarHover]}
          onMouseEnter={() => setSearchBarHovered(true)}
          onMouseLeave={() => setSearchBarHovered(false)}
        >
          <Ionicons name="search" size={20} color="#111827" style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Start your search</Text>
        </View>

        <View style={styles.categoryTabsShell}>
          <View style={styles.categoryTabs}>
            <Pressable
            style={[
              styles.categoryTab,
              selectedCategory === "cleaners" && styles.categoryTabActive,
            ]}
            onPress={() => handleCategoryPress("CLEAN")}
          >
            <Image
              source={require("../assets/icon-clean.png")}
              style={styles.categoryIcon}
              resizeMode="contain"
            />
            <Text style={styles.categoryTabLabel}>Clean</Text>
            </Pressable>

            <Pressable
            style={[
              styles.categoryTab,
              selectedCategory === "handymen" && styles.categoryTabActive,
            ]}
            onPress={() => handleCategoryPress("REPAIR")}
          >
            <Image
              source={require("../assets/icon-repair.png")}
              style={styles.categoryIcon}
              resizeMode="contain"
            />
            <Text style={styles.categoryTabLabel}>Repair</Text>
            </Pressable>

            <Pressable
            style={[
              styles.categoryTab,
              selectedCategory === "services" && styles.categoryTabActive,
            ]}
            onPress={() => handleCategoryPress("SERVICES")}
          >
            <Image
              source={require("../assets/icon-services.png")}
              style={styles.categoryIcon}
              resizeMode="contain"
            />
            <Text style={styles.categoryTabLabel}>Services</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.heroCard}>
          <View>
            <Text style={styles.heroTitle}>
              {`Continue searching for ${categoryLabel} in ${CITY_NAME}`}
            </Text>
            <Text style={styles.heroSubtitle}>{pickedDatesLabel} · 2 guests</Text>
          </View>
          <Image
            source={currentList[0].image}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.sectionTitle}>
          {selectedCategory === "cleaners" && `Available cleaners in ${CITY_NAME}`}
          {selectedCategory === "handymen" && `Available handymen in ${CITY_NAME}`}
          {selectedCategory === "services" && `Available services in ${CITY_NAME}`}
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.workerScroll}
        >
          {currentList.map((worker) => (
            <Pressable
              key={worker.id}
              style={styles.workerCard}
              onPress={() =>
                handleCategoryPress(
                  selectedCategory === "cleaners"
                    ? "CLEAN"
                    : selectedCategory === "handymen"
                    ? "REPAIR"
                    : "SERVICES"
                )
              }
            >
              <View style={styles.workerCardImageWrap}>
                <Image
                  source={worker.image}
                  style={styles.workerCardImage}
                  resizeMode="cover"
                />
                <View style={styles.topRatedPill}>
                  <Text style={styles.topRatedText}>Top rated</Text>
                </View>
                <View style={styles.favouriteIconWrapper}>
                  <Ionicons name="heart-outline" size={20} color="#FFFFFF" />
                </View>
              </View>
              <View style={styles.workerCardDetails}>
                <Text style={styles.workerName}>{worker.name}</Text>
                <Text style={styles.workerDates}>{pickedDatesLabel}</Text>
                <Text style={styles.workerPrice}>€{worker.pricePerHour} / hour</Text>
                <Text style={styles.workerRating}>★ {worker.rating.toFixed(1)}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        <Link href="/worker/profile/cleaner" asChild>
          <Pressable style={styles.becomeAStar}>
            <Text style={styles.becomeAStarText}>Become a Star (worker signup)</Text>
          </Pressable>
        </Link>
        <Text style={styles.discoverTitle}>{`Other available workers in ${CITY_NAME}`}</Text>
        {subcategoryGroups.map((group) => (
          <View key={group.label} style={styles.subcategorySection}>
            <Pressable
              style={styles.discoverPill}
              onPress={() => handleSubcategoryPress(group.label)}
            >
              <Text style={styles.discoverPillText}>{group.label}</Text>
            </Pressable>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.workerScroll}
            >
              {group.workers.map((worker) => (
                <Pressable key={worker.id} style={styles.workerCard}>
                  <View style={styles.workerCardImageWrap}>
                    <Image
                      source={worker.image}
                      style={styles.workerCardImage}
                      resizeMode="cover"
                    />
                    <View style={styles.topRatedPill}>
                      <Text style={styles.topRatedText}>Top rated</Text>
                    </View>
                    <View style={styles.favouriteIconWrapper}>
                      <Ionicons name="heart-outline" size={20} color="#FFFFFF" />
                    </View>
                  </View>
                  <View style={styles.workerCardDetails}>
                    <Text style={styles.workerName}>{worker.name}</Text>
                    <Text style={styles.workerDates}>{pickedDatesLabel}</Text>
                    <Text style={styles.workerPrice}>€{worker.pricePerHour} / hour</Text>
                    <Text style={styles.workerRating}>★ {worker.rating.toFixed(1)}</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 18,
    minHeight: 52,
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginTop: 12,
  },
  searchBarHover: {
    borderColor: "#111827",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: "#111827",
  },
  categoryTabsShell: {
    marginTop: 20,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  categoryTabs: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  categoryTab: {
    alignItems: "center",
    paddingHorizontal: 8,
  },
  categoryTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#222222",
    paddingBottom: 4,
  },
  categoryIcon: {
    width: 180,
    height: 124,
    marginBottom: 4,
  },
  categoryTabLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
  },
  heroCard: {
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: "#6B7280",
  },
  heroImage: {
    width: 72,
    height: 72,
    borderRadius: 18,
    marginLeft: 12,
  },
  sectionTitle: {
    marginBottom: 12,
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  workerScroll: {
    paddingBottom: 16,
  },
  workerCard: {
    width: 220,
    marginRight: 12,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    overflow: "hidden",
  },
  workerCardImageWrap: {
    width: "100%",
    height: 220,
    overflow: "hidden",
  },
  workerCardImage: {
    width: "100%",
    height: "100%",
  },
  topRatedPill: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(17, 24, 39, 0.9)",
  },
  topRatedText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  favouriteIconWrapper: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  workerCardDetails: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  workerName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  workerDates: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 2,
  },
  workerPrice: {
    fontSize: 13,
    color: "#111827",
    marginBottom: 2,
  },
  workerRating: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "600",
  },
  becomeAStar: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: "#111827",
    alignSelf: "flex-start",
  },
  becomeAStarText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  discoverTitle: {
    marginTop: 28,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  discoverScroll: {
    paddingBottom: 24,
  },
  discoverPill: {
    width: 220,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    marginRight: 12,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  discoverPillText: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "700",
  },
});

import { Image, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

interface AppHeaderProps {
  onMenuLogin?: () => void;
}

export default function AppHeader({ onMenuLogin }: AppHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();

  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        <Image
          source={require("../assets/Star-App-Logo-Transp.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.rightGroup}>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="globe-outline" size={22} color="#111827" />
          </Pressable>
          <Pressable
            style={styles.hamburgerBtn}
            onPress={() => setMenuOpen(!menuOpen)}
          >
            <Ionicons name={menuOpen ? "close" : "menu"} size={24} color="#111827" />
          </Pressable>
        </View>
      </View>

      {menuOpen && (
        <View style={styles.dropdownMenu}>
          {!isLoggedIn && onMenuLogin && (
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                onMenuLogin();
              }}
            >
              <Ionicons name="person-outline" size={18} color="#111827" />
            </Pressable>
          )}
          {isLoggedIn && (
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                logout();
              }}
            >
              <Ionicons name="log-out-outline" size={18} color="#111827" />
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { zIndex: 10 },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  logo: { width: 90, height: 32 },
  rightGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  hamburgerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  dropdownMenu: {
    position: "absolute",
    top: 58,
    right: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingVertical: 6,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    zIndex: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
});

import { Stack } from "expo-router";

export default function WorkerLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, title: "Worker profile" }}>
      <Stack.Screen
        name="finish-profile"
        options={{ title: "Finish your profile" }}
      />
      <Stack.Screen
        name="commitment"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="category"
        options={{ title: "Choose your category" }}
      />
      <Stack.Screen
        name="subcategory"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}

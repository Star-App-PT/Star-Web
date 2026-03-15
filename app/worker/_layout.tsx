import { Stack } from "expo-router";

export default function WorkerLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, title: "Worker profile" }}>
      <Stack.Screen
        name="commitment"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="category"
        options={{ title: "Choose your category" }}
      />
    </Stack>
  );
}

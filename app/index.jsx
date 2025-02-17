import { Button, Text, View } from "react-native";
import { useRouter } from "expo-router"; // Import the useRouter hook

export default function Index() {
  const router = useRouter(); // Initialize the router

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      {/* When the button is pressed, it will navigate to the 'home' page */}
      <Button onPress={() => router.push("/(tabs)/home")}>Go to Home</Button>
      <Button onPress={() => router.push("/(tabs)/tasbeeh")}>Go to tasbeeh</Button>
    </View>
  );
}

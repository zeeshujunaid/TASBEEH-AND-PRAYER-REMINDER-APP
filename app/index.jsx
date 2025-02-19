import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <ImageBackground 
      source={{ uri: "https://www.shutterstock.com/shutterstock/videos/3484165189/thumb/1.jpg?ip=x480" }} 
      style={styles.background}
    >
      <View style={styles.overlay}>
        
        <Text style={styles.heading}>✨ Assalamu Alaikum ✨</Text>

        <Text style={styles.title}>Tasbeeh aur Namaz App mein Khush Aamdeed</Text>

        <Text style={styles.description}>
          📿 is app ke faide yeh hen ke .
        </Text>


        <Text style={styles.description}>
          📿 Yeh app aapko Ramzan aur har roz ki ibadat mein madad degi.
        </Text>

        <Text style={styles.description}>
          🕌 Namaz ki pabandi barqarar rakhne ke liye, yeh app aapko qareebi namaz ki timing batayegi.
        </Text>

        <Text style={styles.description}>
          ⏳ Roza rakhne aur iftar ka waqt yaad dilayegi, taake aap ibadat ko behtar bana sakein.
        </Text>

        <Text style={styles.description}>
          ✨ Tasbeeh counter ke zariye aap apni ibadat ka hisaab rakh sakte hain.
        </Text>

        <Text style={styles.footerText}>
          📌 Chaliye, ibadat ka safar shuru karein!
        </Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push("/(auth)/login")}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Dark semi-transparent overlay
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFD700", // Gold color for heading
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
  },
  description: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 15,
  },
  footerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
    textAlign: "center",
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#FFA500",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});


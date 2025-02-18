import { Text, View,TouchableOpacity,StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Homescreeen(){
    const router = useRouter();

    return(
        <View><Text>HOME SCREEN</Text>
         <TouchableOpacity style={styles.button} onPress={() => router.push("/(auth)/singup")}>
          <Text style={styles.buttonText}>Go to signup</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/(auth)/login")}>
          <Text style={styles.buttonText}>Go to login</Text>
        </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({ 
    button: {
        backgroundColor: "#FFA500",
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 30,
        marginTop: 20,
      },
      buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
      },
})


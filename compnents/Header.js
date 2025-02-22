import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebase";
import Toast from "react-native-toast-message";

export default function Header() {
  const [userName, setUserName] = useState("");

  // Fetch user info from AsyncStorage or Firebase
  const fetchUserInfo = async () => {
    try {
      const storedUserInfo = await AsyncStorage.getItem("info");
      if (storedUserInfo) {
        const { name } = JSON.parse(storedUserInfo);
        setUserName(name);
      } else {
        const user = auth.currentUser;
        if (user) {
          const userDoc = doc(db, "users", user.uid);
          const userSnapshot = await getDoc(userDoc);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            setUserName(userData.name || "Name Not Available");
            await AsyncStorage.setItem(
              "info",
              JSON.stringify({ name: userData.name })
            );
          } else {
            setUserName("Name Not Available");
            Toast.show({
              type: "error",
              text1: "Hi user",
              text2: "Please restart the app to see changes",
            });
          }
        }
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      setUserName("Error Loading Name");
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.nameText}>
          ✨ Assalamu Alaikum {(userName?.length > 7 ? userName.slice(0, 7) + ".." : userName) || "JANAB"} ✨
        </Text>
        <Text style={styles.subtitleText}>
          KHUSH AMDEED!
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      // backgroundColor: "#F5F5DC", // Header Background Color
      backgroundColor: "#F3FFF3", // Header Background Color
      paddingBottom: 2,
      height: 85,
      borderBottomRightRadius: 20,
      borderBottomLeftRadius: 20,
      elevation: 5,  
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
    },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 14,
    color: "green",
    marginTop: 5,
  },
});

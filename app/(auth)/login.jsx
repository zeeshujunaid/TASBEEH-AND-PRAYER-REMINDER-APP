import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Image,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import Toast from 'react-native-toast-message';

export default function Loginscreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    function handleSignIn() {
        if (email !== "" && password !== "") {
            setLoading(true);
            signInWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    const user = userCredential.user;
                    Toast.show({
                        type: 'success',
                        text1: 'Login Successful!',
                        text2: 'Welcome back to the Prayer App.',
                    });
                    await AsyncStorage.setItem("info", JSON.stringify(user.uid));
                    setEmail("");
                    setPassword("");
                    router.push("/(tabs)");
                })
                .catch((error) => {
                    setLoading(false);
                    console.log(error);
                    Toast.show({
                        type: 'error',
                        text1: 'Error logging in',
                        text2: 'Please check your credentials.',
                    });
                });
        } else {
            Toast.show({
                type: 'error',
                text1: 'Invalid Input',
                text2: 'Please fill in all the fields.',
            });
        }
    }

    return (
        <View style={styles.background}>
            <View style={styles.container}>
                <Image
                    source={require("../../assets/images/applogo.jpg")}
                    style={styles.logo}
                />
                <Text style={styles.heading}>Welcome Back!</Text>
                <Text style={styles.subheading}>Sign in to continue your spiritual journey</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#BBB"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    value={email}
                />

                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.inputWithIcon}
                        placeholder="Password"
                        placeholderTextColor="#BBB"
                        secureTextEntry={!showPassword}
                        onChangeText={setPassword}
                        value={password}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <FontAwesome
                            name={showPassword ? "eye-slash" : "eye"}
                            size={24}
                            color="#BBB"
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.forgotPasswordLink} onPress={() => router.push("/forgot-password")}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                    {loading ? <ActivityIndicator size={50} color="#FFF" /> : <Text style={styles.buttonText}>Sign In</Text>}
                </TouchableOpacity>

                <Text style={styles.footerText}>
                    New here? <Text style={styles.linkText} onPress={() => router.push("/singup")}>Create an account</Text>
                </Text>
            </View>

            <Toast />
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F3E0", // Light beige background for a calm feel
        padding: 20,
    },
    container: {
        width: "100%",
        maxWidth: 400,
        paddingHorizontal: 20,
        paddingVertical: 30,
        borderRadius: 15,
        backgroundColor: "#FFFFFF",
        elevation: 5,
    },
    logo: {
        width: 120,
        height: 120,
        resizeMode: "contain",
        marginBottom: 20,
        alignSelf: "center",
    },
    heading: {
        fontSize: 28,
        color: "#4A7C59", // Deep green for spiritual calmness
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    subheading: {
        fontSize: 16,
        color: "#777",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        width: "100%",
        padding: 14,
        marginBottom: 15,
        borderColor: "#4A7C59",
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: "#FFF",
        fontSize: 16,
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        borderColor: "#4A7C59",
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: "#FFF",
        marginBottom: 15,
        paddingRight: 10,
    },
    inputWithIcon: {
        flex: 1,
        padding: 14,
        fontSize: 16,
    },
    forgotPasswordLink: {
        alignSelf: "flex-end",
        marginBottom: 20,
    },
    forgotPasswordText: {
        color: "#4A7C59",
        fontWeight: "bold",
    },
    button: {
        width: "100%",
        paddingVertical: 15,
        backgroundColor: "#4A7C59",
        borderRadius: 25,
        alignItems: "center",
        marginVertical: 20,
    },
    buttonText: {
        fontSize: 18,
        color: "#FFF",
        fontWeight: "bold",
    },
    footerText: {
        fontSize: 14,
        color: "#000",
        textAlign: "center",
    },
    linkText: {
        color: "#4A7C59",
        fontWeight: "bold",
    },
});

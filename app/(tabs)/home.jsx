import { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const router = useRouter();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [prayerTimes, setPrayerTimes] = useState(null);

  // 🔹 Location Fetch & Save to AsyncStorage
  const getLocation = async () => {
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setPermissionDenied(true);
      setLoading(false);
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
    setPermissionDenied(false);
    setLoading(false);

    await AsyncStorage.setItem("userLocation", JSON.stringify(loc.coords));
    fetchPrayerTimes(loc.coords.latitude, loc.coords.longitude);
  };

  // 🔹 Load Stored Location & Fetch Timings
  const loadStoredLocation = async () => {
    const storedLocation = await AsyncStorage.getItem("userLocation");
    if (storedLocation) {
      const parsedLocation = JSON.parse(storedLocation);
      setLocation(parsedLocation);
      fetchPrayerTimes(parsedLocation.latitude, parsedLocation.longitude);
    }
  };

  const convertTo12HourFormat = (time) => {
    let [hours, minutes] = time.split(":");
    let suffix = hours >= 12 ? "PM" : "AM";
    hours = ((hours % 12) || 12).toString(); // Convert to 12-hour format (handle 0 as 12)
    return `${hours}:${minutes} ${suffix}`;
  };
  
  // 🔹 Fetch Namaz Timings API
  const fetchPrayerTimes = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
      );
      const data = await response.json();
  
      // ✅ Convert 24-hour to 12-hour format
      const requiredTimings = {
        Fajr: convertTo12HourFormat(data.data.timings.Fajr),
        Dhuhr: convertTo12HourFormat(data.data.timings.Dhuhr),
        Asr: convertTo12HourFormat(data.data.timings.Asr),
        Maghrib: convertTo12HourFormat(data.data.timings.Maghrib),
        Isha: convertTo12HourFormat(data.data.timings.Isha),
      };
  
      setPrayerTimes(requiredTimings);
    } catch (error) {
      console.error("Error fetching prayer times:", error);
    }
  };
  // 🔹 Fetch on App Open
  useEffect(() => {
    const fetchLocationOnAppOpen = async () => {
      await loadStoredLocation();
      await getLocation();
    };
    fetchLocationOnAppOpen();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HOME SCREEN</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FFA500" />
      ) : permissionDenied ? (
        <View>
          <Text style={styles.text}>Location permission is required to show the map.</Text>
          <TouchableOpacity style={styles.permissionButton} onPress={getLocation}>
            <Text style={styles.buttonText}>Allow Location</Text>
          </TouchableOpacity>
        </View>
      ) : location ? (
        <View>
          <Text style={styles.text}>Your Location:</Text>
          <MapView
            style={styles.map}
            region={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} title="You are here" />
          </MapView>

          {prayerTimes && (
            <View style={styles.prayerContainer}>
              <Text style={styles.prayerTitle}>Today's Prayer Times</Text>
              {Object.entries(prayerTimes).map(([name, time]) => (
                <Text key={name} style={styles.prayerText}>
                  {name}: {time}
                </Text>
              ))}
            </View>
          )}
        </View>
      ) : (
        <Text style={styles.text}>Unable to fetch location</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={getLocation}>
        <Text style={styles.buttonText}>Refresh Location</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  map: {
    width: 300,
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  prayerContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
  prayerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  prayerText: {
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#FFA500",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
  },
  permissionButton: {
    backgroundColor: "#ff4500",
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
});

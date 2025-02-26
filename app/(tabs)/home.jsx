import { TouchableOpacity } from "react-native";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Touchable,
} from "react-native";
import * as Location from "expo-location";
import Toast from "react-native-toast-message";
import { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Homescreen() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [sehrIftarTimings, setSehrIftarTimings] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const getLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setPermissionDenied(true);
        setLoading(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      await AsyncStorage.setItem("userlocation", JSON.stringify(loc.coords));
    } catch (error) {
      console.error("Error getting location:", error);
      Toast.show({
        type: "info",
        text1: "Permission Denied",
        text2: "Please allow location permission to use this feature",
        position: "top",
      });
      setPermissionDenied(true);
    } finally {
      setLoading(false);
    }
  };
// 🟢 Convert 24-hour time to 12-hour format
const convertTo12HourFormat = (time) => {
  let [hours, minutes] = time.split(":").slice(0, 2);
  let suffix = hours >= 12 ? "PM" : "AM";
  hours = (hours % 12 || 12).toString().padStart(2, "0");
  return `${hours}:${minutes} ${suffix}`;
};

// 🟢 Fetch prayer times from API and store in AsyncStorage
const fetchPrayerTimes = async () => {
  try {
    const locationData = await AsyncStorage.getItem("userlocation");
    if (!locationData) return;

    const { latitude, longitude } = JSON.parse(locationData);
    const response = await fetch(
      `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
    );
    const data = await response.json();

    if (!data || !data.data || !data.data.timings) {
      throw new Error("Invalid API response");
    }

    const requiredTimings = {
      Fajr: convertTo12HourFormat(data.data.timings.Fajr),
      Dhuhr: convertTo12HourFormat(data.data.timings.Dhuhr),
      Asr: convertTo12HourFormat(data.data.timings.Asr),
      Maghrib: convertTo12HourFormat(data.data.timings.Maghrib),
      Isha: convertTo12HourFormat(data.data.timings.Isha),
    };

    
    setPrayerTimes(requiredTimings);
    
    const todayDate = new Date().toISOString().split("T")[0]; // e.g., "2025-02-26"
    await AsyncStorage.setItem("lastFetchDate", todayDate);
    await AsyncStorage.setItem("prayerTimes", JSON.stringify(requiredTimings));



    const sehriIftarTimings = {
      Sehri: convertTo12HourFormat(data.data.timings.imsak),
      Iftar: convertTo12HourFormat(data.data.timings.Maghrib),
    };  

    setSehrIftarTimings(sehriIftarTimings);

  } catch (error) {
    console.error("Error fetching prayer times:", error);
  }
};

// 🟢 Check if update is needed
const checkForUpdate = async () => {
  try {
    const storedDate = await AsyncStorage.getItem("lastFetchDate");
    const storedPrayerTimes = await AsyncStorage.getItem("prayerTimes");
    
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0]; // e.g., "2025-02-26"
    const currentHour = now.getHours(); // Get current hour (24-hour format)

    if (!storedDate || !storedPrayerTimes) {
      // If no data exists, fetch first time
      await fetchPrayerTimes();
    } else if (storedDate !== currentDate && currentHour >= 6) {
      // If date is different & time is past 6 AM, fetch new data
      await fetchPrayerTimes();
    } else {
      // If data is already stored, use that
      setPrayerTimes(JSON.parse(storedPrayerTimes));
    }
  } catch (error) {
    console.error("Error checking for update:", error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  checkForUpdate();
}, []);

  useEffect(() => {
    // loadStoredLocation();
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* Map Container with Fixed Height */}
      <View style={styles.mapContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#000" style={styles.loader} />
        ) : permissionDenied ? (
          <View style={styles.deniedTextcointainer}>
            <Text style={styles.deniedText}>Asalamwalikum Janab</Text>
            <Text style={styles.deniedText}>
              Apke Area KI Namaz Timing Janne
            </Text>
            <Text style={styles.deniedText}>
              Ke Liye Apki Live Location Ki Ijazat Chahiyeh
            </Text>
            <TouchableOpacity onPress={getLocation}>
              <Text style={styles.deniedbutton}>IJAZAT HA</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <MapView
            style={styles.map}
            region={{
              latitude: location?.latitude || 0,
              longitude: location?.longitude || 0,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            {location && (
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title="You are here"
              />
            )}
          </MapView>
        )}
      </View>

      {/* Floating Time Container */}
      <View style={styles.timeContainer}>
        <Text>he</Text>
        <Text>helll</Text>
      </View>

      <View style={styles.prayerTimesContainer}>
        <Text> today prayer timing </Text>
        <Text style={styles.prayerTime}>Fajr: {prayerTimes?.Fajr}</Text>
        <Text style={styles.prayerTime}>Dhuhr: {prayerTimes?.Dhuhr}</Text>
        <Text style={styles.prayerTime}>Asr: {prayerTimes?.Asr}</Text>
        <Text style={styles.prayerTime}>Maghrib: {prayerTimes?.Maghrib}</Text>
        <Text style={styles.prayerTime}>Isha: {prayerTimes?.Isha}</Text>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mapContainer: {
    height: "30%",
    width: "100%",
    backgroundColor: "#ddd",
    justifyContent: "center", // Center loader or text
    alignItems: "center",
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%", // Full height to fit container
  },
  loader: {
    position: "absolute",
  },
  deniedTextcointainer: {
    backgroundColor: "#f7cf09",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  deniedbutton: {
    width: "50%",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "work-sans",
  },
  deniedText: {
    color: "black",
    fontqWeight: "bold",
    fontWeight: "900",
    fontFamily: "work-sans",
    textAlign: "center",
    fontSize: 16,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    top: "23%", // Slightly above the map
    left: "10%",
    right: "10%",
    height: 100,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
  },
});

import { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import Header from "../../compnents/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";

export default function HomeScreen() {
  const router = useRouter();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [updatingTimings, setUpdatingTimings] = useState(false);

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
    hours = ((hours % 12) || 12).toString();
    return `${hours}:${minutes} ${suffix}`;
  };

  const fetchPrayerTimes = async (latitude, longitude) => {
    setUpdatingTimings(true);
    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
      );
      const data = await response.json();

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
    setUpdatingTimings(false);
  };

  useEffect(() => {
    loadStoredLocation();
  }, []);

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.prayerContainer}>
  <Text style={styles.prayerTitle}>YOUR LOCATION</Text>
  </View>
         {/* Location Section with Background Map */}
         <View style={styles.mapContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#FFA500" />
          ) : permissionDenied ? (
            <View>
              <Text style={styles.text}>
                Location permission is required to show the map and get the namaz timings.
              </Text>
              <TouchableOpacity style={styles.permissionButton} onPress={getLocation}>
                <Text style={styles.buttonText}>Allow Location</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
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
                    coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                    title="You are here"
                  />
                )}
              </MapView>

              {/* Refresh Icon */}
              <TouchableOpacity style={styles.refreshIcon} onPress={getLocation}>
                <FontAwesome name="refresh" size={24} color="#FFF" />
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.prayerContainer}>
  <Text style={styles.prayerTitle}>Today's Prayer Times</Text>
  {updatingTimings ? (
    <ActivityIndicator size="small" color="#FFA500" />
  ) : (
    Object.entries(prayerTimes || {}).map(([name, time]) => (
      <View key={name} style={styles.prayerWrapper}>
        <View style={styles.prayerItem}>
          <Text style={styles.prayerText}>{name}</Text>
          <Text style={styles.prayerTime}>{time}</Text>
        </View>
      </View>
    ))
  )}
</View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#F5F5DC",
    backgroundColor: "#F3FFF3",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 90,
  },
  mapContainer: {
    position: "relative",
    height: 150,
    width: "90%",
    paddingLeft: 5,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  locationOverlay: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
  },
  locationText: {
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "sans-serif-medium",
    color: "#000",
    textAlign: "center",
  },
  refreshIcon: {
    position: "absolute",
    bottom: 10,
    height:45,
    width:40,
    right: 10,
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 30,
    elevation: 5,
  },
  prayerContainer: {
    padding: 16,
    // backgroundColor: '#fff',
  },
  prayerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  prayerWrapper: {
    marginBottom: 10, // Har namaz ko alag space dena
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 10,
    elevation: 2, // Shadow effect for better UI
  },
  prayerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  prayerText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFA500',
  },
  prayerTime: {
    fontSize: 18,
    color: '#FFA500',
  },
  permissionButton: {
    backgroundColor: "#ff4500",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

import { Text, View, StyleSheet, ActivityIndicator, StatusBar } from "react-native";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Homescreen() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
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
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      await AsyncStorage.setItem("location", JSON.stringify(currentLocation));
    } catch (error) {
      console.error("Error getting location:", error);
      setPermissionDenied(true);
    } finally {
      setLoading(false);
    }
  };

  const loadStoredLocation = async () => {
    const storedLocation = await AsyncStorage.getItem("location");
    if (storedLocation) {
      setLocation(JSON.parse(storedLocation));
    }
  };

  useEffect(() => {
    loadStoredLocation();
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Map Container with Fixed Height */}
      <View style={styles.mapContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#000" style={styles.loader} />
        ) : permissionDenied ? (
          <Text style={styles.deniedText}>Location Permission Denied</Text>
        ) : (
          <MapView
            style={styles.map}
            region={{
              latitude: location?.coords?.latitude || 0,
              longitude: location?.coords?.longitude || 0,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            {location && location.coords && (
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
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
  deniedText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  timeContainer: {
    display  : "flex",
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

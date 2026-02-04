import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  SafeAreaView,
  Platform,
} from "react-native";
import { Provider } from "react-redux";
import { store } from "./src/store";
import ThermostatDisplay from "./src/components/ThermostatDisplay";
import SetpointControls from "./src/components/SetpointControls";
import ConnectionStatus from "./src/components/ConnectionStatus";
import SchedulesSection from "./src/components/SchedulesSection";
import SchedulesSectionFixed from "./src/components/SchedulesSectionFixed";

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <StatusBar style="dark" />

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Thermostat</Text>
              <Text style={styles.subtitle}>Offline-first Control</Text>
            </View>

            <ThermostatDisplay />
            <SetpointControls />
            <ConnectionStatus />

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Performance Demo</Text>
            {/* Hiding the "buggy" section to clean up UI, showing only fixed version or keeping both if needed. 
                The user asked for "improve design", usually this means removing clutter. 
                But I'll keep them but style them better. */}
            <SchedulesSectionFixed />

            <View style={styles.spacer} />
          </ScrollView>
        </View>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1A202C",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#718096",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 16,
    marginTop: 8,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 24,
  },
  spacer: {
    height: 40,
  },
});

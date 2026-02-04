import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const ThermostatDisplay: React.FC = () => {
  const { currentTemp, targetTemp } = useSelector((state: RootState) => state.thermostat);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.column}>
          <Text style={styles.label}>CURRENT</Text>
          <Text style={styles.currentTemp}>{Math.round(currentTemp)}°</Text>
        </View>
        
        <View style={styles.verticalDivider} />
        
        <View style={styles.column}>
          <Text style={styles.label}>TARGET</Text>
          <Text style={styles.targetTemp}>{targetTemp}°</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 40,
    shadowColor: '#A0AEC0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  column: {
    alignItems: 'center',
    flex: 1,
  },
  verticalDivider: {
    width: 1,
    height: 50,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#A0AEC0',
    marginBottom: 8,
    letterSpacing: 1,
  },
  currentTemp: {
    fontSize: 56,
    fontWeight: '600',
    color: '#2D3748',
    letterSpacing: -1,
  },
  targetTemp: {
    fontSize: 56,
    fontWeight: '600',
    color: '#38A169',
    letterSpacing: -1,
  },
});

export default ThermostatDisplay;
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { setTargetTemperature } from '../store/thermostatThunks';

const SetpointControls: React.FC = () => {
  const dispatch = useDispatch();

  const handleDecrease = () => {
    dispatch(setTargetTemperature(20) as any); // Will be handled by thunk
  };

  const handleIncrease = () => {
    dispatch(setTargetTemperature(24) as any); // Will be handled by thunk
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleDecrease}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>−</Text>
      </TouchableOpacity>
      
      <View style={styles.spacer} />

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleIncrease}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
  },
  spacer: {
    width: 32,
  },
  button: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#A0AEC0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  buttonText: {
    fontSize: 32,
    fontWeight: '300',
    color: '#4A5568',
    marginTop: -4, // Optical alignment for standard font
  },
});

export default SetpointControls;
import React, { useState } from 'react';
import { View, Text, FlatList, Switch, StyleSheet, Animated } from 'react-native';
import { useRenderCount } from '../hooks/useRenderCount';

interface ScheduleItem {
  id: string;
  name: string;
  enabled: boolean;
  time: string;
}

// Initial schedule data
const initialSchedules: ScheduleItem[] = Array.from({ length: 24 }, (_, i) => ({
  id: `schedule_${i}`,
  name: `Schedule ${i + 1}`,
  enabled: Math.random() > 0.5,
  time: `${String(Math.floor(i / 2)).padStart(2, '0')}:${String((i % 2) * 30).padStart(2, '0')}`,
}));

const SchedulesSection: React.FC = () => {
  const renderCount = useRenderCount('SchedulesSection');
  
  // PERFORMANCE BUG: All toggle states in parent component
  // This causes all 24 rows to re-render when any single toggle changes
  const [schedules, setSchedules] = useState(initialSchedules);

  const handleToggle = (id: string) => {
    setSchedules(prev => 
      prev.map(schedule => 
        schedule.id === id 
          ? { ...schedule, enabled: !schedule.enabled }
          : schedule
      )
    );
  };

  const renderScheduleItem = ({ item, index }: { item: ScheduleItem; index: number }) => (
    <ScheduleRow 
      item={item} 
      onToggle={handleToggle}
      isEven={index % 2 === 0}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Schedules (Performance Bug Version)</Text>
      <Text style={styles.subtitle}>Renders: {renderCount}</Text>
      
      <FlatList
        data={schedules}
        renderItem={renderScheduleItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        scrollEnabled={false}
        getItemLayout={(data, index) => ({
          length: 60,
          offset: 60 * index,
          index,
        })}
      />
    </View>
  );
};

interface ScheduleRowProps {
  item: ScheduleItem;
  onToggle: (id: string) => void;
  isEven: boolean;
}

const ScheduleRow: React.FC<ScheduleRowProps> = ({ item, onToggle, isEven }) => {
  const renderCount = useRenderCount(`ScheduleRow-${item.id}`);
  const [fadeAnim] = useState(new Animated.Value(1));

  const handleSwitch = () => {
    // Animate the toggle
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onToggle(item.id);
  };

  return (
    <Animated.View 
      style={[
        styles.scheduleRow, 
        { backgroundColor: isEven ? '#f8f9fa' : 'white' },
        { opacity: fadeAnim }
      ]}
    >
      <View style={styles.scheduleInfo}>
        <Text style={styles.scheduleName}>{item.name}</Text>
        <Text style={styles.scheduleTime}>{item.time}</Text>
      </View>
      
      <View style={styles.switchContainer}>
        <Text style={styles.renderCount}>Renders: {renderCount}</Text>
        <Switch
          value={item.enabled}
          onValueChange={handleSwitch}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={item.enabled ? '#2196F3' : '#f4f3f4'}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  subtitle: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 12,
  },
  list: {
    maxHeight: 480, // Show about 8 items at once
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  scheduleTime: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 2,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  renderCount: {
    fontSize: 10,
    color: '#dc3545',
    marginRight: 8,
  },
});

export default SchedulesSection;
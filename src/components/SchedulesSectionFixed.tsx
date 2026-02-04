import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Switch,
  StyleSheet,
  Animated,
} from "react-native";
import { useRenderCount } from "../hooks/useRenderCount";

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
  time: `${String(Math.floor(i / 2)).padStart(2, "0")}:${String(
    (i % 2) * 30,
  ).padStart(2, "0")}`,
}));

const SchedulesSectionFixed: React.FC = () => {
  const renderCount = useRenderCount("SchedulesSectionFixed");

  // PERFORMANCE FIX: Keep initial data in parent, but move toggle state to individual rows
  // This prevents all rows from re-rendering when one toggle changes

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Schedules</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{initialSchedules.length}</Text>
        </View>
      </View>
      {/* <Text style={styles.subtitle}>Parent Renders: {renderCount}</Text> */}

      <View style={styles.listContainer}>
        <FlatList
          data={initialSchedules}
          renderItem={({ item, index }) => (
            <ScheduleRowFixed
              item={item}
              isLast={index === initialSchedules.length - 1}
            />
          )}
          keyExtractor={(item) => item.id}
          style={styles.list}
          scrollEnabled={false}
          getItemLayout={(data, index) => ({
            length: 72,
            offset: 72 * index,
            index,
          })}
        />
      </View>
    </View>
  );
};

interface ScheduleRowFixedProps {
  item: ScheduleItem;
  isLast: boolean;
}

// PERFORMANCE FIX: Memoized component with local state
// Only re-renders when its own props change, not when other rows toggle
const ScheduleRowFixed = React.memo<ScheduleRowFixedProps>(
  ({ item, isLast }) => {
    const renderCount = useRenderCount(`ScheduleRowFixed-${item.id}`);
    const [enabled, setEnabled] = useState(item.enabled);
    const [fadeAnim] = useState(new Animated.Value(1));

    const handleSwitch = useCallback(() => {
      // Animate the toggle
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      setEnabled((prev) => !prev);
    }, [fadeAnim]);

    return (
      <Animated.View
        style={[
          styles.scheduleRow,
          isLast && styles.lastRow,
          { opacity: fadeAnim },
        ]}
      >
        <View style={styles.scheduleInfo}>
          <Text style={styles.scheduleName}>{item.name}</Text>
          <Text style={styles.scheduleTime}>{item.time}</Text>
        </View>

        <View style={styles.switchContainer}>
          {/* <Text style={styles.renderCount}>Renders: {renderCount}</Text> */}
          <Switch
            value={enabled}
            onValueChange={handleSwitch}
            trackColor={{ false: "#CBD5E0", true: "#BEE3F8" }}
            thumbColor={enabled ? "#3182CE" : "#FFFFFF"}
            ios_backgroundColor="#CBD5E0"
          />
        </View>
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3748",
    marginRight: 8,
  },
  badge: {
    backgroundColor: "#EDF2F7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#718096",
  },
  subtitle: {
    fontSize: 12,
    color: "#718096",
    marginBottom: 8,
  },
  listContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#A0AEC0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  list: {
    flexGrow: 0,
  },
  scheduleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F7FAFC",
    backgroundColor: "white",
    height: 72,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 2,
  },
  scheduleTime: {
    fontSize: 13,
    color: "#A0AEC0",
    fontWeight: "500",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  renderCount: {
    fontSize: 10,
    color: "#A0AEC0",
    marginRight: 8,
  },
});

export default SchedulesSectionFixed;

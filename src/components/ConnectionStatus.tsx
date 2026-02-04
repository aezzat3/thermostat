import React from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setOffline } from '../store/thermostatSlice';
import { flushQueue } from '../store/thermostatThunks';
import { mockApi } from '../api/api';

const ConnectionStatus: React.FC = () => {
  const dispatch = useDispatch();
  const { isOffline, isSyncing, commandQueue, lastSyncError, conflictCount } = useSelector(
    (state: RootState) => state.thermostat
  );

  const handleToggleOffline = (value: boolean) => {
    dispatch(setOffline(value));
    
    // If going online, flush the queue
    if (!value && commandQueue.length > 0) {
      dispatch(flushQueue() as any);
    }
  };

  const handleForceConflict = () => {
    mockApi.forceConflictOnce();
    console.log('Conflict will be forced on next setTarget call');
  };

  const handleRetry = () => {
    if (commandQueue.length > 0) {
      dispatch(flushQueue() as any);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.statusIndicator}>
          <View style={[
            styles.statusDot, 
            { backgroundColor: isOffline ? '#FC8181' : '#68D391' }
          ]} />
          <Text style={styles.statusText}>
            {isOffline ? 'Offline' : 'Online'}
          </Text>
        </View>
        
        {isSyncing && (
          <Text style={styles.syncingText}>Syncing...</Text>
        )}
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.toggleLabel}>Offline Mode</Text>
          <Switch
            value={isOffline}
            onValueChange={handleToggleOffline}
            trackColor={{ false: '#CBD5E0', true: '#BEE3F8' }}
            thumbColor={isOffline ? '#3182CE' : '#FFFFFF'}
            ios_backgroundColor="#CBD5E0"
          />
        </View>

        {commandQueue.length > 0 && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Pending Commands</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{commandQueue.length}</Text>
            </View>
          </View>
        )}

        {conflictCount > 0 && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Conflicts Resolved</Text>
            <View style={[styles.badge, styles.successBadge]}>
              <Text style={[styles.badgeText, styles.successBadgeText]}>{conflictCount}</Text>
            </View>
          </View>
        )}
      </View>

      {lastSyncError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {lastSyncError || 'Network connection failed'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.debugLink} onPress={handleForceConflict}>
        <Text style={styles.debugLinkText}>Simulate Conflict</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718096',
  },
  syncingText: {
    fontSize: 12,
    color: '#3182CE',
    fontWeight: '500',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#A0AEC0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#2D3748',
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F7FAFC',
  },
  infoLabel: {
    fontSize: 14,
    color: '#718096',
  },
  badge: {
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4A5568',
  },
  successBadge: {
    backgroundColor: '#C6F6D5',
  },
  successBadgeText: {
    color: '#276749',
  },
  errorContainer: {
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FED7D7',
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  retryButton: {
    backgroundColor: '#E53E3E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  debugLink: {
    alignItems: 'center',
    padding: 8,
  },
  debugLinkText: {
    color: '#CBD5E0',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default ConnectionStatus;
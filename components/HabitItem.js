import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import StreakBadge from './StreakBadge';

export default function HabitItem({ title, label, completed, onToggle, onEdit, streak, isPermanent }) {
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      backgroundColor: isPermanent ? '#e8f8f5' : '#f9f9f9',
      borderRadius: 16, padding: 14, marginBottom: 10
    }}>
      <View>
        <Text style={{ fontSize: 18, fontWeight: '500' }}>{title}</Text>
        {label ? <Text style={{ fontSize: 13, color: '#aaa' }}>{label}</Text> : null}
        <StreakBadge streak={streak} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {!isPermanent && (
          <TouchableOpacity
            onPress={onToggle}
            style={{
              width: 26, height: 26, borderRadius: 13,
              borderWidth: 2, borderColor: completed ? '#2ecc40' : '#bbb',
              backgroundColor: completed ? '#2ecc40' : 'white', marginRight: 16,
              justifyContent: 'center', alignItems: 'center'
            }}
          >
            {completed && <Text style={{ color: 'white', fontWeight: 'bold' }}>✓</Text>}
          </TouchableOpacity>
        )}
        {!isPermanent && (
          <TouchableOpacity onPress={onEdit}>
            <Text style={{ color: '#888' }}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

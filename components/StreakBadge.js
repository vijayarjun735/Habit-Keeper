import React from 'react';
import { View, Text } from 'react-native';

export default function StreakBadge({ streak }) {
  const badgeColor = streak >= 7
    ? '#2ecc40'
    : streak >= 3
      ? '#f1c40f'
      : '#e0e0e0';

  return (
    <View
      style={{
        backgroundColor: badgeColor,
        borderRadius: 16,
        paddingVertical: 4,
        paddingHorizontal: 12,
        alignSelf: 'flex-start',
        marginLeft: 6,
      }}
    >
      <Text style={{ color: '#222', fontWeight: '700', fontSize: 14 }}>
        🔥 {streak} day{streak === 1 ? '' : 's'}
      </Text>
    </View>
  );
}

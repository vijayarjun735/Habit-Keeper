import React from 'react';
import { View, Text } from 'react-native';

export default function SummaryCard({ title, streak, total }) {
  return (
    <View style={{
      backgroundColor: '#f2f7fa', borderRadius: 14, padding: 14, marginVertical: 8
    }}>
      <Text style={{ fontSize: 17, fontWeight: '600' }}>{title}</Text>
      <Text style={{ marginTop: 6, fontSize: 15 }}>
        Streak: <Text style={{ fontWeight: '700' }}>{streak} days</Text> | Total: <Text style={{ fontWeight: '700' }}>{total}</Text>
      </Text>
    </View>
  );
}

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import SummaryCard from '../components/SummaryCard';

function getStreak(dates = []) {
  if (!dates.length) return 0;
  const sorted = dates.map(d => new Date(d)).sort((a, b) => b - a);
  let streak = 0;
  let curr = new Date();
  for (let date of sorted) {
    if (date.toISOString().slice(0, 10) === curr.toISOString().slice(0, 10)) {
      streak++;
      curr.setDate(curr.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export default function SummaryScreen() {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    (async () => {
      const col = collection(db, 'habits');
      const snapshot = await getDocs(col);
      setHabits(snapshot.docs.map(d => d.data()));
    })();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: '700' }}>Summary</Text>
      <FlatList
        data={habits}
        keyExtractor={item => item.title}
        renderItem={({ item }) => (
          <SummaryCard
            title={item.title}
            streak={getStreak(item.completedDates)}
            total={item.completedDates?.length || 0}
          />
        )}
      />
    </View>
  );
}

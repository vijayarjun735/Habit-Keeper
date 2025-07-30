import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, FlatList, Button, TouchableOpacity, ActivityIndicator, Animated,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import HabitItem from '../components/HabitItem';

function calculateStreak(dates = []) {
  if (!dates.length) return 0;
  const sorted = dates.map(d => new Date(d)).sort((a, b) => b - a);
  let streak = 0;
  let curr = new Date();
  curr.setHours(0, 0, 0, 0);
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

export default function TodayScreen() {
  const navigation = useNavigation();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const todayStr = new Date().toISOString().split('T')[0];

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const permanentHabit = {
    id: 'permanent',
    title: 'Drink Water',
    label: 'Permanent Habit',
    completedDates: [],
    isPermanent: true,
    streak: 5,
  };

  const fetchHabits = async () => {
    setLoading(true);
    const col = collection(db, 'habits');
    const snapshot = await getDocs(col);
    const data = snapshot.docs.map(docSnap => ({ ...docSnap.data(), id: docSnap.id }));
    setHabits(data);
    setLoading(false);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    fetchHabits();
  }, [isFocused]);

  const toggleCompletion = async (habit) => {
    let updatedDates = habit.completedDates || [];
    if (updatedDates.includes(todayStr)) {
      updatedDates = updatedDates.filter(date => date !== todayStr);
    } else {
      updatedDates.push(todayStr);
    }
    await updateDoc(doc(db, 'habits', habit.id), { completedDates: updatedDates });
    fetchHabits();
  };

  const habitsWithPermanent = [permanentHabit, ...habits];

  if (loading) return (
    <View style={{ flex: 1, backgroundColor: "#f7fafd", justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#4F8EF7" />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f7fafd", paddingTop: 30 }}>
      <Text style={{
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 18,
        paddingHorizontal: 20,
        letterSpacing: -0.5,
      }}>Today's Habits</Text>

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <FlatList
          data={habitsWithPermanent}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 20 }}
          renderItem={({ item }) => (
            <HabitItem
              title={item.title}
              label={item.label}
              completed={item.completedDates?.includes(todayStr)}
              onToggle={() => !item.isPermanent && toggleCompletion(item)}
              onEdit={() => !item.isPermanent && navigation.navigate('EditHabit', { habit: item })}
              streak={item.isPermanent ? item.streak : calculateStreak(item.completedDates)}
              isPermanent={item.isPermanent}
            />
          )}
          ListEmptyComponent={<Text style={{ color: '#aaa', marginTop: 80, textAlign: "center" }}>No habits. Add one!</Text>}
        />
      </Animated.View>

      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 22,
        paddingBottom: 30,
        gap: 14,
      }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#4F8EF7",
            borderRadius: 14,
            flex: 1,
            alignItems: "center",
            paddingVertical: 14,
            marginRight: 6,
            shadowColor: "#4F8EF7",
            shadowOpacity: 0.14,
            shadowRadius: 7,
            elevation: 2,
          }}
          onPress={() => navigation.navigate('EditHabit')}
        >
          <Text style={{
            color: "#fff",
            fontWeight: "600",
            fontSize: 16,
            letterSpacing: 0.2,
          }}>Add Habit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "#dde8f5",
            borderRadius: 14,
            flex: 1,
            alignItems: "center",
            paddingVertical: 14,
            marginLeft: 6,
          }}
          onPress={() => navigation.navigate('Summary')}
        >
          <Text style={{
            color: "#2B5A9F",
            fontWeight: "600",
            fontSize: 16,
            letterSpacing: 0.2,
          }}>Summary</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

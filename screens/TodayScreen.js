import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, ActivityIndicator, Animated
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import HabitItem from '../components/HabitItem';

// Helper to calculate streak
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

  // Animation for the habit list
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Permanent habit (always on top)
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

  // List data: permanent + user habits
  const habitsWithPermanent = [permanentHabit, ...habits];

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#f7fafd", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4F8EF7" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f7fafd" }}>
      <Text
        style={{
          fontSize: 28,
          fontWeight: '700',
          marginTop: 38,
          marginBottom: 14,
          paddingHorizontal: 22,
          letterSpacing: -0.5,
          color: "#213040"
        }}
      >
        Today's Habits
      </Text>

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <FlatList
          data={habitsWithPermanent}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 14 }}
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
          ListEmptyComponent={
            <Text style={{ color: '#aaa', marginTop: 70, textAlign: "center" }}>
              No habits. Add one!
            </Text>
          }
        />
      </Animated.View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: 12,
          paddingHorizontal: 20,
          paddingVertical: 18,
          backgroundColor: "#f7fafd",
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "#234ae6",
            borderRadius: 14,
            alignItems: "center",
            paddingVertical: 15,
            marginRight: 6,
            shadowColor: "#234ae6",
            shadowOpacity: 0.14,
            shadowRadius: 7,
            elevation: 2,
          }}
          onPress={() => navigation.navigate('EditHabit')}
          activeOpacity={0.85}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "600",
              fontSize: 17,
              letterSpacing: 0.2,
            }}
          >
            + Add Habit
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "#ecf1f7",
            borderRadius: 14,
            alignItems: "center",
            paddingVertical: 15,
            marginLeft: 6,
          }}
          onPress={() => navigation.navigate('Summary')}
          activeOpacity={0.85}
        >
          <Text
            style={{
              color: "#234ae6",
              fontWeight: "600",
              fontSize: 17,
              letterSpacing: 0.2,
            }}
          >
            Summary
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
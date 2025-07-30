import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { db } from '../firebase';
import { addDoc, doc, updateDoc, deleteDoc, collection } from 'firebase/firestore';

export default function EditHabitScreen({ route, navigation }) {
  const habit = route.params?.habit;
  const [title, setTitle] = useState(habit?.title || '');
  const [label, setLabel] = useState(habit?.label || '');

  const handleSave = async () => {
    if (!title.trim()) return;
    try {
      if (habit) {
        await updateDoc(doc(db, 'habits', habit.id), { title, label });
      } else {
        await addDoc(collection(db, 'habits'), {
          title,
          label,
          completedDates: [],
        });
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleDelete = async () => {
    if (!habit) return;
    try {
      await deleteDoc(doc(db, 'habits', habit.id));
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: '600' }}>{habit ? 'Edit Habit' : 'Add Habit'}</Text>
      <TextInput
        placeholder="Habit title"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, borderColor: '#eee', padding: 10, marginVertical: 16, borderRadius: 8 }}
      />
      <TextInput
        placeholder="Label (optional)"
        value={label}
        onChangeText={setLabel}
        style={{ borderWidth: 1, borderColor: '#eee', padding: 10, borderRadius: 8, marginBottom: 16 }}
      />
      <Button title="Save" onPress={handleSave} disabled={!title.trim()} />
      {habit && (
        <View style={{ marginTop: 12 }}>
          <Button title="Delete" color="red" onPress={handleDelete} />
        </View>
      )}
    </View>
  );
}

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TodayScreen from './screens/TodayScreen';
import EditHabitScreen from './screens/EditHabitScreen';
import SummaryScreen from './screens/SummaryScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Today" component={TodayScreen} />
        <Stack.Screen name="EditHabit" component={EditHabitScreen} />
        <Stack.Screen name="Summary" component={SummaryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

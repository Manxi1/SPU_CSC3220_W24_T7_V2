import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, Modal,Button, Settings } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Drink from './components/Drinks.js';
// import { StatusBar } from 'expo-status-bar';
import * as SQLite from 'expo-sqlite';
import Icon from 'react-native-vector-icons/FontAwesome5';
import HomeScreen from './screens/Home';
import AboutScreen from './screens/About';
import SettingsScreen from './screens/Settings';
import GoalsScreen from './screens/Goals';
import styles from './screens/styles.js';
import AppContext from './AppContextAPI';

const Stack = createNativeStackNavigator(); 

export default function App() {
  // const [drinkName, setDrinkName] = useState(''); 
  // const [drinkVolume, setDrinkVolume] = useState('');
  // const [taskItems, setTaskItems] = useState([]);
  // const [isAddMode, setIsAddMode] = useState(false);
  // const [messages, setMessages] = useState([]);
  const [totalVolume, setTotalVolume] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalSugar, setTotalSugar] = useState(0);
  const [TotalCaffeine, setTotalCaffeine] = useState(0);
  const [totalWaterIntake, setTotalWaterIntake] = useState(0);
  const [waterIntakeGoal, setWaterIntakeGoal] = useState(1);
  const [calorieGoal, setCalorieGoal] = useState(1);
  const [sugarGoal, setSugarGoal] = useState(1);
  const [caffeineGoal, setCaffeineGoal] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fetchedWaterGoal, setFetchedWaterGoal] = useState(1);
  const [fetchedCalorieGoal, setFetchedCalorieGoal] = useState(1);
  const [fetchedSugarGoal, setFetchedSugarGoal] = useState(1);
  const [fetchedCaffeieneGoal, setFetchedCaffeieneGoal] = useState(1);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle menu visibility
    
  };

  const db = SQLite.openDatabase('./siplogV2db.db');

  const fetchGoalsTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT WaterIntake, CalorieGoal, SugarGoal, CaffeineGoal FROM Goal',
        [],
        (_, { rows: { _array } }) => {
          console.log('Fetched Goal table: ', _array);
            setWaterIntakeGoal(parseInt(_array[0].WaterIntake));
            setCalorieGoal(parseInt(_array[0].CalorieGoal));
            setSugarGoal(parseInt(_array[0].SugarGoal));
            setCaffeineGoal(parseInt(_array[0].CaffeineGoal));
            console.log('waterGoal: ', fetchedWaterGoal, 'calorieGoal: ', fetchedCalorieGoal, 'sugarGoal: ', fetchedSugarGoal, 'caffeineGoal: ', fetchedCaffeieneGoal);
        },
        (_, error) => {
          console.log('Error fetching from database: ', error);
        }
      );
    });
  };

  const updateGoalsTable = (waterGoal, calorieGoal, sugarGoal, caffeienGoal) => {
    console.log('Updating Goal table with: ', waterGoal, calorieGoal, sugarGoal, caffeienGoal);
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE Goal SET WaterIntake = ?, CalorieGoal = ?, SugarGoal = ?, CaffeineGoal = ?',
        [waterGoal, calorieGoal, sugarGoal, caffeienGoal],
        (_, { insertId }) => {
          console.log('Updated Goal table');
        },
        (_, error) => {
          console.log('3. Error adding to database: ', error);
        }
      );
    });
  };

    return (
      <AppContext.Provider value={{
        fetchGoalsTable,
        fetchedWaterGoal,
        fetchedCalorieGoal,
        fetchedSugarGoal,
        fetchedCaffeieneGoal,
        db,
        updateGoalsTable,
        totalVolume,
        setTotalVolume,
        totalCalories,
        setTotalCalories,
        totalWaterIntake,
        setTotalWaterIntake,
        waterIntakeGoal,
        setWaterIntakeGoal,
        totalSugar,
        setTotalSugar,
        TotalCaffeine,
        setTotalCaffeine,
        calorieGoal,
        setCalorieGoal,
        sugarGoal,
        setSugarGoal,
        caffeineGoal,
        setCaffeineGoal,
      }}>
        <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{ headerShown: false }}  
            >
                <Stack.Screen
                    name="Daily Gulp"
                    component={HomeScreen}
                    options={{
                      headerLeft: () => (
                        <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
                          <Text style={styles.menuText}>☰</Text>
                        </TouchableOpacity>
                      ),
                    }}
                />
                <Stack.Screen
                    name="Goals"
                    component={GoalsScreen}
                />
                <Stack.Screen
                    name="About"
                    component={AboutScreen}
                />
                <Stack.Screen
                    name="Settings"
                    component={SettingsScreen}
                    />
            </Stack.Navigator>

        </NavigationContainer>
      </AppContext.Provider>
    );
}

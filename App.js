import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, Modal,Button, Settings } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Drink from './components/Drinks.js';
// import { StatusBar } from 'expo-status-bar';
// import * as SQLite from 'expo-sqlite';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle menu visibility
    
  };

    return (
      <AppContext.Provider value={{
        totalVolume,
        setTotalVolume,
        totalCalories,
        setTotalCalories,
        totalSugar,
        setTotalSugar,
        TotalCaffeine,
        setTotalCaffeine
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

import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, Modal,Button } from 'react-native';
import Drink from './components/Drinks.js';
import { StatusBar } from 'expo-status-bar';
import * as SQLite from 'expo-sqlite';
import Icon from 'react-native-vector-icons/FontAwesome5'; 
import {styles} from './styles.js';

//Added comment

export default function App() {
  const [drinkName, setDrinkName] = useState(''); 
  const [drinkVolume, setDrinkVolume] = useState('');
  const [taskItems, setTaskItems] = useState([]);
  const [isAddMode, setIsAddMode] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle menu visibility
    
  };

    return (
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
                    name="About"
                    component={AboutScreen}
                />
            </Stack.Navigator>

            <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isMenuOpen}
                    onRequestClose={toggleMenu}>
                    <View style={styles.menuContainer}>
                    <View style={styles.menuContent}>
                        <TouchableOpacity onPress={toggleMenu} style={styles.backButton}>
                        <Icon name="arrow-left" size={30} color="#000" />
                        </TouchableOpacity>
                        <View style={styles.MenuItemes}>
                        
                        <TouchableOpacity onPress={() => navigation.navigate('AboutScreen')} style={[styles.MenuItemes, { marginBottom: 1 }]}>
                            <Text style={styles.MenuItemestext}>Home</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => console.log('Clicked')} style={[styles.MenuItemes, { flex: 2 ,marginBottom:1}]}>
                            <Text style={styles.MenuItemestext}>Settings</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('About')} style={[styles.MenuItemes, { flex: 18, marginTop:2}]}>
                            <Text style={styles.MenuItemestext}>About</Text>
                        </TouchableOpacity>

                        </View>
                        </View>
                    </View>
                    
                </Modal>

        </NavigationContainer>
    );
}

;

import React, { useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, Modal} from 'react-native';
import Drink from '../components/Drinks.js';
import { StatusBar } from 'expo-status-bar';
import * as SQLite from 'expo-sqlite';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './styles.js';
import AppContext from '../AppContextAPI'; 

export default function HomeScreen({ navigation }) {
    const { totalVolume, setTotalVolume, totalCalories, setTotalCalories, 
        totalSugar, setTotalSugar, TotalCaffeine, setTotalCaffeine } = useContext(AppContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTotalPopVisible, setIsTotalPopVisible] = useState(false);

  
  const toggleTotalPopup = () => {
    setIsTotalPopVisible(!isTotalPopVisible);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle menu visibility
  };


  const fetchGoal = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT TotalVolume, TotalCalories, TotalSugar, TotalCaffeine FROM Goal',
        [],
        (_, { rows }) => {
          console.log(rows._array); // Log the entire result set
          // Assuming rows._array is an array containing the result of the SQL query
          if (rows._array.length > 0) {
            const updatedTotalVolume = parseInt(rows._array[0].TotalVolume);
            const updatedTotalCalories = parseInt(rows._array[0].TotalCalories);
            const updatedTotalSugar = parseInt(rows._array[0].TotalSugar);
            const updatedTotalCaffeine = parseInt(rows._array[0].TotalCaffeine);
            setTotalVolume(updatedTotalVolume); // Call setTotalVolume with the retrieved value
            setTotalCalories(updatedTotalCalories);
            setTotalSugar(updatedTotalSugar);
            setTotalCaffeine(updatedTotalCaffeine);
            console.log('Total Volume:', updatedTotalVolume); // Log the retrieved value
            console.log('Total Calories:', updatedTotalCalories);
            console.log('Total Sugar:', updatedTotalSugar);
            console.log('Total Caffeine:', updatedTotalCaffeine);
          } else {
            // Handle case when no rows are returned
            console.log('No rows returned from database');
          }
        },
        (_, error) => {
          console.log('1. Error fetching data from database: ', error);
        }
      );
    });
  };


  return (
      <View style={styles.container}>

              <View style={styles.DrinkWrapper}>
                <View style={styles.sectionTitle}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.sectionTitleTextSmallDaily}>Daily Gulp</Text>
                    </TouchableOpacity>
                    <Text style={styles.sectionTitleTextBig}>Goals</Text>
                </View>
                {/* <TouchableOpacity onPress={toggleTotalPopup} style={styles.totalVolumeButton}>
                  <Text style={styles.volumeTitle}>Total Volume: {totalVolume} ml</Text>
                  <Text style={styles.volumeFooter}>Click for more</Text>
                </TouchableOpacity> */}
              </View>

              {/* <View style={drinkStyles.container}>
                <View style={drinkStyles.itemContainer}>
                  <View style={drinkStyles.item}>
                    <Text>Hello</Text>
                  </View>
                </View>
              </View> */}

              {/* <Modal
                animationType="fade"
                transparent={true}
                visible={isTotalPopVisible}
                onRequestClose={() => {
                  setIsTotalPopVisible(false);
                }}>
                <View style={styles.totalPopup}>
                  <View style={styles.totalPopupView}>
                    <View style={styles.totalPopupText}>
                      <Text>Total Volume: {totalVolume}</Text>
                      <Text>Total Calories: {totalCalories}</Text>
                      <Text>Total Sugar: {totalSugar}</Text>
                      <Text>Total Caffeine: {TotalCaffeine}</Text>
                      <TouchableOpacity onPress={() => setIsTotalPopVisible(false)} style={styles.totalPopupClose}>
                        <Text style={styles.addText}>Close</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal> */}
          

          <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
            <Text style={styles.menuText}>☰</Text>
          </TouchableOpacity>

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
                  
                  <TouchableOpacity onPress={toggleMenu} style={[styles.MenuItemes, { marginBottom: 1 }]}>
                    <Text style={styles.MenuItemestext}>Home</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate("Settings")} style={[styles.MenuItemes, { flex: 2 ,marginBottom:1}]}>
                    <Text style={styles.MenuItemestext}>Settings</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate("About")} style={[styles.MenuItemes, { flex: 18, marginTop:2}]}>
                    <Text style={styles.MenuItemestext}>About</Text>
                  </TouchableOpacity>

                  </View>
                </View>
            </View>
            
          </Modal>
          
        </View>
  );
}

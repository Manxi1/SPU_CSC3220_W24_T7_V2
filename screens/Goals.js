import React, { useState, useEffect, useContext, useRef } from 'react';
import { Alert, Animated } from 'react-native';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, Modal} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './styles.js';
import AppContext from '../AppContextAPI'; 

export default function HomeScreen({ navigation }) {
  const { totalVolume, setTotalVolume, totalCalories, setTotalCalories, 
    totalSugar, setTotalSugar, TotalCaffeine, setTotalCaffeine } = useContext(AppContext);

  const [isAddMode, setIsAddMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTotalPopVisible, setIsTotalPopVisible] = useState(false);
  const animation = useRef(new Animated.Value(0));
  const [count, setCount] = useState(0);
  const [width, setWidth] = useState(0);

  const updateProgressBar = () => {
    setCount(count + 5);
    setWidth(count);
  };
  
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

  const handleAddTask = () => {
    Keyboard.dismiss();
   setIsAddMode(false);
    

    
  
    const handleBackButton = () => {
      setIsMenuOpen(false); // Close the menu
    };
  
    // Insert the new drink into the database
    // db.transaction(tx => {
    //   tx.executeSql(
    //     'INSERT INTO Drink (Content, Volume , Notes) VALUES (?, ? , ?)',
    //     [drinkName, parseInt(drinkVolume), drinknotes],
    //     (_, { insertId }) => {
    //       console.log('Added to database with ID: ', insertId);
    //       fetchDrinkTracker(); // Fetch updated DrinkTracker after adding
    //     },
    //     (_, error) => {
    //       console.log('2. Error adding to database: ', error);
    //     }
    //   );
    // });
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
          </View>

          <View style={styles.todaysGoalTitle}>
            <Text>Todays Goals</Text>
          </View>

            <Text>
              Loading.....
            </Text>
            <View style={styles.progressBar}>
              <Animated.View style={[StyleSheet.absoluteFill, {backgroundColor: "#8BED4F", width}]}/>
            </View>
            <Text>{count}</Text>

            <TouchableOpacity onPress={updateProgressBar} style={styles.totalButton}>
              <Text style={styles.totalButtonText}>Update Bar</Text>
            </TouchableOpacity>


          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.roundButton} onPress={() => setIsAddMode(true)}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
            <Text style={styles.volumeFooter}>Click to add a goal</Text>
          </View>
          <Modal 
          visible={isAddMode} 
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsAddMode(false)}
          >
            <View style={styles.modalContainer}>
              <View style = {styles.modalView}>
                <View style = {styles.textInputView}>
                  <TextInput
                  style={styles.input}
                  placeholder={'Drink Name'}/>
                  <TextInput
                  style={styles.input}
                  placeholder={'Volume (ml)'}
                  />
                  <TextInput
                  style={styles.inputMessage}
                  placeholder={'Notes'}
                  />
                </View>

                <View style = {styles.addCloseView}>

                  <TouchableOpacity
                    onPress={() => {
                      setIsAddMode(false);
                    }}
                    style={styles.addWrapper}
                  >
                    <Text style={styles.addText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleAddTask()} style={styles.addWrapper}>
                    <Text style={styles.addText}>Add</Text>
                  </TouchableOpacity>

                </View>
                
              </View>

            </View>

          </Modal>






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

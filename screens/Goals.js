import React, { useState, useEffect, useContext, useRef } from 'react';
import { Alert, Animated, Image } from 'react-native';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, Modal, PanResponder} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { TabView, SceneMap } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './styles.js';
import AppContext from '../AppContextAPI'; 
import SwipeGesture from 'react-native-swipe-gestures';


export default function HomeScreen({ navigation }) {
  const { totalVolume, setTotalVolume, totalCalories, setTotalCalories, 
    totalSugar, setTotalSugar, totalWaterIntake, setTotalWaterIntake,
    TotalCaffeine, setTotalCaffeine, waterIntakeGoal, setWaterIntakeGoal, calorieGoal, 
    setCalorieGoal, sugarGoal, setSugarGoal, caffeineGoal, setCaffeineGoal } = useContext(AppContext);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTotalPopVisible, setIsTotalPopVisible] = useState(false);
  const [swipeCount, setSwipeCount] = useState(0);
  const [waterGoalCircle, setwaterGoalCircle] = useState(true);
  const [calorieGoalCircle, setcalorieGoalCircle] = useState(false);
  const [sugarGoalCircle, setSugarGoalCircle] = useState(false);

  const [waterProgress, setWaterProgress] = useState(30); //temporary value for the progress bar

  const onSwipeLeft = () => {
    setSwipeCount(swipeCount + 1);
    if (swipeCount === 2) {
      setSwipeCount(0);
    }
  };
  const onSwipeRight = () => {
    setSwipeCount(swipeCount - 1);
    if (swipeCount === 0) {
      setSwipeCount(2);
    }
  };

  const config = {
    velocityThreshold: 0.1,
    directionalOffsetThreshold: 80,
  };

  const updateProgressBar = () => {
    setCount(count + 5);
  };

  const resetCount = () => {
    setCount(0);
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

  const inputWaterGoal = (input) => {
    setWaterIntakeGoal(input);
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

          <View style={styles.todaysGoalContainer}>
            <SwipeGesture
              onSwipeLeft={onSwipeLeft}
              onSwipeRight={onSwipeRight}
              config={config}
              style={styles.swipeBox} // Added a background color for visibility
            >
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                {(swipeCount === 0) && (
                  <>
                    <Text style={styles.goalsTitle}>Water Intake Goal</Text>
                    <AnimatedCircularProgress
                      size={150} // size of the progress bar
                      width={13} // width of the progress ring
                      fill={(waterProgress/waterIntakeGoal)*100} // percentage of the progress
                      tintColor="#00FF00" // color of the progress bar
                      backgroundColor="#D3D3D3" // color of the remaining progress
                      rotation={0} // start position of the progress bar
                      style={{ bottom: -50 }}
                      children={() => 
                        <View>
                          <Text>{Math.round((waterProgress/waterIntakeGoal)*100)}%</Text>
                          <Text>{Math.round(100 - (waterProgress/waterIntakeGoal)*100)}% right</Text>
                        </View>
                      }
                    />
                    <View style={styles.alignEclipse}>
                      <View style={styles.blackElipses} />
                      <View style={styles.greyElipses} />
                      <View style={styles.greyElipses} />
                    </View>
                  </>
                )}
                
                {(swipeCount === 1) && (
                  <>
                    <Text style={styles.goalsTitle}>Calorie Intake Goal</Text>
                    <AnimatedCircularProgress
                      size={150} // size of the progress bar
                      width={13} // width of the progress ring
                      fill={((waterProgress/calorieGoal)*100)} // percentage of the progress
                      tintColor="#00FF00" // color of the progress bar
                      backgroundColor="#D3D3D3" // color of the remaining progress
                      rotation={0} // start position of the progress bar
                      style={{ bottom: -50 }}
                      children={() => 
                        <View>
                          <Text>{Math.round((waterProgress/calorieGoal)*100)}%</Text>
                          <Text>{Math.round(100 - (waterProgress/calorieGoal)*100)}% left</Text>
                        </View>
                      }
                    />
                    <View style={styles.alignEclipse}>
                      <View style={styles.greyElipses} />
                      <View style={styles.blackElipses} />
                      <View style={styles.greyElipses} />
                    </View>
                  </>
                )}

                {(swipeCount === 2) && (
                  <>
                    <Text style={styles.goalsTitle}>Calorie Intake Goal</Text>
                    <AnimatedCircularProgress
                      size={150} // size of the progress bar
                      width={13} // width of the progress ring
                      fill={((waterProgress/calorieGoal)*100)} // percentage of the progress
                      tintColor="#00FF00" // color of the progress bar
                      backgroundColor="#D3D3D3" // color of the remaining progress
                      rotation={0} // start position of the progress bar
                      style={{ bottom: -50 }}
                      children={() => 
                        <View>
                          <Text>{Math.round((waterProgress/calorieGoal)*100)}%</Text>
                          <Text>{Math.round(100 - (waterProgress/calorieGoal)*100)}% left</Text>
                        </View>
                      }
                    />
                    <View style={styles.alignEclipse}>
                      <View style={styles.greyElipses} />
                      <View style={styles.greyElipses} />
                      <View style={styles.blackElipses} />
                    </View>
                  </>
                )}
              </View>
            </SwipeGesture>
          </View>

            <TouchableOpacity onPress={updateProgressBar} style={styles.totalButton}>
              <Text style={styles.totalButtonText}>Update Bar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={resetCount} style={styles.totalButton}>
              <Text style={styles.totalButtonText}>Reset Bar</Text>
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
                  placeholder={'Water Goal (ml)'}
                  keyboardType={'numeric'}
                  number={waterIntakeGoal}
                  onChangeText={(input)=> inputWaterGoal(input)}
                  />
                  <TextInput
                  style={styles.input}
                  placeholder={'Calorie Goal'}
                  keyboardType={'numeric'}
                  number={calorieGoal}
                  onChangeText={(text)=> setCalorieGoal(text)}
                  />
                  <TextInput
                  style={styles.input}
                  placeholder={'Sugar Goal'}
                  keyboardType={'numeric'}
                  number={sugarGoal}
                  onChangeText={(text)=> setSugarGoal(text)}
                  />
                  <TextInput
                  style={styles.input}
                  placeholder={'Caffeine Goal'}
                  keyboardType={'numeric'}
                  number={caffeineGoal}
                  onChangeText={(text)=> setCaffeineGoal(text)}
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

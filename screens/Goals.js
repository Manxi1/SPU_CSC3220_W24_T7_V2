import React, { useState, useEffect, useContext, useRef } from 'react';
import { Alert, Animated, Image } from 'react-native';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, Modal, PanResponder} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useRoute } from '@react-navigation/native';
import { TabView, SceneMap } from 'react-native-tab-view';
import * as SQLite from 'expo-sqlite';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './styles.js';
import AppContext from '../AppContextAPI'; 
import SwipeGesture from 'react-native-swipe-gestures';
import moment from 'moment';


export default function HomeScreen({ navigation }) {
  const { totalVolume, setTotalVolume, totalCalories, setTotalCalories, 
    totalSugar, setTotalSugar, totalWaterIntake, setTotalWaterIntake,
    TotalCaffeine, setTotalCaffeine, waterIntakeGoal, setWaterIntakeGoal, calorieGoal, 
    setCalorieGoal, sugarGoal, setSugarGoal, caffeineGoal, setCaffeineGoal } = useContext(AppContext);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTotalPopVisible, setIsTotalPopVisible] = useState(false);
  const [isUpdateGoalPopup, setUpdateGoalPopup] = useState(false);
  const [waterView, setWaterView] = useState(false);
  const [calorieView, setCalorieView] = useState(false);
  const [sugarView, setSugarView] = useState(false);
  const [caffeineView, setCaffeineView] = useState(false);
  const [swipeCount, setSwipeCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(moment());

  const [waterProgress, setWaterProgress] = useState(0); //temporary value for the progress bar

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment());
    }, 1000); // Update time every second

    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   const db = SQLite.openDatabase('./siplogV2.db'); //Database constant

  //   console.log('db', db);

  //   db.transaction(tx => {
  //     tx.executeSql(
  //       'SELECT TotalWaterIntake, TotalVolume, TotalCalories, TotalSugar, TotalCaffeine FROM Goal',
  //       [],
  //       (_, { rows }) => {
  //         console.log(rows._array); // Log the entire result set
  //         // Assuming rows._array is an array containing the result of the SQL query
  //         if (rows._array.length > 0) {
  //           const updatedTotalVolume = parseInt(rows._array[0].TotalVolume);
  //           const updatedTotalWaterIntake = parseInt(rows._array[0].TotalWaterIntake);
  //           const updatedTotalCalories = parseInt(rows._array[0].TotalCalories);
  //           const updatedTotalSugar = parseInt(rows._array[0].TotalSugar);
  //           const updatedTotalCaffeine = parseInt(rows._array[0].TotalCaffeine);
  //           setTotalVolume(updatedTotalVolume); // Call setTotalVolume with the retrieved value
  //           setTotalWaterIntake(updatedTotalWaterIntake);
  //           setTotalCalories(updatedTotalCalories);
  //           setTotalSugar(updatedTotalSugar);
  //           setTotalCaffeine(updatedTotalCaffeine);
  //           console.log('Total Volume:', updatedTotalVolume); // Log the retrieved value
  //           console.log('Total Water Intake:', updatedTotalWaterIntake);
  //           console.log('Total Calories:', updatedTotalCalories);
  //           console.log('Total Sugar:', updatedTotalSugar);
  //           console.log('Total Caffeine:', updatedTotalCaffeine);
  //         } else {
  //           // Handle case when no rows are returned
  //           console.log('No rows returned from database');
  //         }
  //       },
  //       (_, error) => {
  //         console.log('1. Error fetching data from database: ', error);
  //       }
  //     );
  //   });
  // }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = moment();
      if (currentTime.format('HH:mm:ss') === '22:34:00') {
        setCaffeineGoal(1);
        setCalorieGoal(1);
        setSugarGoal(1);
        setWaterIntakeGoal(1);
      }
    }, 1000); // Check every second

    //Create something to keep track of goals for that day and add them to the database

    return () => clearInterval(interval);
  }, []); // Empty dependency array means it runs once on component mount


  const onSwipeLeft = () => {
    setSwipeCount(swipeCount + 1);
    if (swipeCount === 3) {
      setSwipeCount(0);
    }
  };
  const onSwipeRight = () => {
    setSwipeCount(swipeCount - 1);
    if (swipeCount === 0) {
      setSwipeCount(3);
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
  
  const toggleUpdateGoal = () => {
    setUpdateGoalPopup(!isUpdateGoalPopup);
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
    //     'UPDATE Goal SET WaterIntake = ?, CalorieGoal = ?, SugarGoal = ?, CaffeineGoal = ?',
    //     [waterIntakeGoal, calorieGoal, sugarGoal, caffeineGoal],
    //     (_, { insertId }) => {
    //       console.log('Updated Goal table:' + insertId);
    //       fetchGoal(); // Fetch updated DrinkTracker after adding
    //     },
    //     (_, error) => {
    //       console.log('3. Error adding to database: ', error);
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

          {/* <View>
            <Text>{currentTime.format('HH:mm:ss')}</Text>
            <Text>{totalCalories}</Text>
            <Text>{waterIntakeGoal}</Text>
            <Text>{calorieGoal}</Text>
            <Text>{sugarGoal}</Text>
            <Text>{caffeineGoal}</Text>
          </View> */}

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
                    {waterIntakeGoal === 1 ? (
                      <>
                        <Text>Input water intake goal</Text>
                        <View style={styles.alignEclipseNoGoal}>
                          <View style={styles.blackElipses} />
                          <View style={styles.greyElipses} />
                          <View style={styles.greyElipses} />
                          <View style={styles.greyElipses} />
                        </View>
                      </>
                      ) : (
                        <>
                          <Text>Total: {totalWaterIntake} (ml)</Text>
                          <Text>Goal: {waterIntakeGoal} (ml)</Text>
                          <AnimatedCircularProgress
                            size={150} // size of the progress bar
                            width={13} // width of the progress ring
                            fill={totalWaterIntake ? (totalWaterIntake/waterIntakeGoal)*100 : 0.01} // percentage of the progress
                            tintColor="#00FF00" // color of the progress bar
                            backgroundColor="#D3D3D3" // color of the remaining progress
                            rotation={0} // start position of the progress bar
                            style={{ bottom: -40, position: 'relative'}}
                            children={() => 
                              <View>
                                <Text>{Math.round((totalWaterIntake/waterIntakeGoal)*100)}%</Text>
                                {/* <Text>{Math.round(100 - (waterProgress/waterIntakeGoal)*100)}% left</Text> */}
                              </View>
                            }
                          />
                          <View style={styles.alignEclipse}>
                            <View style={styles.blackElipses} />
                            <View style={styles.greyElipses} />
                            <View style={styles.greyElipses} />
                            <View style={styles.greyElipses} />
                          </View>
                        </>
                      )}
                  </>
                )}
                
                {(swipeCount === 1) && (
                  <>
                    <Text style={styles.goalsTitle}>Calorie Intake Goal</Text>
                    {calorieGoal === 1 ? (
                      <>
                        <Text>Input calorie goal</Text>
                        <View style={styles.alignEclipseNoGoal}>
                          <View style={styles.greyElipses} />
                          <View style={styles.blackElipses} />
                          <View style={styles.greyElipses} />
                          <View style={styles.greyElipses} />
                        </View>
                      </>
                      ) : (
                        <>
                          <Text>Total: {totalCalories} (kcal)</Text>
                          <Text>Calorie Goal: {calorieGoal} (kcal)</Text>
                          <AnimatedCircularProgress
                            size={150} // size of the progress bar
                            width={13} // width of the progress ring
                            fill={totalCalories ? (totalCalories/calorieGoal)*100 : 0.01} // percentage of the progress
                            tintColor="#00FF00" // color of the progress bar
                            backgroundColor="#D3D3D3" // color of the remaining progress
                            rotation={0} // start position of the progress bar
                            style={{ bottom: -40, position: 'relative'}}
                            children={() => 
                              <View>
                                <Text>{Math.round((totalCalories/calorieGoal)*100)}%</Text>
                                <Text>{Math.round(100 - (totalCalories/calorieGoal)*100)}% left</Text>
                              </View>
                            }
                          />
                          <View style={styles.alignEclipse}>
                            <View style={styles.greyElipses} />
                            <View style={styles.blackElipses} />
                            <View style={styles.greyElipses} />
                            <View style={styles.greyElipses} />
                          </View>
                        </>
                      )}
                  </>
                )}

                {(swipeCount === 2) && (
                  <>
                    <Text style={styles.goalsTitle}>Sugar Intake Goal</Text>
                    {sugarGoal === 1 ? (
                      <>
                        <Text>Input sugar goal</Text>
                        <View style={styles.alignEclipseNoGoal}>
                          <View style={styles.greyElipses} />
                          <View style={styles.greyElipses} />
                          <View style={styles.blackElipses} />
                          <View style={styles.greyElipses} />
                        </View>
                      </>
                      ) : (
                        <>
                          <Text>Total: {totalSugar} (g)</Text>
                          <Text>Sugar Goal: {sugarGoal} (g)</Text>
                          <AnimatedCircularProgress
                            size={150} // size of the progress bar
                            width={13} // width of the progress ring
                            fill={totalSugar ? (totalSugar/sugarGoal)*100 : 0.01} // percentage of the progress
                            tintColor="#00FF00" // color of the progress bar
                            backgroundColor="#D3D3D3" // color of the remaining progress
                            rotation={0} // start position of the progress bar
                            style={{ bottom: -40, position: 'relative'}}
                            children={() => 
                              <View>
                                <Text>{Math.round((totalSugar/sugarGoal)*100)}%</Text>
                                <Text>{Math.round(100 - (totalSugar/sugarGoal)*100)}% left</Text>
                              </View>
                            }
                          />
                          <View style={styles.alignEclipse}>
                            <View style={styles.greyElipses} />
                            <View style={styles.greyElipses} />
                            <View style={styles.blackElipses} />
                            <View style={styles.greyElipses} />
                          </View>
                        </>
                      )}
                  </>
                )}

                {(swipeCount === 3) && (
                  <>
                    <Text style={styles.goalsTitle}>Caffeine Intake Goal</Text>
                    {caffeineGoal === 1 ? (
                      <>
                        <Text>Input caffeine goal</Text>
                        <View style={styles.alignEclipseNoGoal}>
                          <View style={styles.greyElipses} />
                          <View style={styles.greyElipses} />
                          <View style={styles.greyElipses} />
                          <View style={styles.blackElipses} />
                        </View>
                      </>
                      ) : (
                        <>
                          <Text>Total: {TotalCaffeine} (mg)</Text>
                          <Text>Caffeine Goal: {caffeineGoal} (mg)</Text>
                          <AnimatedCircularProgress
                            size={150} // size of the progress bar
                            width={13} // width of the progress ring
                            fill={TotalCaffeine ? (TotalCaffeine/caffeineGoal)*100 : 0.01} // percentage of the progress
                            tintColor="#00FF00" // color of the progress bar
                            backgroundColor="#D3D3D3" // color of the remaining progress
                            rotation={0} // start position of the progress bar
                            style={{ bottom: -40, position: 'relative'}}
                            children={() => 
                              <View>
                                <Text>{Math.round((TotalCaffeine/caffeineGoal)*100)}%</Text>
                                <Text>{Math.round(100 - (TotalCaffeine/caffeineGoal)*100)}% left</Text>
                              </View>
                            }
                          />
                          <View style={styles.alignEclipse}>
                            <View style={styles.greyElipses} />
                            <View style={styles.greyElipses} />
                            <View style={styles.greyElipses} />
                            <View style={styles.blackElipses} />
                          </View>
                        </>
                      )}
                  </>
                )}
              </View>
            </SwipeGesture>
          </View>


          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.roundButton} onPress={() => setIsAddMode(true)}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
            <Text style={styles.volumeFooter}>Click to add goals</Text>
          </View>
          <Modal 
          visible={isAddMode} 
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsAddMode(false)}
          >
            <View style={styles.modalContainer}>
              <View style = {styles.modalView}>
                <Text style={styles.addGoalTitle}>Add or update goals</Text>
                <View style = {styles.textInputView}>
                  <TextInput
                  style={styles.input}
                  placeholder={'Water Goal (ml)'}
                  keyboardType={'numeric'}
                  number={waterIntakeGoal}
                  onChangeText={(input)=> inputWaterGoal(parseInt(input))}
                  />
                  <TextInput
                  style={styles.input}
                  placeholder={'Calorie Goal (kcal)'}
                  keyboardType={'numeric'}
                  number={calorieGoal}
                  onChangeText={(text)=> setCalorieGoal(parseInt(text))}
                  />
                  <TextInput
                  style={styles.input}
                  placeholder={'Sugar Goal (g)'}
                  keyboardType={'numeric'}
                  number={sugarGoal}
                  onChangeText={(text)=> setSugarGoal(parseInt(text))}
                  />
                  <TextInput
                  style={styles.input}
                  placeholder={'Caffeine Goal (mg)'}
                  keyboardType={'numeric'}
                  number={caffeineGoal}
                  onChangeText={(text)=> setCaffeineGoal(parseInt(text))}
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
                  
                  <TouchableOpacity onPress={toggleMenu} style={[styles.MenuItemes, { marginBottom: -30 }]}>
                    <Text style={styles.MenuItemestext}>Home</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate("Settings")} style={[styles.MenuItemes, { flex: 2 ,marginBottom:-30}]}>
                    <Text style={styles.MenuItemestext}>Drink list</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate("About")} style={[styles.MenuItemes, { flex: 18, marginTop:0}]}>
                    <Text style={styles.MenuItemestext}>About</Text>
                  </TouchableOpacity>

                  </View>
                </View>
            </View>
            
          </Modal>
          
      </View>
      
  );
}

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
import { useFocusEffect } from '@react-navigation/native';


export default function HomeScreen({ navigation }) {
  const { fetchGoalsTable, fetchedWaterGoal,
    fetchedCalorieGoal,
    fetchedSugarGoal,
    fetchedCaffeieneGoal, db, updateGoalsTable, totalVolume, setTotalVolume, totalCalories, setTotalCalories, 
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

  const [counter, setCounter] = useState(0); //temporary value for the progress bar

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment());
    }, 1000); // Update time every second

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = moment();
      if (currentTime.format('HH:mm:ss') === '17:20:00') {
        updateGoalsTable(1, 1, 1, 1);
        setCounter(counter + 1);
      }
    }, 1000); // Check every second

    //Create something to keep track of goals for that day and add them to the database

    return () => clearInterval(interval);
  }, []); // Empty dependency array means it runs once on component mount

  useFocusEffect(
    React.useCallback(() => {
      // Fetch the data and update the state
      fetchGoalsTable();
    }, [counter])
  );

  useFocusEffect(
    React.useCallback(() => {
      // Your refresh logic here
      setIsMenuOpen(false);
    }, [])
  );

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

  const handleAddTask = () => {
    Keyboard.dismiss();
    setIsAddMode(false);
   
    const handleBackButton = () => {
      setIsMenuOpen(false); // Close the menu
    };
    console.log('Water Goal Input:', waterIntakeGoal);
    updateGoalsTable(waterIntakeGoal, calorieGoal, sugarGoal, caffeineGoal);
  
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

          <View style={styles.timeContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <View style={styles.textTimeBubble}>
                <Text style={styles.timeText}>{24 - currentTime.format('HH')}</Text>
                <Text style={styles.timeAbrviation}>Hr</Text>
              </View>

              <Text style={{textAlign: 'center', fontSize: 20, marginHorizontal: 5, padding: 5 }}>:</Text>

              <View style={styles.textTimeBubble}>
                <Text style={styles.timeText}>{60 - currentTime.format('mm')}</Text>
                <Text style={styles.timeAbrviation}>Min</Text>
              </View>

              <Text style={{textAlign: 'center', fontSize: 20, marginHorizontal: 5, padding: 5 }}>:</Text>
                
              <View style={styles.textTimeBubble}>
                <Text style={styles.timeText}>{60 - currentTime.format('ss')}</Text>
                <Text style={styles.timeAbrviation}>Sec</Text>
              </View>
            </View>
            <View style={{ marginTop: 5, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.timeFooter}>Time To Complete Goal</Text>
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
                    {waterIntakeGoal === 1 ? (
                      <>
                        <Text style={{ fontSize: 18 }}>Input water intake goal</Text>
                        <View style={styles.alignEclipseNoGoal}>
                          <View style={styles.blackElipses} />
                          <View style={styles.greyElipses} />
                          <View style={styles.greyElipses} />
                          <View style={styles.greyElipses} />
                        </View>
                      </>
                      ) : (
                        <>
                          <Text style={{ fontSize: 18 }}>Total: {totalWaterIntake} (ml)</Text>
                          <Text style={{ fontSize: 18 }}>Goal: {waterIntakeGoal} (ml)</Text>
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
                                <Text style={{ fontSize: 18 }}>{Math.min(100, Math.round((totalWaterIntake / waterIntakeGoal) * 100))}%</Text>
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
                        <Text style={{ fontSize: 18 }}>Input calorie goal</Text>
                        <View style={styles.alignEclipseNoGoal}>
                          <View style={styles.greyElipses} />
                          <View style={styles.blackElipses} />
                          <View style={styles.greyElipses} />
                          <View style={styles.greyElipses} />
                        </View>
                      </>
                      ) : (
                        <>
                          <Text style={{ fontSize: 18 }}>Total: {totalCalories} (kcal)</Text>
                          <Text style={{ fontSize: 18 }}>Goal: {calorieGoal} (kcal)</Text>
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
                                <Text style={{ fontSize: 18 }}>{Math.min(100, Math.round((totalCalories / calorieGoal) * 100))}%</Text>
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
                        <Text style={{ fontSize: 18 }}>Input sugar goal</Text>
                        <View style={styles.alignEclipseNoGoal}>
                          <View style={styles.greyElipses} />
                          <View style={styles.greyElipses} />
                          <View style={styles.blackElipses} />
                          <View style={styles.greyElipses} />
                        </View>
                      </>
                      ) : (
                        <>
                          <Text style={{ fontSize: 18 }}>Total: {totalSugar} (g)</Text>
                          <Text style={{ fontSize: 18 }}>Goal: {sugarGoal} (g)</Text>
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
                                <Text style={{ fontSize: 18 }}>{Math.min(100, Math.round((totalSugar / sugarGoal) * 100))}%</Text>
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
                        <Text style={{ fontSize: 18 }}>Input caffeine goal</Text>
                        <View style={styles.alignEclipseNoGoal}>
                          <View style={styles.greyElipses} />
                          <View style={styles.greyElipses} />
                          <View style={styles.greyElipses} />
                          <View style={styles.blackElipses} />
                        </View>
                      </>
                      ) : (
                        <>
                          <Text style={{ fontSize: 18 }}>Total: {TotalCaffeine} (mg)</Text>
                          <Text style={{ fontSize: 18 }}>Goal: {caffeineGoal} (mg)</Text>
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
                                <Text style={{ fontSize: 18 }}>{Math.min(100, Math.round((TotalCaffeine / caffeineGoal) * 100))}%</Text>
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
            <View style={{marginTop: 5}}>
              <Text style={styles.volumeFooter}>Click to add goals</Text>
            </View>
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

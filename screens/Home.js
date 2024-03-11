import React, { useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, Modal} from 'react-native';
import Drink from '../components/Drinks.js';
import { StatusBar } from 'expo-status-bar';
import * as SQLite from 'expo-sqlite';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './styles.js';
import AppContext from '../AppContextAPI'; 
import ModalDropdown from 'react-native-modal-dropdown';
import drinksData from './Drinksdata.js';
// import db from '../database.js';
import { useFocusEffect } from '@react-navigation/native';



export default function HomeScreen({ navigation }) {

  const [drinkName, setDrinkName] = useState('');
  const [drinkVolume, setDrinkVolume] = useState('');
  const [drinknotes, setDrinkNotes] = useState('');
  const [drinkCalories, setDrinkCalories] = useState(0);
  const [drinkSugar, setDrinkSugar] = useState(0);
  const [drinkCaffeine, setDrinkCaffeine] = useState(0);
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [taskItems, setTaskItems] = useState([]);
  const [isAddMode, setIsAddMode] = useState(false);
  const [DrinkTracker, setDrinkTracker] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTotalPopVisible, setIsTotalPopVisible] = useState(false);
  const [selectedDrinkInfo, setSelectedDrinkInfo] = useState({ sugar: 0, caffeine: 0, calories: 0 }); // New state for selected drink info  

  
  // const [totalVolume, setTotalVolume] = useState(0);
  // const [totalCalories, setTotalCalories] = useState(0);
  // const [totalSugar, setTotalSugar] = useState(0);
  // const [TotalCaffeine, setTotalCaffeine] = useState(0);
  const { fetchGoalsTable, fetchedWaterGoal,
    fetchedCalorieGoal,
    fetchedSugarGoal,
    fetchedCaffeieneGoal, db, updateGoalsTable, totalVolume, setTotalVolume, totalCalories, setTotalCalories, 
    totalSugar, setTotalSugar, totalWaterIntake, setTotalWaterIntake,
    TotalCaffeine, setTotalCaffeine, waterIntakeGoal, setWaterIntakeGoal, calorieGoal, 
    setCalorieGoal, sugarGoal, setSugarGoal, caffeineGoal, setCaffeineGoal } = useContext(AppContext);
  // const db = SQLite.openDatabase('./siplogV2.db'); //Database constant
  // const db = SQLite.openDatabase('./siplogV2db.db');

  useEffect(() => {
    // Create table if not exists
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Drink (
                DrinkId     INTEGER PRIMARY KEY AUTOINCREMENT,
                Content     TEXT    NOT NULL,
                Volume      NUMERIC DEFAULT (0),
                Notes       TEXT,
                Calories    NUMERIC DEFAULT (0),
                Sugar       NUMERIC DEFAULT (0),
                Caffeine    NUMERIC DEFAULT (0),
                DrinkListId INTEGER REFERENCES Tracker (DrinkListId)
            )`, [],
            () => {
              // Success callback (optional)
              console.log('Drink Table created successfully');
              // Fetch data from the database when component mounts
              fetchDrinkTracker();
            },
            (_, error) => {
              // Error callback
              console.error('Error creating Drink Table:', error);
            }
        );

        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Goal (
                GoalId      INTEGER PRIMARY KEY AUTOINCREMENT,
                WaterIntake INTEGER DEFAULT (0),
                TotalVolume NUMERIC DEFAULT (0),
                TotalWaterIntake NUMERIC DEFAULT (0),
                TotalCalories    NUMERIC DEFAULT (0),
                TotalSugar       NUMERIC DEFAULT (0),
                TotalCaffeine    NUMERIC DEFAULT (0),
                CalorieGoal      NUMERIC DEFAULT (0),
                SugarGoal        NUMERIC DEFAULT (0),
                CaffeineGoal     NUMERIC DEFAULT (0),
                DrinkListId INTEGER REFERENCES Tracker (DrinkListId) 
            )`, [],
            () => {
              // Success callback (optional)
              console.log('Goal Table created successfully');
              // Fetch data from the database when component mounts
              fetchGoal();
            },
            (_, error) => {
              // Error callback
              console.error('Error creating Goal Table:', error);
            }
        );

        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Tracker (
                DrinkListId INTEGER PRIMARY KEY AUTOINCREMENT,
                TrackerDay TEXT NOT NULL,
                TrackerItem TEXT NOT NULL,
                TrackerCreatedAt TEXT NOT NULL,
                GoalId      INTEGER REFERENCES Goal (GoalId)
            )`, [],
            () => {
              // Success callback (optional)
              console.log('Tracker Table created successfully');
              // Fetch data from the database when component mounts
              fetchDrinkTracker();
            },
            (_, error) => {
              // Error callback
              console.error('Error creating Tracker Table:', error);
            }
        );

        // db.transaction(tx => {
        //   tx.executeSql(
        //     'INSERT INTO Goal (WaterIntake) VALUES (?)',
        //     [0], // Replace with the value you want to insert
        //     (_, result) => {
        //       console.log('Row inserted into Goal');
        //     },
        //     (_, error) => {
        //       console.log('Error inserting row into Goal: ', error);
        //     }
        //   );
        // });

        // db.transaction(tx => {
        //   tx.executeSql(
        //     'DELETE FROM Goal',
        //     [],
        //     (_, result) => {
        //       console.log('All rows deleted from Goal');
        //     },
        //     (_, error) => {
        //       console.log('Error deleting rows from Goal: ', error);
        //     }
        //   );
        // });

        // db.transaction(tx => {
        //   tx.executeSql(
        //       `ALTER TABLE Tracker ADD COLUMN TrackerDay TEXT NOT NULL,
        //       TrackerItem TEXT NOT NULL,
        //       TrackerCreatedAt TEXT NOT NULL,`, [],
        //       () => {
        //           console.log('NewColumn added to Drink table successfully');
        //       },
        //       (_, error) => {
        //           console.error('Error adding NewColumn to Drink table:', error);
        //       }
        //   );
        // });
    });

  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Your refresh logic here
      setIsMenuOpen(false);
      setIsTotalPopVisible(false);
    }, [])
  );

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle menu visibility
  };

  
  const toggleTotalPopup = () => {
    setIsTotalPopVisible(!isTotalPopVisible);
  };

  const fetchDrinkTracker = () => { //Handels error logging if database doesnt open
    db.transaction(tx => {
      tx.executeSql( // Fetch all data from the Drink table
        'SELECT * FROM Drink',
        [],
        (_, { rows }) => {
          const data = rows._array.map(item => ({ DrinkId: item.DrinkId, Content: item.Content, Volume: item.Volume,
            Notes: item.Notes, Calories: item.Calories, Sugar: item.Sugar, Caffeine: item.Caffeine}));
          //setTaskItems(data);
          setDrinkTracker(data);
        },
        (_, error) => {
          console.log('1. Error fetching data from database: ', error);
        }
      );
    });
  };

  const fetchGoal = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT TotalWaterIntake, TotalVolume, TotalCalories, TotalSugar, TotalCaffeine FROM Goal',
        [],
        (_, { rows }) => {
          console.log(rows._array); // Log the entire result set
          // Assuming rows._array is an array containing the result of the SQL query
          if (rows._array.length > 0) {
            const updatedTotalVolume = parseInt(rows._array[0].TotalVolume);
            const updatedTotalWaterIntake = parseInt(rows._array[0].TotalWaterIntake);
            const updatedTotalCalories = parseInt(rows._array[0].TotalCalories);
            const updatedTotalSugar = parseInt(rows._array[0].TotalSugar);
            const updatedTotalCaffeine = parseInt(rows._array[0].TotalCaffeine);
            const updatedWaterIntakeGoal = parseInt(rows._array[0].WaterIntake);
            const updatedCalorieGoal = parseInt(rows._array[0].CalorieGoal);
            const updatedSugarGoal = parseInt(rows._array[0].SugarGoal);
            const updatedCaffeineGoal = parseInt(rows._array[0].CaffeineGoal);
            setWaterIntakeGoal(updatedWaterIntakeGoal);
            setCalorieGoal(updatedCalorieGoal);
            setSugarGoal(updatedSugarGoal);
            setCaffeineGoal(updatedCaffeineGoal);
            
            setTotalVolume(updatedTotalVolume); // Call setTotalVolume with the retrieved value
            setTotalWaterIntake(updatedTotalWaterIntake);
            setTotalCalories(updatedTotalCalories);
            setTotalSugar(updatedTotalSugar);
            setTotalCaffeine(updatedTotalCaffeine);
            console.log('Total Volume:', updatedTotalVolume); // Log the retrieved value
            console.log('Total Water Intake:', updatedTotalWaterIntake);
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
    const newDrink = `${drinkName} ${drinkVolume} ${drinknotes}`; // Remove the '-' and 'ml'
    if (isNaN(drinkVolume) || drinkVolume === '') {
      Alert.alert('Warning', 'Drink volume must be a number');
      return;
    }
    if (parseInt(drinkVolume) < 0) {
      Alert.alert('Warning', 'Drink volume must be a positive number');
      return;
    }

    let updatedTotalWaterIntake = totalWaterIntake;
    if (drinkName === 'water' || drinkName === 'Water') {
      console.log('Drink is water');
      updatedTotalWaterIntake = totalWaterIntake + parseInt(drinkVolume);
    }
    

    const updatedTotalVolume = totalVolume + parseInt(drinkVolume);
    const updatedTotalCalories = totalCalories + Math.round(drinkCalories * parseInt(drinkVolume));
    const updatedTotalSugar = totalSugar + Math.round(drinkSugar * parseInt(drinkVolume));
    const updatedTotalCaffeine = TotalCaffeine + Math.round(drinkCaffeine * parseInt(drinkVolume));

    const updatedDrinkCalories = Math.round(drinkCalories * parseInt(drinkVolume));
    const updatedDrinkSugar = Math.round(drinkSugar * parseInt(drinkVolume));
    const updatedDrinkCaffeine = Math.round(drinkCaffeine * parseInt(drinkVolume));


    console.log('New Drink:', newDrink); // Log the newDrink value
    console.log('Drink Name:', drinkName); // Log the drink name
    console.log('Drink Volume:', drinkVolume); // Log the drinkVolume value
    console.log('Drink Notes:', drinknotes); // Log the drinknotes value
    console.log('Drink Calories:', updatedDrinkCalories); 
    console.log('Drink Sugar:', updatedDrinkSugar); 
    console.log('Drink Caffeine:', updatedDrinkCaffeine); 
    console.log('Total Volume:', updatedTotalVolume); // Log the updatedTotalVolume value
    console.log('Total Sugar: ', updatedTotalCalories);
    console.log('Total Caffeine: ', updatedTotalSugar);
    console.log('Total Calories: ', updatedTotalCaffeine);
    console.log(currentDate);
    setTaskItems([...taskItems, newDrink]);
    setSearchTerm('');
    setDrinkVolume('');
    setDrinkNotes('');
    setDrinkCaffeine('');
    setDrinkSugar('');
    setDrinkCalories('');
    setIsAddMode(false);
    

    
  
    const handleBackButton = () => {
      setIsMenuOpen(false); // Close the menu
    };
  
    // Insert the new drink into the database
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO Drink (Content, Volume , Notes, Calories, Sugar, Caffeine, TrackerDay) VALUES (?, ?, ?, ?, ?, ?)',
        [drinkName, parseInt(drinkVolume), drinknotes, updatedDrinkCalories, updatedDrinkSugar, updatedDrinkCaffeine,, getDayOfWeek(currentDate)],
        (_, { insertId }) => {
          console.log('Added to database with ID: ', insertId);
          fetchDrinkTracker(); // Fetch updated DrinkTracker after adding
        },
        (_, error) => {
          console.log('2. Error adding to database: ', error);
        }
      );

      // tx.executeSql( // Update Goal table with the totalVolume state
      //   'UPDATE Goal Set TotalVolume = ? ',
      //   [parseInt(updatedTotalVolume)],
      //   (_, { insertId }) => {
      //     console.log('Updated Goal table');
      //     fetchGoal(); // Fetch updated DrinkTracker after adding
      //   },
      //   (_, error) => {
      //     console.log('3. Error adding to database: ', error);
      //   }
      // );
      tx.executeSql(
        'UPDATE Goal SET TotalWaterIntake = ?, TotalVolume = ?, TotalCalories = ?, TotalSugar = ?, TotalCaffeine = ?',
        [updatedTotalWaterIntake, parseInt(updatedTotalVolume), updatedTotalCalories, updatedTotalSugar, updatedTotalCaffeine],
        (_, { insertId }) => {
          console.log('Updated Goal table');
          fetchGoal(); // Fetch updated DrinkTracker after adding
        },
        (_, error) => {
          console.log('3. Error adding to database: ', error);
        }
      );
    });
  };

  const completeTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    //setTaskItems(itemsCopy);
    setDrinkTracker(itemsCopy);
    const updatedTotalVolume = totalVolume - parseInt(DrinkTracker[index].Volume);
    let updatedTotalWaterIntake = totalWaterIntake;
    if (DrinkTracker[index].Content === 'water' || DrinkTracker[index].Content === 'Water') {
      console.log('Drink is water');
      updatedTotalWaterIntake = totalWaterIntake - parseInt(DrinkTracker[index].Volume);
    }
    const updatedTotalCalories = totalCalories - Math.round(DrinkTracker[index].Calories);
    const updatedTotalSugar = totalSugar - Math.round(DrinkTracker[index].Sugar);
    const updatedTotalCaffeine = TotalCaffeine - Math.round(DrinkTracker[index].Caffeine);


    setTotalVolume(updatedTotalVolume);
    const messageId = DrinkTracker[index]?.DrinkId;
    if (messageId) {
      db.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM Drink WHERE DrinkId = ?',
          [messageId],
          () => {
            console.log('Message deleted from database with ID: ', messageId);
            fetchDrinkTracker(); // Fetch updated DrinkTracker after deletion
          },
          (_, error) => {
            console.log('4. Error deleting from database: ', error);
          }
        );
      });

      db.transaction((tx) => {
        tx.executeSql(
          'UPDATE Goal SET TotalWaterIntake = ?, TotalVolume = ?, TotalCalories = ?, TotalSugar = ?, TotalCaffeine = ?',
          [updatedTotalWaterIntake, parseInt(updatedTotalVolume), updatedTotalCalories, updatedTotalSugar, updatedTotalCaffeine],
          (_, { insertId }) => {
            console.log('Updated Goal table');
            fetchGoal(); // Fetch updated DrinkTracker after adding
          },
          (_, error) => {
            console.log('3. Error adding to database: ', error);
          }
        );
      });

    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionVisible, setIsSuggestionVisible] = useState(false);
  
  const handleInputChange = (text) => {
    setSearchTerm(text);
    // Perform your search logic here to get suggestions based on the input text
    // For simplicity, I'm just filtering the predefined drinksData array
    // console.log('Text:', text);
    // console.log('Drink Data:', drinksData);
    // const filteredSuggestions = drinksData.filter(drink => drink.name.toLowerCase().includes(text.toLowerCase()))
    const filteredSuggestions = drinksData[0]
      .filter(drink => drink.name && drink.name.toLowerCase().includes(text.toLowerCase()))
      .map(drink => drink.name)
      .slice(0, 2);
    setSuggestions(filteredSuggestions);
    setIsSuggestionVisible(!!text);
      // Show suggestions if text is not empty
  };
  
  const handleSuggestionSelect = (drinkname) => {
    setSearchTerm(drinkname);
    setIsSuggestionVisible(false); // Hide suggestions after selection
    setDrinkName(drinkname); // Update the drinkName state with the selected drink name

    // Find the selected drink from drinksData
    // const selected = drinksData.find(drink => drink.name === drinkname);
    const selected = drinksData[0].find(drink => drink.name.trim().toLowerCase() === drinkname.trim().toLowerCase());
    console.log('Selected Drink:', selected);
    console.log('Selected Drink Info:', selected.sugar, selected.caffeine, selected.calories);
    if (selected) {
      setSelectedDrink(selected);
      setSelectedDrinkInfo({
        sugar: selected.sugar,
        caffeine: selected.caffeine,
        calories: selected.calories
      });
      setDrinkCalories(selected.calories);
      setDrinkSugar(selected.sugar);
      setDrinkCaffeine(selected.caffeine);
    }
  };
  
  
  const renderSuggestionItem = ({ drinkname }) => (
    <TouchableOpacity onPress={() => handleSuggestionSelect(drinkname)}>
      <Text style={styles.itemText}>{drinkname}</Text>
    </TouchableOpacity>
  );
  const getDayOfWeek = (dateString) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const date = new Date(dateString);
   
    return days[date.getDay()];
  };
  
  // Function to format the date as MM-DD-YYYY
  const getCurrentFormattedDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
  
    return `${yyyy}-${mm}-${dd}`; // Changed to ISO 8601 format (YYYY-MM-DD)
  };
  
  // Function to group items by the day of the week
  const groupByDayOfWeek = (items, currentDate) => {
    return items.reduce((groups, item) => {
      const dayOfWeek = getDayOfWeek(currentDate);
      if (!groups[dayOfWeek]) {
        groups[dayOfWeek] = [];
      }
      groups[dayOfWeek].push({ ...item, createdAt: currentDate });
      return groups;
    }, {});
  };
  
  // Get the current formatted date
  const currentDate = getCurrentFormattedDate();

  // const saveGroupedItems = (groupedItems) => {
  //   db.transaction((tx) => {
  //     for (const day in groupedItems) {
  //       const items = groupedItems[day];
  //       for (const item of items) {
  //         tx.executeSql(
  //           'INSERT INTO Tracker (TrackerDate, TrackerItem, TrackerCreatedAt) VALUES (?, ?, ?)',
  //           [day, JSON.stringify(item), item.createdAt],
  //           (tx, results) => {
  //             if (results.rowsAffected > 0) {
  //               console.log('Insert success');
  //             } else {
  //               console.log('Insert failed');
  //             }
  //           },
  //           (error) => {
  //             console.log('Error occurred', error);
  //           }
  //         );
  //       }
  //     }
  //   });
  // };
  
  
  // Group the DrinkTracker items by the day of the week using the current date
  const groupedItems = groupByDayOfWeek(DrinkTracker, currentDate);
  // saveGroupedItems(groupedItems);
  const [isPressed, setIsPressed] = useState(false);
  const [isSettingsPressed, setIsSettingsPressed] = useState(false);
  const [isAboutPressed, setIsAboutPressed] = useState(false);
  
      
    
      return (
          <View style={styles.container}>

                  <View style={styles.DrinkWrapper}>
                    <View style={styles.sectionTitle}>
                      <Text style={styles.sectionTitleTextBig}>Daily Gulp</Text>
                      <TouchableOpacity onPress={() => navigation.navigate("Goals", {
                        })}>
                        <Text style={styles.sectionTitleTextSmallGoal}>Goals</Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={toggleTotalPopup} style={styles.totalVolumeButton}>
                      <Text style={styles.volumeTitle}>Total Volume: {totalVolume} (ml)</Text>
                      <Text style={styles.volumeFooter}>Click for more</Text>
                    </TouchableOpacity>
                    
                    <View style={styles.items}>
                      {Object.keys(groupedItems).map(day => (
                        <View key={day}>
                          <Text>{day}</Text>
                          {groupedItems[day].map((item, index) => (
                            <Drink 
                              key={index} 
                              drink={item.Content} 
                              volume={item.Volume}
                              createdAt={item.createdAt}
                              notes={item.Notes} 
                              sugar={item.Sugar}
                              caffeine={item.Caffeine} // Remove unnecessary curly braces
                              calories={item.Calories}
                              completeTask={() => completeTask(index)} 
                              index={index}
                              // ... other props
                            />
                          ))}
                        </View>
                      ))}
                      
                    </View>
                  </View>

                  <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isTotalPopVisible}
                    onRequestClose={() => {
                      setIsTotalPopVisible(false);
                    }}>
                    <View style={styles.totalPopup}>
                      <View style={styles.totalPopupView}>
                        <View style={styles.totalPopupText}>
                          <Text>Total Volume: {totalVolume} (ml)</Text>
                          <Text>Total Water Intake: {totalWaterIntake} (ml)</Text>
                          <Text>Total Calories: {totalCalories} (kcal)</Text>
                          <Text>Total Sugar: {totalSugar} (g)</Text>
                          <Text>Total Caffeine: {TotalCaffeine} (mg)</Text>
                          {/* <TouchableOpacity onPress={resetGoalsTable} style={styles.totalPopupClose}>
                            <Text style={styles.addText}>Reset</Text>
                          </TouchableOpacity> */}
                          <TouchableOpacity onPress={() => setIsTotalPopVisible(false)} style={styles.totalPopupClose}>
                            <Text style={styles.addText}>Close</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </Modal>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.roundButton} onPress={() => setIsAddMode(true)}>
                    <Text style={styles.buttonText}>+</Text>
                  </TouchableOpacity>
                  <View style={{marginTop: 5}}>
                    <Text style={styles.volumeFooter}>Click to add drinks</Text>
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
                    <View style = {styles.textInputView}>
                    <View style={styles.container}>
                          
                  <TextInput
                    style={styles.inputDrinks}
                    placeholder="Search for a drink..."
                    value={searchTerm}
                    onChangeText={handleInputChange}
                  />
                  {isSuggestionVisible && (
                    <View style={styles.suggestionsContainer}>
                      {suggestions.map((drinkname, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => handleSuggestionSelect(drinkname)}
                          style={styles.suggestionItem}
                        >
                          <Text>{drinkname}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
                      <TextInput
                      style={styles.input}
                      placeholder={'Volume (ml)'}
                      keyboardType={'numeric'}
                      value={drinkVolume}
                      onChangeText={(text) => setDrinkVolume(text)}
                      />
                      <TextInput
                      style={styles.inputMessage}
                      placeholder={'Notes'}
                      value={drinknotes}
                      onChangeText={(text) => setDrinkNotes(text)}
                      />
                    </View>

                    <View style = {styles.addCloseView}>

                      <TouchableOpacity
                        onPress={() => {
                          setSearchTerm('');
                          setDrinkVolume('');
                          setDrinkNotes('');
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
                      
                      <TouchableOpacity
                      onPressIn={() => setIsPressed(true)}
                      onPressOut={() => setIsPressed(false)}
                      onPress={toggleMenu}
                      style={[styles.MenuItemes, { marginBottom: -30 }]}
                      >
                        <Text style={[styles.MenuItemestext, isPressed && styles.underline]}>Home</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPressIn={() => setIsSettingsPressed(true)}
                        onPressOut={() => setIsSettingsPressed(false)}
                        onPress={() => navigation.navigate("Settings")}
                        style={[styles.MenuItemes, { flex: 2 ,marginBottom:-30}]}
                      >
                        <Text style={[styles.MenuItemestext, isSettingsPressed && styles.underline]}>Drink List</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPressIn={() => setIsAboutPressed(true)}
                        onPressOut={() => setIsAboutPressed(false)}
                        onPress={() => navigation.navigate("About")}
                        style={[styles.MenuItemes, { flex: 18, marginTop:0}]}
                      >
                        <Text style={[styles.MenuItemestext, isAboutPressed && styles.underline]}>About</Text>
                      </TouchableOpacity>

                      </View>
                    </View>
                </View>
                
              </Modal>
              
            </View>
      );
    }

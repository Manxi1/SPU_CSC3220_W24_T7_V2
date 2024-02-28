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

export default function HomeScreen({ navigation }) {

  const [drinkName, setDrinkName] = useState('');
  const [drinkVolume, setDrinkVolume] = useState('');
  const [drinknotes, setDrinkNotes] = useState('');
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [taskItems, setTaskItems] = useState([]);
  const [isAddMode, setIsAddMode] = useState(false);
  const [DrinkTracker, setDrinkTracker] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTotalPopVisible, setIsTotalPopVisible] = useState(false);
  const [selectedDrinkInfo, setSelectedDrinkInfo] = useState({
    sugar: 0,
    caffeine: 0,
    calories: 0
  }); // New state for selected drink info

  // const [totalVolume, setTotalVolume] = useState(0);
  // const [totalCalories, setTotalCalories] = useState(0);
  // const [totalSugar, setTotalSugar] = useState(0);
  // const [TotalCaffeine, setTotalCaffeine] = useState(0);
  const { totalVolume, setTotalVolume, totalCalories, setTotalCalories, 
    totalSugar, setTotalSugar, totalWaterIntake, setTotalWaterIntake,
    TotalCaffeine, setTotalCaffeine, waterIntakeGoal, setWaterIntakeGoal, calorieGoal, 
    setCalorieGoal, sugarGoal, setSugarGoal, caffeineGoal, setCaffeineGoal } = useContext(AppContext);
  const db = SQLite.openDatabase('./siplogV2.db'); //Database constant

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
                Message     TEXT,
                Date        TEXT    NOT NULL,
                Time        TEXT    NOT NULL,
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
        //     'INSERT INTO Goal (TotalVolume, TotalCalories, TotalSugar, TotalCaffeine) VALUES (?, ?, ?, ?)',
        //     [0, 0, 0, 0], // Replace with the value you want to insert
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
        //       `ALTER TABLE Goal ADD COLUMN TotalWaterIntake NUMERIC DEFAULT (0)`, [],
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

  const resetGoalsTable = () => { // For future use to reset goals table

    db.transaction(tx => {
      tx.executeSql(
        `UPDATE Goal SET TotalVolume = ? WHERE GoalId = ?`, 
        [0, 1],
        (_, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log('Update successful');
            setTotalVolume(0); // increment refreshKey to force a re-render
          } else {
            console.log('Update failed');
          }
        },
        (_, error) => {
          console.error('Error updating totalVolume in Goals table:', error);
        }
      );
    });

  };


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
          const data = rows._array.map(item => ({ DrinkId: item.DrinkId, Content: item.Content, Volume: item.Volume , Notes: item.Notes}));
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
    const newDrink = `${drinkName} ${drinkVolume} ${drinknotes}`; // Remove the '-' and 'ml'
    if (isNaN(drinkVolume) || drinkVolume === '') {
      Alert.alert('Warning', 'Drink volume must be a number');
      return;
    }
    if (parseInt(drinkVolume) < 0) {
      Alert.alert('Warning', 'Drink volume must be a positive number');
      return;
    }
    const updatedTotalVolume = totalVolume + parseInt(drinkVolume);
    console.log('New Drink:', newDrink); // Log the newDrink value
    console.log('Drink Name:', drinkName); // Log the drink name
    console.log('Drink Volume:', drinkVolume); // Log the drinkVolume value
    console.log('Drink Notes:', drinknotes); // Log the drinknotes value
    setTaskItems([...taskItems, newDrink]);
    setDrinkName('');
    setDrinkVolume('');
    setDrinkNotes('');
    setIsAddMode(false);
    

    
  
        const handleBackButton = () => {
          setIsMenuOpen(false); // Close the menu
        };
      
        // Insert the new drink into the database
        db.transaction(tx => {
          tx.executeSql(
            'INSERT INTO Drink (Content, Volume , Notes) VALUES (?, ? , ?)',
            [drinkName, parseInt(drinkVolume), drinknotes],
            (_, { insertId }) => {
              console.log('Added to database with ID: ', insertId);
              fetchDrinkTracker(); // Fetch updated DrinkTracker after adding
            },
            (_, error) => {
              console.log('2. Error adding to database: ', error);
            }
          );

          tx.executeSql( // Update Goal table with the totalVolume state
            'UPDATE Goal Set TotalVolume = ? ',
            [parseInt(updatedTotalVolume)],
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
            tx.executeSql( // Update Goal table with the totalVolume state
              'UPDATE Goal Set TotalVolume = ? ',
              [parseInt(updatedTotalVolume)],
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
        const filteredSuggestions = drinksData
          .filter(drink => drink.name.toLowerCase().includes(text.toLowerCase()))
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
        const selected = drinksData.find(drink => drink.name === drinkname);
        if (selected) {
          setSelectedDrink(selected);
          setSelectedDrinkInfo({
            sugar: selected.sugar,
            caffeine: selected.caffeine,
            calories: selected.calories
          });
        }
      };
      
      const renderSuggestionItem = ({ drinkname }) => (
        <TouchableOpacity onPress={() => handleSuggestionSelect(drinkname)}>
          <Text style={styles.itemText}>{drinkname}</Text>
        </TouchableOpacity>
      );
      
      const drinksData = [
        { name: "Water", servingSize: "1 ml", calories: 0, sugar: 0, caffeine: 0 },
        { name: "Green Tea", servingSize: "1 ml", calories: 0, sugar: 0, caffeine: "0.025-0.035mg" },
        { name: "Black Tea", servingSize: "1 ml", calories: 0, sugar: 0, caffeine: "0.025-0.048mg" },
        { name: "Coffee (black)", servingSize: "1 ml", calories: 0.002, sugar: 0, caffeine: "0.095mg" },
        { name: "Herbal Tea (such as chamomile)", servingSize: "1 ml", calories: 0, sugar: 0, caffeine: 0 },
        { name: "Matcha Latte", servingSize: "1 ml", calories: 1.3, sugar: 0.15, caffeine: "0.07mg" },
        { name: "Chai Latte", servingSize: "1 ml", calories: 1.5, sugar: 0.25, caffeine: "0.05mg" },
        { name: "Fruit Smoothie (made with yogurt)", servingSize: "1 ml", calories: "0.2-0.3", sugar: "0.03-0.04", caffeine: 0 },
        { name: "Iced Tea (sweetened)", servingSize: "1 ml", calories: 0.9, sugar: 0.22, caffeine: "0.015-0.03mg" },
        { name: "Lemonade", servingSize: "1 ml", calories: 1, sugar: 0.27, caffeine: 0 },
        { name: "Orange Juice", servingSize: "1 ml", calories: 1.1, sugar: 0.22, caffeine: 0 },
        { name: "Cranberry Juice", servingSize: "1 ml", calories: 1.4, sugar: 0.31, caffeine: 0 },
        { name: "Coconut Water", servingSize: "1 ml", calories: 0.45, sugar: 0.06, caffeine: 0 },
        { name: "Apple Cider", servingSize: "1 ml", calories: 1.2, sugar: 0.28, caffeine: 0 },
        { name: "Pomegranate Juice", servingSize: "1 ml", calories: 1.3, sugar: 0.31, caffeine: 0 },
        { name: "Grapefruit Juice", servingSize: "1 ml", calories: 0.96, sugar: 0.22, caffeine: 0 },
        { name: "Tomato Juice", servingSize: "1 ml", calories: 0.41, sugar: 0.1, caffeine: 0 },
        { name: "Carrot Juice", servingSize: "1 ml", calories: 0.94, sugar: 0.22, caffeine: 0 },
        { name: "Pineapple Juice", servingSize: "1 ml", calories: 1.33, sugar: 0.32, caffeine: 0 },
        { name: "Mango Lassi", servingSize: "1 ml", calories: 2, sugar: 0.32, caffeine: 0 },
        { name: "Hot Chocolate", servingSize: "1 ml", calories: 2, sugar: 0.25, caffeine: "0.005-0.02mg" },
        { name: "Milkshake", servingSize: "1 ml", calories: "3-5", sugar: "0.04-0.06", caffeine: 0 },
        { name: "Root Beer Float", servingSize: "1 ml", calories: 3, sugar: 0.4, caffeine: 0 },
        { name: "Shirley Temple", servingSize: "1 ml", calories: 1.5, sugar: 0.3, caffeine: 0 },
        { name: "Arnold Palmer (half lemonade, half iced tea)", servingSize: "1 ml", calories: 1, sugar: 0.25, caffeine: "0.015-0.03mg" },
        { name: "Italian Soda", servingSize: "1 ml", calories: 2, sugar: 0.4, caffeine: 0 },
        { name: "Agua Fresca", servingSize: "1 ml", calories: "0.1-0.15", sugar: "0.025-0.035", caffeine: 0 },
        { name: "Kombucha", servingSize: "1 ml", calories: 0.03, sugar: 0.004, caffeine: "0.015-0.03mg" },
        { name: "Yerba Mate", servingSize: "1 ml", calories: 0.03, sugar: 0, caffeine: "0.85mg" },
        { name: "Horchata", servingSize: "1 ml", calories: 2, sugar: 0.3, caffeine: 0 },
        { name: "Aloe Vera Juice", servingSize: "1 ml", calories: 0.05, sugar: 0.01, caffeine: 0 },
        { name: "Bubble Tea (Tapioca)", servingSize: "1 ml", calories: "0.3-0.4", sugar: "0.04-0.06", caffeine: 0 },
        { name: "Agave Lemonade", servingSize: "1 ml", calories: 1.5, sugar: 0.35, caffeine: 0 },
        { name: "Lavender Lemonade", servingSize: "1 ml", calories: 1.2, sugar: 0.3, caffeine: 0 },
        { name: "Mint Julep", servingSize: "1 ml", calories: 1.5, sugar: 0.3, caffeine: 0 },
        { name: "Watermelon Cooler", servingSize: "1 ml", calories: 1, sugar: 0.25, caffeine: 0 },
        { name: "Virgin Mojito", servingSize: "1 ml", calories: 0.8, sugar: 0.2, caffeine: 0 },
        { name: "Elderflower Cordial", servingSize: "1 ml", calories: 0.8, sugar: 0.2, caffeine: 0 },
        { name: "Peach Iced Tea", servingSize: "1 ml", calories: 0.8, sugar: 0.2, caffeine: "0.015-0.03mg" },
        { name: "Hibiscus Tea", servingSize: "1 ml", calories: 0, sugar: 0, caffeine: 0 },
        { name: "Almond Milk", servingSize: "1 ml", calories: 0.06, sugar: 0, caffeine: 0 },
        { name: "Rice Milk", servingSize: "1 ml", calories: 0.12, sugar: 0.01, caffeine: 0 },
        { name: "Soy Milk", servingSize: "1 ml", calories: 0.08, sugar: 0.006, caffeine: 0 },
        { name: "Oat Milk", servingSize: "1 ml", calories: 0.12, sugar: 0.007, caffeine: 0 },
        { name: "Horchata", servingSize: "1 ml", calories: 2, sugar: 0.3, caffeine: 0 },
        { name: "Aloe Vera Juice", servingSize: "1 ml", calories: 0.05, sugar: 0.01, caffeine: 0 },
        { name: "Coconut Milk", servingSize: "1 ml", calories: 0.045, sugar: 0, caffeine: 0 },
        { name: "Sparkling Water", servingSize: "1 ml", calories: 0, sugar: 0, caffeine: 0 },
        { name: "Ginger Beer", servingSize: "1 ml", calories: 0.12, sugar: 0.03, caffeine: 0 },
        { name: "Club Soda", servingSize: "1 ml", calories: 0, sugar: 0, caffeine: 0 },
        { name: "Coca-Cola", servingSize: "1 ml", calories: 1.166666667, sugar: 0.325, caffeine: "0.034mg" },
        { name: "Pepsi", servingSize: "1 ml", calories: 1.25, sugar: 0.341666667, caffeine: "0.038mg" },
        { name: "Mountain Dew", servingSize: "1 ml", calories: 1.416666667, sugar: 0.383333333, caffeine: "0.054mg" },
        { name: "Sprite", servingSize: "1 ml", calories: 1.166666667, sugar: 0.316666667, caffeine: 0 },
        { name: "Dr Pepper", servingSize: "1 ml", calories: 1.25, sugar: 0.333333333, caffeine: "0.041mg" },
        { name: "Fanta Orange", servingSize: "1 ml", calories: 1.333333333, sugar: 0.366666667, caffeine: 0 },
        { name: "7UP", servingSize: "1 ml", calories: 1.166666667, sugar: 0.316666667, caffeine: 0 },
        { name: "A&W Root Beer", servingSize: "1 ml", calories: 1.333333333, sugar: 0.366666667, caffeine: 0 },
        { name: "Coca-Cola Zero Sugar", servingSize: "1 ml", calories: 0, sugar: 0, caffeine: "0.034mg" },
        { name: "Diet Pepsi", servingSize: "1 ml", calories: 0, sugar: 0, caffeine: "0.038mg" },
        { name: "Pepsi Zero Sugar", servingSize: "1 ml", calories: 0, sugar: 0, caffeine: "0.038mg" },
        { name: "Diet Coke", servingSize: "1 ml", calories: 0, sugar: 0, caffeine: "0.034mg" },
        { name: "Barq's Root Beer", servingSize: "1 ml", calories: 1.333333333, sugar: 0.366666667, caffeine: "0.022mg" },
        { name: "Canada Dry Ginger Ale", servingSize: "1 ml", calories: 1.166666667, sugar: 0.3, caffeine: 0 },
        { name: "Mug Root Beer", servingSize: "1 ml", calories: 1.333333333, sugar: 0.358333333, caffeine: 0 },
        { name: "Sprite Zero Sugar", servingSize: "1 ml", calories: 0, sugar: 0, caffeine: 0 },
        { name: "Dr Pepper Cherry", servingSize: "1 ml", calories: 1.25, sugar: 0.333333333, caffeine: "0.041mg" },
        { name: "Sierra Mist", servingSize: "1 ml", calories: 1.166666667, sugar: 0.316666667, caffeine: 0 },
        { name: "Crush Orange", servingSize: "1 ml", calories: 1.583333333, sugar: 0.425, caffeine: 0 },
        { name: "Squirt", servingSize: "1 ml", calories: 1.333333333, sugar: 0.325, caffeine: "0.038mg" },
        { name: "Coca-Cola Vanilla", servingSize: "1 ml", calories: 1.166666667, sugar: 0.325, caffeine: "0.034mg" },
        { name: "Mountain Dew Code Red", servingSize: "1 ml", calories: 1.416666667, sugar: 0.383333333, caffeine: "0.054mg" },
        { name: "Sunkist Orange", servingSize: "1 ml", calories: 1.583333333, sugar: 0.408333333, caffeine: 0 },
        { name: "Fanta Grape", servingSize: "1 ml", calories: 1.333333333, sugar: 0.366666667, caffeine: 0 },
        { name: "A&W Cream Soda", servingSize: "1 ml", calories: 1.5, sugar: 0.383333333, caffeine: 0 },
        // Add more drinks here
      ];
  // Add more drinks here 
      // Inside your render return
      
      

      return (
          <View style={styles.container}>

                  <View style={styles.DrinkWrapper}>
                    <View style={styles.sectionTitle}>
                      <Text style={styles.sectionTitleTextBig}>Daily Gulp</Text>
                      <TouchableOpacity onPress={() => navigation.navigate("Goals", {
                          totalVolume: totalVolume,
                          totalCalories: totalCalories,
                          totalSugar: totalSugar,
                          totalWaterIntake: totalWaterIntake,
                          TotalCaffeine: TotalCaffeine,
                          waterIntakeGoal: waterIntakeGoal,
                          calorieGoal: calorieGoal,
                          sugarGoal: sugarGoal,
                          caffeineGoal: caffeineGoal,
                        })}>
                        <Text style={styles.sectionTitleTextSmallGoal}>Goals</Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={toggleTotalPopup} style={styles.totalVolumeButton}>
                      <Text style={styles.volumeTitle}>Total Volume: {totalVolume} ml</Text>
                      <Text style={styles.volumeFooter}>Click for more</Text>
                    </TouchableOpacity>
                    <View style={styles.items}>
                      {DrinkTracker.map((item, index) => (
                        <Drink 
                          key={index} 
                          drink={item.Content} 
                          volume={item.Volume}
                          notes={item.Notes} 
                          completeTask={() => completeTask(index)} 
                          index={index} 
                        />
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
                          <Text>Total Volume: {totalVolume}</Text>
                          <Text>Total Calories: {totalCalories}</Text>
                          <Text>Total Sugar: {totalSugar}</Text>
                          <Text>Total Caffeine: {TotalCaffeine}</Text>
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
                          setDrinkName('');
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

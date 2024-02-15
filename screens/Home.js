import React, { useState, useEffect} from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, Modal} from 'react-native';
import Drink from '../components/Drinks.js';
import { StatusBar } from 'expo-status-bar';
import * as SQLite from 'expo-sqlite';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from '../styles.js';
// import { set } from 'react-native-reanimated';

export default function HomeScreen({ navigation }) {

  const [drinkName, setDrinkName] = useState('');
  const [drinkVolume, setDrinkVolume] = useState('');
  const [drinknotes, setDrinkNotes] = useState('');
  const [taskItems, setTaskItems] = useState([]);
  const [isAddMode, setIsAddMode] = useState(false);
  const [DrinkTracker, setDrinkTracker] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [totalVolume, setTotalVolume] = useState(0);
  const db = SQLite.openDatabase('./siplogV2db.db'); //Database constant

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
                Volume      NUMERIC DEFAULT (0),
                Calories    NUMERIC DEFAULT (0),
                Sugar       NUMERIC DEFAULT (0),
                Caffeine    NUMERIC DEFAULT (0),
                DrinkListId INTEGER REFERENCES Tracker (DrinkListId) 
            )`, [],
            () => {
              // Success callback (optional)
              console.log('Goal Table created successfully');
              // Fetch data from the database when component mounts
              fetchDrinkTracker();
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

      //   db.transaction(tx => {
      //     tx.executeSql(
      //         `ALTER TABLE Drink ADD COLUMN Notes TEXT`, [],
      //         () => {
      //             console.log('NewColumn added to Drink table successfully');
      //         },
      //         (_, error) => {
      //             console.error('Error adding NewColumn to Drink table:', error);
      //         }
      //     );
      // });

    });
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle menu visibility
  };

  const fetchDrinkTracker = () => { //Handels error logging if database doesnt open
    db.transaction(tx => {
      tx.executeSql(
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

  const handleAddTask = () => {
    Keyboard.dismiss();
    const newDrink = `${drinkName} ${drinkVolume} ${drinknotes}`; // Remove the '-' and 'ml'
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
    });
  };

  // const handleDelete = (id) => {
  //   db.transaction(tx => {
  //     tx.executeSql(
  //       'DELETE FROM DrinkTracker WHERE id = ?',
  //       [id],
  //       () => {
  //         console.log('Message deleted from database with ID: ', id);
  //         fetchDrinkTracker(); // Fetch updated DrinkTracker after deletion
  //       },
  //       (_, error) => {
  //         console.log('Error deleting from database: ', error);
  //       }
  //     );
  //   });
  // };

  const completeTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    //setTaskItems(itemsCopy);
    setDrinkTracker(itemsCopy);
    setTotalVolume(totalVolume - parseInt(DrinkTracker[index].volume));
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
            console.log('3. Error deleting from database: ', error);
          }
        );
      });
    }
  };

  return (
      <View style={styles.container}>

              <View style={styles.DrinkWrapper}>
                <Text style={styles.sectionTitle}>Daily Gulp</Text>
                <Text style={styles.totalTitle}>Total Volume: {totalVolume} ml</Text>
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
                <TextInput
                style={styles.input}
                placeholder={'Drink Name'}
                value={drinkName}
                onChangeText={(text)=> setDrinkName(text)}/>
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
                <TouchableOpacity onPress={() => handleAddTask()} style={styles.addWrapper}>
                  <Text style={styles.addText}>Add</Text>
                </TouchableOpacity>
                
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

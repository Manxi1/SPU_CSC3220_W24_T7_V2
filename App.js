import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, Modal,Button } from 'react-native';
import Drink from './components/Drinks.js';
import { StatusBar } from 'expo-status-bar';
import * as SQLite from 'expo-sqlite';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function App() {
  const [drinkName, setDrinkName] = useState('');
  const [drinkVolume, setDrinkVolume] = useState('');
  const [taskItems, setTaskItems] = useState([]);
  const [isAddMode, setIsAddMode] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const db = SQLite.openDatabase('siplogdb.db'); //Database constant

  useEffect(() => {
    // Create table if not exists
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Messages (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, volume INTEGER DEFAULT 0)',
        [],
        () => {
          // Success callback (optional)
          console.log('Table created successfully');
          // Fetch data from the database when component mounts
          fetchMessages();
        },
        (_, error) => {
          // Error callback
          console.error('Error creating table:', error);
        }
      );
    });
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle menu visibility
  };

  const fetchMessages = () => { //Handels error logging if database doesnt open
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Messages',
        [],
        (_, { rows }) => {
          const data = rows._array.map(item => ({ id: item.id, content: item.content, volume: item.volume}));
          //setTaskItems(data);
          setMessages(data);
        },
        (_, error) => {
          console.log('Error fetching data from database: ', error);
        }
      );
    });
  };

  const handleAddTask = () => {
    Keyboard.dismiss();
    const newDrink = `${drinkName} ${drinkVolume}`; // Remove the '-' and 'ml'
    console.log('New Drink:', newDrink); // Log the newDrink value
    console.log('Drink Name:', drinkName); // Log the drink name
    console.log('Drink Volume:', drinkVolume); // Log the drinkVolume value
    setTaskItems([...taskItems, newDrink]);
    setDrinkName('');
    setDrinkVolume('');
    setIsAddMode(false);
    

    
  
    const handleBackButton = () => {
      setIsMenuOpen(false); // Close the menu
    };
  
    // Insert the new drink into the database
    const newMessage = newDrink; // Assuming the format is 'Drink Name Volume (ml)'
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO Messages (content, volume) VALUES (?, ?)',
        [newDrink, parseInt(drinkVolume)],
        (_, { insertId }) => {
          console.log('Added to database with ID: ', insertId);
          fetchMessages(); // Fetch updated messages after adding
        },
        (_, error) => {
          console.log('Error adding to database: ', error);
        }
      );
    });
  };

  const handleDelete = (id) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM Messages WHERE id = ?',
        [id],
        () => {
          console.log('Message deleted from database with ID: ', id);
          fetchMessages(); // Fetch updated messages after deletion
        },
        (_, error) => {
          console.log('Error deleting from database: ', error);
        }
      );
    });
  };

  const completeTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    //setTaskItems(itemsCopy);
    setMessages(itemsCopy);
    const messageId = messages[index]?.id;
    if (messageId) {
      db.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM Messages WHERE id = ?',
          [messageId],
          () => {
            console.log('Message deleted from database with ID: ', messageId);
            fetchMessages(); // Fetch updated messages after deletion
          },
          (_, error) => {
            console.log('Error deleting from database: ', error);
          }
        );
      });
    }
  };

      return(
        <View style={styles.container}>

              <View style={styles.DrinkWrapper}>
                <Text style={styles.sectionTitle}> Daily Gulp</Text>
                <View style={styles.items}>
                  {messages.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => completeTask(index)}>
                      <Drink text={`${item.content} ${item.volume}`} />
                      </TouchableOpacity>
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
                  
                  <TouchableOpacity onPress={console.log('clicked')} style={[styles.MenuItemes, { marginBottom: 1 }]}>
                    <Text style={styles.MenuItemestext}>Home</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={console.log('clicked')} style={[styles.MenuItemes, { flex: 2 ,marginBottom:1}]}>
                    <Text style={styles.MenuItemestext}>Settings</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={console.log('clicked')} style={[styles.MenuItemes, { flex: 18, marginTop:2}]}>
                    <Text style={styles.MenuItemestext}>About</Text>
                  </TouchableOpacity>

                  </View>
                </View>
            </View>
            
          </Modal>
          
        </View>
        
      );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop:50,
  },
  changefont:{
    fontFamily: 'Roboto',
    fontSize:30,
    fontWeight:'bold',
  },
  buttonContainer:{
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 76,
  },
  roundButton: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 40,
    backgroundColor: '#ff5722',
  },
  buttonText: {
    color: 'white',
    fontSize: 30,
    
  },
  menuButton: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  
  menuText: {
    fontSize: 30,
    color: '#000',
    
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  DrinkWrapper: {
    paddingTop: 5,
    paddingHorizontal: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  items: {
    marginTop: 30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  addWrapper:{
    width: 70,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 30,
    backgroundColor: '#ff5722',
    marginBottom: 30,
    left: 0,
  },
  addText:{
    color: 'white',
    fontSize: 16,
  },
  modalView:{
    backgroundColor: 'lightgrey',
    padding: 30,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    width: '105%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input:{
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
    borderRadius: 30,
    borderColor: '#C0C0C0',
    borderWidth: 2,
    width: 150,
    marginBottom: 30,

  },
  menuContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  menuContent: {
    backgroundColor: 'lightgrey',
    padding: 30,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 5,
    left: 5,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  MenuItemes: {

     flex: 2,
     right: 10,
     top: 10,
    
   },
   MenuItemestext:{
    fontFamily: 'Roboto',
    fontSize:26,

   }
});
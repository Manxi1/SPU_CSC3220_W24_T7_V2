
import React, { useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Drink = (props) => {
  const [isBarVisible, setBarVisible] = useState(false);

  const handlePress = () => {
    setBarVisible(!isBarVisible);
  };

  const handleClosePress = () => {
    setBarVisible(false);
  };
  
  const handleDeleteItem = (index) => {
    props.completeTask(index);
  };

  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <View style={styles.item}>
          <View style={styles.itemLeft}>
            <TouchableOpacity onPress={() => handleDeleteItem(props.index)}>
              <View style={styles.square}>
                <Icon name="trash-alt" size={24} color="#000000" />
              </View>
            </TouchableOpacity>
            <Text style={styles.itemText}>{props.drink}</Text>
            {!!props.volume && <Text style={styles.itemText}> {props.volume}ml</Text>}
            {/* {!!props.notes && <Text style={styles.itemText}> {props.notes}</Text>} */}
          </View>
          <View style={styles.menu}>
            <TouchableOpacity style={styles.button} onPress={handlePress}>
              <Icon name="ellipsis-h" size={28} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>
        {isBarVisible && (
          <View style={styles.floatingBar}>
            <Text style={styles.inputBar}>Notes:{props.notes}</Text>
            <Text>Calorie:</Text>
            <Text>Sugar:</Text>
            <Text>Caffeine:</Text>
            <TouchableOpacity onPress={handleClosePress}>
              <Text style={styles.closingbutton}>Back</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  itemContainer: {
    position: 'relative',
    
  },
  item: {
    backgroundColor: 'lightgrey',
    padding: 15,
    borderRadius: 11,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  square: {
    width: 32,
    height: 32,
    backgroundColor: '#ADD8E6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9,
    paddingRight: 1,
    marginRight: 10,
  },
  itemText: {
    maxWidth: '80%',
    paddingRight: 50,
    fontSize: 15,
  },
  menu: {
    paddingRight: 1,
    marginTop: 5,
  },
  button: {
    padding: 0,
    Right: 10,
  },
  floatingBar: {
    position: 'absolute',
    bottom: -39,
    right: 0,
    width: 300,
    height: 160,
    backgroundColor: '#adbaaf',
    justifyContent: 'center',
    borderRadius: 10,
    borderColor: 'black',
    zIndex: 1000,
  },
  closingbutton: {
    fontSize: 20,
    top: 15,
    padding: 1,
  },
  inputBar: {
    fontSize: 16,
    padding: 5,
    bottom: 15,
  },
});

export default Drink;
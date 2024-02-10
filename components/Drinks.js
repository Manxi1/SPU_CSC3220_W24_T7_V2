import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Drink = (props) => {

  const handleDeleteItem = (index) => {
    props.completeTask(index); // Call the handleDelete function with the appropriate ID
  };

  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <TouchableOpacity onPress={() => handleDeleteItem(props.index)}>
          <View style={styles.square}>
            <Icon name="trash-alt" size={24} color="#000000" />
          </View>
        </TouchableOpacity>
        <Text style={styles.itemText}>{props.drink}</Text>
        {!!props.volume && <Text style={styles.itemText}> {props.volume}ml</Text>}
      </View>
      <View style={styles.menu}>
        <TouchableOpacity onPress={() => console.log('Menu clicked')}>
          <Icon name="ellipsis-h" size={24} color="#000000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'lightgrey',
    padding: 15,
    borderRadius: 11,
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '70',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  square: {
    width: 32, // Or whatever size you want
    height: 32, // Or whatever size you want
    backgroundColor: '#ADD8E6', // Or whatever color you want
    justifyContent: 'center', // Centers children vertically
    alignItems: 'center',
    borderRadius: 9,
    paddingRight: 1,
    marginRight: 10,
  },
  itemText: {
    maxWidth: '80%',
    paddingRight: 50,
  },
  menu: {
    paddingRight: 1,
    marginTop: 5,
  },
});

export default Drink;

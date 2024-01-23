import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Drink = (props) => {
  let textToSplit = props.text || '';
  if (typeof textToSplit !== 'string') {
    textToSplit = String(textToSplit); // Convert to string if not already a string
  }

  console.log('-----------');
  console.log('props.text:', props.text);
  console.log('textToSplit:', textToSplit);

  //let [drink, volume] = textToSplit.split(' ');
  let [drink, volume] = textToSplit.split(/(?<=.*)\s(?=\d+$)/);


  console.log('drink:', drink);
  console.log('volume:', volume);

  if (!volume) {
    drink = textToSplit;
    volume = '';
  }

  const handleDeleteItem = () => {
    props.handleDelete(props.id); // Call the handleDelete function with the appropriate ID
  };

  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <TouchableOpacity onPress={handleDeleteItem}>
          <View style={styles.square}>
            <Icon name="trash-alt" size={24} color="#000000" />
          </View>
        </TouchableOpacity>
        <Text style={styles.itemText}>{drink}</Text>
        {!!volume && <Text style={styles.itemText}> {volume}ml</Text>}
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
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '80%',
    left: 45,
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
  },
  itemText: {
    maxWidth: '80%',
    paddingRight: 50,
  },
  menu: {
    paddingRight: 1,
  },
});

export default Drink;

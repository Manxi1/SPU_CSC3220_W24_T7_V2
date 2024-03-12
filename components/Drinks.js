import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import drinkStyles from './drinkStyles.js';

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
    <View style={drinkStyles.container}>
      <View style={drinkStyles.itemContainer}>
        <View style={drinkStyles.item}>
          <View style={drinkStyles.itemLeft}>
            <TouchableOpacity onPress={() => handleDeleteItem(props.index)}>
              <View style={drinkStyles.square}>
                <Icon name="trash-alt" size={24} color="#000000" />
              </View>
            </TouchableOpacity>
            <Text style={drinkStyles.itemText}>{props.drink}</Text>
            {!!props.volume && <Text style={drinkStyles.itemText}> {props.volume} (ml)</Text>}
          </View>
          <View style={drinkStyles.menu}>
            <TouchableOpacity style={drinkStyles.button} onPress={handlePress}>
              <Icon name="ellipsis-h" size={28} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>
        {isBarVisible && (
          <View style={drinkStyles.floatingBarBlack}>
            <View style={drinkStyles.floatingBar}>
              <Text style={drinkStyles.inputBar}>Notes: {props.notes ? props.notes : 'No notes  provided'}</Text>
              <Text>Calories: {props.calories || 0} (kcals)</Text>
              <Text>Sugar: {props.sugar || 0} (g)</Text>
              <Text>Caffeine: {props.caffeine || 0} (mg)</Text>
              <TouchableOpacity onPress={handleClosePress} style={drinkStyles.floatingBarBackButton}>
                <Text style={drinkStyles.closingbuttonText}>Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default Drink;

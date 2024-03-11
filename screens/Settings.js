import React, { useState } from "react";
import { Button, View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from "react-native";
import SwipeGesture from 'react-native-swipe-gestures';
import drinksData from "./Drinksdata";

export default function SettingsScreen({ navigation }) {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = drinksData[0].filter(item => item.name.toLowerCase().includes(text.toLowerCase()));
    setFilteredData(filtered);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.Title}>Drink List</Text>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
        <Text style={styles.goBackText}>Go Back</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        value={searchText}
        onChangeText={handleSearch}
      />

      <FlatList
        style={styles.flatList}
        data={filteredData.length > 0 ? filteredData : drinksData[0]}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <Text style={styles.text}>{item.name}</Text>
        )}
  
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  goBackButton: {
    marginTop: 50,
    position: 'absolute',
    padding: 10,
    backgroundColor: '#BF40BF',
    flexDirection: 'row',
    bottom: 800,
    width: 80,
    borderRadius: 20,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    left: 1,
 },
 goBackText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  searchInput: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    bottom:-70,
    width: 370,
    left: 10,
    height: 50,
    borderRadius: 30,
    
  },
  flatList: {
    flex: 1,
    marginTop: 10,
    bottom: -60,
    left: 10,
  },
  Title:{
    fontFamily: 'Roboto',
    fontSize:30,
    fontWeight:'bold',
    bottom: -50,
    textDecorationLine: 'underline',
    alignSelf: 'center',
  }
});

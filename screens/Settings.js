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
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
        <Text>Go Back</Text>
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
    position: 'absolute',
    top: 40,
    left: 10,
  },
  searchInput: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    bottom:-75
  },
  flatList: {
    flex: 1,
    marginTop: 10,
    bottom: -60
  },
});

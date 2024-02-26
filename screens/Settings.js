import React, { Component,useState } from "react";
import {  View, TextInput, TouchableOpacity, Text} from "react-native";
export default function SettingsScreen({ navigation }) {

  const MyComponent = () => {
    
  }  
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={handleSearch}
        value={searchQuery}
        placeholder="Search..."
      />
      <DropDownPicker
        open={dropdownOpen}
        value={selectedItem}
        items={items}
        setOpen={setDropdownOpen}
        setValue={setSelectedItem}
        setItems={setItems}
        placeholder="Select an item"
        zIndex={9999} // Set a high zIndex to display above other components
        style={{ zIndex: 9999 }} // Adjust style as needed
        onChangeValue={(value) => handleSelectItem(value)}
      />
    </View>
      <Text>This is where the Setting Screen will go</Text>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

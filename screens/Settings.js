import React, { useState, Component } from "react";
import { Button, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import SwipeGesture from 'react-native-swipe-gestures';
export default function SettingsScreen({ navigation }) {

  return (
    <View style={styles.container}>
      <Text>This is where the Setting Screen will go</Text>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>Go Back</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
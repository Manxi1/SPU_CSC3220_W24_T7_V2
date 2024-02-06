import React, { Component } from "react";
import { Button, View, Text, TouchableOpacity } from "react-native";
export default function AboutScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>This is where the About Screen will go</Text>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}
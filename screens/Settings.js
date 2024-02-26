import React, { useState } from 'react';
import { View, Text, StyleSheet, PanResponder } from 'react-native';
import SwipeGesture from 'react-native-swipe-gestures';

export default function SettingsScreen({ navigation }) {
  const [swipeDirection, setSwipeDirection] = useState('');

  const onSwipeUp = () => {
    setSwipeDirection('up');
  };

  const onSwipeDown = () => {
    setSwipeDirection('down');
  };

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  return (
    <View style={styles.bigContainer}>
    <SwipeGesture
      onSwipeUp={onSwipeUp}
      onSwipeDown={onSwipeDown}
      config={config}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Text style={styles.text}>{swipeDirection}</Text>
      </View>
    </SwipeGesture>
    </View>
  );
};

const styles = StyleSheet.create({
  bigContainer: {
    marginBottom: 20,
  },
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

// import React, { useState, Component } from "react";
// import { Button, View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import SwipeGesture from 'react-native-swipe-gestures';
// export default function SettingsScreen({ navigation }) {

//   const [swipeDirection, setSwipeDirection] = useState('');

//   const onSwipeUp = () => {
//     setSwipeDirection('up');
//   };

//   const onSwipeDown = () => {
//     setSwipeDirection('down');
//   };

//   const config = {
//     velocityThreshold: 0.3,
//     directionalOffsetThreshold: 80,
//   };

//   return (
//     <View style={{padding: 100, alignItems: "center", justifyContent: "center" }}>
//       <Text>This is where the Setting Screen will go</Text>
//       <TouchableOpacity onPress={() => navigation.goBack()}>
//         <Text>Go Back</Text>
//       </TouchableOpacity>

//       <SwipeGesture
//             onSwipeUp={onSwipeUp}
//             onSwipeDown={onSwipeDown}
//             config={config}
//             style={{ flex: 1, padding: 100, boarderColor: 'black', backgroundColor: 'lightgrey'}}
//           >
//             <View>
//               <Text>Hello: {swipeDirection}</Text>
//             </View>
//           </SwipeGesture>

//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   text: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
// });
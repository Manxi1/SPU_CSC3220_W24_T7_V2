import React, { useState } from 'react';
import { View, Text, Linking, TouchableOpacity, StyleSheet, ScrollView,Image,} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import url1 from './img1.jpeg'; // Import local image
import url2 from './IMG_7483.jpeg'; // Import local image
import url3 from './IMG_0007.jpeg'; // Import local image



const people = [
  { name: 'Manxi .M', age: 20, major: 'Computer Science BS',
   image: url1 , social: 'https://github.com/Manxi1', social1:'https://www.linkedin.com/in/manxi-g/',
   Bio: 'I am a Computer Science major at Seattle Pacific Universtity . I am a sophomore and I am graduating in May 2026. I am a software developer/ software designer and I am internship in the tech industry.'},
  { name: 'Weston .H', age: 20, major: 'Computer Science BS', 
  image: url2, social: 'https://github.com/WestonHanson',social1:'https://www.linkedin.com/in/westonhanson/', 
  Bio: 'I am a Software Engineering major at the University of Texas at Dallas. I am a junior and I am graduating in May 2023. I am a software developer and I am looking for an internship in the tech industry.'},
  { name: 'Caed .O', age: 20, major: 'Information Systems', image: url3,
   social: 'https://github.com/caedosbornnienhuis', social1:'https://www.linkedin.com/in/caed-osborn-nienhuis-a1a95b256/',
   Bio: 'I am a Computer Science major at Seattle Pacific University. I am a Sophomore and will graduate in June 2026. I currently work in IT, and am looking for internships in the tech industry.'},
];

export default function AboutPage({ navigation }) {
  const [isExpanded, setIsExpanded] = useState(new Array(people.length).fill(false));

  const toggleExpanded = index => {
    const newIsExpanded = [...isExpanded]; // Create a new array and copy elements
    newIsExpanded[index] = !newIsExpanded[index];
    setIsExpanded(newIsExpanded);
  };

  return (
    
    <View style={styles.container}>
      <Text style={styles.Title}>Developers</Text>
      {people.map((person, index) => (
        <View key={index} style={styles.person}>
          <View style={styles.imageContainer}>
          <Image source={person.image} style={styles.image} />
          </View>
          <Text style={styles.text}>Name: {person.name}</Text>
          <Text style={styles.text}>Age: {person.age}</Text>
          <Text style={styles.text}>Major: {person.major}</Text>
          <Text style={styles.textBio}>
            {isExpanded[index] ? person.Bio : `${person.Bio.substring(0, 100)}...`}
          </Text>
          <TouchableOpacity onPress={() => toggleExpanded(index)}>
            <Text style={styles.readMore}>
              {isExpanded[index] ? 'Read Less' : 'Read More'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={() => Linking.openURL(person.social)}>
            <Icon style={styles.socialIcon} name="github" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={() => Linking.openURL(person.social1)}>
            <Icon style={styles.socialIcon1} name="linkedin" size={30} color="white"  />
          </TouchableOpacity>
        </View>
      ))}
      
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
        <Text style={styles.goBackText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF9F6',
  },
  person: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 10,
    width: 370,
    height: 220,
    bottom: -70,
    backgroundColor: '#FAF9F6',
  
  },
  text: {
    fontSize: 15,
    left: 110,
    top: -90,
  },
  textBio: {
    top: -60,

  },
  imageContainer: {},
  image: {
    backgroundColor: 'lightgrey', 
    width: 100,
    height: 100,
    borderRadius: 60,
    right:1
  },
  readMore: {
    color: 'blue',
    textDecorationLine: 'underline',
    top: -50,
  },
  goBackButton: {
    marginTop: 40,
    padding: 10,
    backgroundColor: '#4682B4',
    flexDirection: 'row',
    bottom: 750,
    width: 80,
    borderRadius: 20,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    left: -170,
 },
 goBackText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  socialButton: {
    left: 320,
    color: 'FFFFFF',
    bottom:75,
  },
  socialIcon1: {
    //left: 320,
    //color: 'FFFFFF',
    //bottom:50,
    backgroundColor: '#0A66C2',
    width: 30,
    left: -35,
    top: -30,
  },
  socialButton1:{
    left: 320,
    color: 'FFFFFF',
    bottom:60,
  },
  Title:{
    fontFamily: 'Roboto',
    fontSize:30,
    fontWeight:'bold',
    bottom: -50,
    textDecorationLine: 'underline',
  },
});


import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: { // Wraps whole app
      flex: 1,
      backgroundColor: '#fff', // White background
      alignItems: 'center', // Center items horizontally
      justifyContent: 'space-between', // Evenly space items vertically
      paddingTop: 50, // Add padding to the top of the app
    },
    changefont:{ //Sets font of app
      fontFamily: 'Roboto',
      fontSize:30,
      fontWeight:'bold',
    },
    buttonContainer:{ //Wraps the + button
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 76, // Adjust this value to move the button up or down on the page
    },
    roundButton: { // + button
      width: 70,
      height: 70,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      borderRadius: 40,
      backgroundColor: '#ff5722',
    },
    buttonText: { // + button text
      color: 'white',
      fontSize: 30, 
    },
    menuButton: { // Menu button
      position: 'absolute',
      top: 50, // Adjust this value to move the button up or down on the page
      left: 20, // Adjust this value to move the button left or right on the page
    },
    menuText: { // Text for the menu button
      fontSize: 30,
      color: '#000',
    },
    sectionTitle: { // Title of the app
      fontSize: 24,
      fontWeight: 'bold',
    },
    totalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 10,
    },
    DrinkWrapper: { // Wraps the drinks
      paddingTop: 5, // Add padding to the top of the app
      paddingHorizontal: 20, // Add padding to the left and right of the app
      width: '100%', // Make the wrapper take up the full width of the screen
      justifyContent: 'center',
      alignItems: 'center',
    },
    items: { // Wraps the drinks
      marginTop: 30, // Add margin to the top of the drinks
    },
    modalContainer: { // Wraps the drinks
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0.5,0.5)',
    },
    addWrapper:{ // Adding drinks section
      width: 70,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 5,
      borderRadius: 30,
      backgroundColor: '#ff5722',
      marginBottom: 30,
      left: 0,
    },
    addText:{
      color: 'white',
      fontSize: 16,
    },
    modalView:{
      backgroundColor: 'lightgrey',
      padding: 20,
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
      width: '105%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    input:{
      paddingVertical: 15,
      paddingHorizontal: 10,
      backgroundColor: '#FFF',
      borderRadius: 30,
      borderColor: '#C0C0C0',
      borderWidth: 1,
      width: 180,
      left: 4,
      marginBottom: 30,
  
    },
    menuContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    menuContent: {
      backgroundColor: 'lightgrey',
      padding: 30,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      width: '50%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    backButton: {
      position: 'absolute',
      top: 5,
      left: 5,
      padding: 10,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    MenuItemes: {
  
       flex: 2,
       right: 10,
       top: 10,
      
    },
     MenuItemestext:{
      fontFamily: 'Roboto',
      fontSize:26,
  
     },
     inputMessage: {
      paddingVertical: 15,
      paddingHorizontal: 10,
      backgroundColor: '#FFF',
      borderRadius: 30,
      borderColor: '#C0C0C0',
      borderWidth: 2,
      width: 300,
      marginBottom: 1,
    },

    })
export default styles;
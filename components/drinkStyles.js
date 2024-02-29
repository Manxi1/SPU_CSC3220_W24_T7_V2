import { StyleSheet } from "react-native";

const drinkStyles = StyleSheet.create({
    container: {
      marginBottom: 20,
    },
    itemContainer: {
      position: 'relative',
      
    },
    item: {
      backgroundColor: 'lightgrey',
      padding: 15,
      borderRadius: 11,
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '80',
    },
    itemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    square: {
      width: 32,
      height: 32,
      backgroundColor: '#ADD8E6',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 9,
      paddingRight: 1,
      marginRight: 10,
    },
    itemText: {
      maxWidth: '80%',
      paddingRight: 50,
      fontSize: 15,
    },
    menu: {
      paddingRight: 1,
      marginTop: 5,
    },
    button: {
      padding: 0,
      Right: 10,
    },
    floatingBar: {
      position: 'absolute',
      bottom: -39,
      right: 0,
      width: 300,
      height: '300%',
      flexGrow: 1,
      backgroundColor: '#adbaaf',
      justifyContent: 'center',
      borderRadius: 10,
      borderColor: 'black',
      zIndex: 1000,
      padding: 11,
    },
    closingbuttonText: {
      fontSize: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputBar: {
      fontSize: 16,
      padding: 5,
      bottom: 15,
    },
    floatingBarBackButton:{ // Adding drinks section
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        height: 50,
        borderRadius: 30,
        backgroundColor: '#ff5722',
        marginTop: 10,
        marginBottom: 10,
        bottom: -18,
      },
  });

  export default drinkStyles;
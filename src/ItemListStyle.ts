import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    item: {
      backgroundColor: 'azure',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    itemHighlight: {
      backgroundColor: 'lightsalmon',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    itemButton: {
      borderRadius: 10,
      padding: 10,
      paddingLeft: 30,
      paddingRight: 30,
      elevation: 2,
      marginBottom: 10,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    openButton: {
      backgroundColor: '#2196F3',
      borderRadius: 20,
      padding: 20,
      elevation: 2,
      marginBottom: 10,
    },
  
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalTitle: {
      fontWeight: 'bold',
      fontSize: 18,
      marginBottom: 10,
      textAlign: 'center',
    },
    modalButton: {
      borderRadius: 10,
      padding: 10,
      paddingLeft: 30,
      paddingRight: 30,
      elevation: 2,
      marginBottom: 10,
    },
    modalText: {
      marginBottom: 10,
      textAlign: 'center',
    },
    modalInput: {
      height: 40,
      width: 300,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
    },
    spinner: {
      marginBottom: 30,
      color: 'silver',
    },
    highlight: {
      fontWeight: '700',
    },
    highlightRed: {
      color: 'red',
      fontWeight: '700',
    },
  });

export default styles
  
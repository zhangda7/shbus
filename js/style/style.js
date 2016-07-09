import {
  StyleSheet,
  Image
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scollContainer: {
    flex: 1
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  thumb: {
        width:80,
        height: 80,
        marginRight: 10
    },
    textContainer: {
        flex: 1
    },
    cardTextHeader:{
        flex: 8
    },
    separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
    price: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#48BBEC'
    },
    title: {
        fontSize: 20,
        color: '#656565'
    },
    rowContainer: {
        flexDirection: 'column',
        padding: 10
    },
    buscard: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'column',
        margin: 10,
        height:170,
    },
    busstopText: {
        width:30,
        fontSize: 15,
        textAlign: 'center',
        margin: 5,
        textAlignVertical:'top',
        flex: 8
    },
    image: {
        flex: 1,
        width:20,
        height:5,
    },

  blank: {
    width: 2,
  }
});

export {styles};
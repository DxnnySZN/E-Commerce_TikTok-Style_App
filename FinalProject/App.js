import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import axios from 'axios'; // allows HTTP requests from both Node.js environments and web browsers, 
// providing an easy-to-use API for making asynchronous HTTP requests to REST endpoints and interacting with web servers
import { AntDesign, Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons } from '@expo/vector-icons';
import colors from './app/config/colors';

export default function App() {
  useEffect(() => {
    // set up the request parameters
    const params = {
      api_key: "CB3A096052B1462597B6C604A593340F",
      search_term: "electronics",
      type: "search",
    }

    // make the http GET request to BlueCart API
    axios.get('https://api.bluecartapi.com/request', { params })
      .then(response => {
        // print the JSON response from BlueCart API
        console.log(JSON.stringify(response.data, null, 2));
      })
      .catch(error => {
        // catch and print the error
        console.log(error);
      });
  }, []); // empty dependency array ensures useEffect runs only once on component mount

  return (
    <View style={styles.container}>
      <View style={styles.searchButton}>
        <AntDesign name="search1" size={35} color="black"
         onPress={() => console.log("button pressed")} />
      </View>

      <View style={styles.taskbarContainer}>
        <View style={styles.homeButton}>
          <Octicons name="home" size={40} color="black"
           onPress={() => console.log("button pressed")} />
        </View>
        <View style={styles.discoverButton}>
          <Ionicons name="compass-outline" size={50} color="black"
           onPress={() => console.log("button pressed")} />
        </View>
        <View style={styles.cartButton}>
          <MaterialCommunityIcons name="cart-outline" size={43} color="black"
           onPress={() => console.log("button pressed")} />
        </View>
        <View style={styles.profileButton}>
          <Octicons name="person" size={43} color="black"
           onPress={() => console.log("button pressed")} />
        </View>
      </View>

      <View style={styles.productListingContainer}>
        <View style={styles.productImg} />
        <View style={styles.productTitle} />
        <View style={styles.productPrice} />
        <View style={styles.productDesc} />
        <View style={styles.productButtonsContainer}>
        <View style={[styles.productAcceptButton, styles.buttonElevation]}>
            <MaterialIcons name="add-shopping-cart" size={45} color="green"
             onPress={() => console.log("button pressed")} />
          </View>
          <View style={[styles.productDeclineButton, styles.buttonElevation]}>
            <Ionicons name="trash-outline" size={45} color="red"
             onPress={() => console.log("button pressed")} />
          </View>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
  searchButton: {
    alignItems: "flex-end",
    marginRight: 25,
    marginTop: 60,
  },
  taskbarContainer: {
    flexDirection: "row",
    backgroundColor: colors.taskbarContainerColor,
    alignItems: "center",
    justifyContent: "space-between", // ensure equal spacing between buttons
    height: 90,
    width: "100%",
    // position & bottom allow the taskbarContainer to be aligned at the bottom
    position: "absolute",
    bottom: 0,
    paddingHorizontal: 20, // add padding to distribute space
  },
  productListingContainer: {
    flexDirection: "column",
    height: "75%",
    width: "90%",
    // "auto" ensures the margins from left and right will be equally spaced
    marginLeft: "auto", 
    marginRight: "auto", 
    marginTop: 10,
    backgroundColor: colors.productListingContainerColor,
  },
  productImg: {
    flex: 1,
  },
  productTitle: {
    flex: 1,
  },
  productPrice: {
    flex: 1,
  },
  productDesc: {
    flex: 1,
  },
  productButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
  },
  productAcceptButton: {
    alignItems: "center",
  },
  productDeclineButton: {
    alignItems: "center",
  },
  buttonElevation: {
    elevation: 3, // elevation for android shadow
    shadowColor: 'black', // shadow color
    shadowOpacity: 0.3, // shadow opacity
    shadowOffset: { width: 0, height: 2 }, // shadow offset
    shadowRadius: 4, // shadow radius
    marginVertical: 25, // adjusts vertical spacing
  },
});
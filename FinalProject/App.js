import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import axios from 'axios'; // allows HTTP requests from both Node.js environments and web browsers, 
// providing an easy-to-use API for making asynchronous HTTP requests to REST endpoints and interacting with web servers
import { AntDesign, Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { ActivityIndicator } from 'react-native';
import colors from './app/config/colors';

export default function App() {
  // hold product data
  const [productImg, setProductImg] = useState(null);
  const [productTitle, setProductTitle] = useState(null);
  const [productPrice, setProductPrice] = useState(null);

  useEffect(() => {
    // set up the request parameters
    const params = {
      api_key: "CB3A096052B1462597B6C604A593340F",
      search_term: "electronics",
      type: "search",
    }

    // make the http GET request to BlueCart API
    axios.get("https://api.bluecartapi.com/request?api_key=CB3A096052B1462597B6C604A593340F&search_term=electronics&type=search")
      .then(response => {
        // search_results array contains all walmart electronics items
        setProductImg(JSON.stringify(response.data.search_results[0].product.main_image));
        setProductTitle(JSON.stringify(response.data.search_results[0].product.title)); 
        setProductPrice("$" + JSON.stringify(response.data.search_results[0].product.offers.primary.price));
      })
      .catch(error => {
        console.log("Error status:", error.response.status);
        console.log("Error data:", error.response.data);
        console.log("Error message:", error.message);
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

      {/* check if product data is available and is an array */}
      {productData && Array.isArray(productData) ? (
        <View style={styles.productListingContainer}>
          {productData.map((product, index) => (
            <View key={index} style={styles.productItem}>
              <Image source={{productImg}} style={styles.productImg} />
              <Text style={styles.productTitle}>{productTitle}</Text>
              <Text style={styles.productPrice}>{productPrice}</Text>
              <View style={styles.productButtonsContainer}>
                <View style={[styles.productAcceptButton, styles.buttonElevation]}>
                  <MaterialIcons name="add-shopping-cart" size={45} color="green" onPress={() => console.log("button pressed")} />
                </View>
                <View style={[styles.productDeclineButton, styles.buttonElevation]}>
                  <Ionicons name="trash-outline" size={45} color="red" onPress={() => console.log("button pressed")} />
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <ActivityIndicator size="large" color={colors.taskbarContainerColor} /> // show loading indicator if product data is not available
      )}
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
    width: "40%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
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
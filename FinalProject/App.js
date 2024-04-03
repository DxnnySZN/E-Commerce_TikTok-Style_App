import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import axios from 'axios'; // allows HTTP requests from both Node.js environments and web browsers, 
// providing an easy-to-use API for making asynchronous HTTP requests to REST endpoints and interacting with web servers
import { AntDesign, Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { ActivityIndicator } from 'react-native';
import colors from './app/config/colors';
import * as Font from "expo-font";
import { useCallback } from 'react';

const getFonts = () => Font.loadAsync({
  "lexend-regular": require("C:/ReactNative/E-Commerce_TikTok-Style_App/FinalProject/app/assets/fonts/Lexend-Regular.ttf"),
  // "C:\Users\yoon1521\Documents\GitHub\E-Commerce_TikTok-Style_App\FinalProject\app\assets\fonts\Lexend-Regular.ttf"
  "lexend-semiBold": require("C:/ReactNative/E-Commerce_TikTok-Style_App/FinalProject/app/assets/fonts/Lexend-SemiBold.ttf")
  // "C:\Users\yoon1521\Documents\GitHub\E-Commerce_TikTok-Style_App\FinalProject\app\assets\fonts\Lexend-SemiBold.ttf"
});

export default function App() {
  // state variable to track whether custom fonts have been loaded
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // hold product data
  const [productImg, setProductImg] = useState(null);
  const [productTitle, setProductTitle] = useState(null);
  const [productPrice, setProductPrice] = useState(null);

  const fetchNewProduct = useCallback(() => { // useCallback prevents fetching of new products during each render
    // fetch product data only when fonts are loaded
    if(fontsLoaded){
      // DO NOT CLICK THIS LINK UNLESS YOU WANT TO WASTE CREDITS ($)
      axios.get("https://api.bluecartapi.com/request?api_key=3A09B5D146A84189AE44C3A628164CF1&search_term=electronics&type=search")
      .then(response => {
        // get random index within range of search_results array
        const randomIndex = Math.floor(Math.random() * response.data.search_results.length);

        // search_results array contains all walmart electronics items
        setProductImg(response.data.search_results[randomIndex].product.main_image);
        setProductTitle(response.data.search_results[randomIndex].product.title);
        setProductPrice("$" + response.data.search_results[randomIndex].offers.primary.price);
      })
      .catch(error => {
        console.log("Error status:", error.response.status);
        console.log("Error data:", error.response.data);
        console.log("Error message:", error.message);
      });
    }
  }, [fontsLoaded]); 

  useEffect(() => {
    async function loadFonts() {
      await getFonts();
      setFontsLoaded(true);
    }
    loadFonts(); fetchNewProduct();
  }, [fetchNewProduct]); 

  const handleAcceptProduct = () => {
    fetchNewProduct();
  };

  const handleDeclineProduct = () => {
    fetchNewProduct();
  };

  return (
    <View style = {styles.container}>
      <View style = {styles.searchButton}>
        <AntDesign name = "search1" size = {35} color = "black"
         onPress = {() => console.log("button pressed")}/>
      </View>

      <View style = {styles.taskbarContainer}>
        <View style = {styles.homeButton}>
          <Octicons name = "home" size = {40} color = "black"
           onPress = {() => console.log("button pressed")}/>
        </View>
        <View style = {styles.discoverButton}>
          <Ionicons name = "compass-outline" size = {50} color = "black"
           onPress = {() => console.log("button pressed")}/>
        </View>
        <View style = {styles.cartButton}>
          <MaterialCommunityIcons name = "cart-outline" size = {43} color = "black"
           onPress = {() => console.log("button pressed")}/>
        </View>
        <View style = {styles.profileButton}>
          <Octicons name = "person" size = {43} color = "black"
           onPress = {() => console.log("button pressed")}/>
        </View>
      </View>

    <View style = {styles.productListingContainer}>
      {!fontsLoaded && (
        <View style = {{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          {/* ActivityIndicator component used to indicate loading state */}
          <ActivityIndicator size = "large" color = {colors.taskbarContainerColor}/> 
        </View>
      )}
      {productImg && productTitle && productPrice && (
        <View style = {styles.productItem}>
          <Image source = {{ uri: productImg }} style = {styles.productImg}/>
          <Text style = {styles.productTitle}>{productTitle}</Text>
          <Text style = {styles.productPrice}>{productPrice}</Text>
          <View style = {styles.productButtonsContainer}>
            <View style = {[styles.productAcceptButton, styles.buttonElevation]}>
              <MaterialIcons name = "add-shopping-cart" size = {45} color = "green" onPress = {handleAcceptProduct}/>
            </View>
            <View style = {[styles.productDeclineButton, styles.buttonElevation]}>
              <Ionicons name = "trash-outline" size = {45} color = "red" onPress = {handleDeclineProduct}/>
            </View>
          </View>
        </View>
      )}
    </View>
      <StatusBar style = "auto"/>
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
  productItem: {
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 10, 
    paddingHorizontal: 20, 
  },
  productImg: {
    marginTop: 30,
    width: "85%",
    height: 300,
    resizeMode: "cover",
    borderRadius: 10,
  },
  productTitle: {
    marginTop: 30, 
    fontSize: 15, 
    fontFamily: "lexend-semiBold",
    textAlign: "center",
    color: colors.taskbarContainerColor, 
  },
  productPrice: {
    marginTop: 20, 
    fontSize: 45, 
    fontFamily: "lexend-regular",
    textAlign: "center",
    color: colors.taskbarContainerColor,
  },
  productButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 5,
  },
  productAcceptButton: {
    paddingHorizontal: 55,
  },
  productDeclineButton: {
    paddingHorizontal: 55,
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
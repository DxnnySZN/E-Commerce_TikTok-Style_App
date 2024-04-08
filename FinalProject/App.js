import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Image, ActivityIndicator, ScrollView, TouchableOpacity} from 'react-native';
import axios from 'axios'; // allows HTTP requests from both Node.js environments and web browsers, 
// providing an easy-to-use API for making asynchronous HTTP requests to REST endpoints and interacting with web servers
import { AntDesign, Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons, Feather } from '@expo/vector-icons';
import colors from './app/config/colors';
import * as Font from 'expo-font';
import { Swipeable, GestureHandlerRootView} from 'react-native-gesture-handler';

const getFonts = () => Font.loadAsync({
  "lexend-regular": require("C:/ReactNative/E-Commerce_TikTok-Style_App/FinalProject/app/assets/fonts/Lexend-Regular.ttf"),
  // "./app/assets/fonts/Lexend-Regular.ttf"
  "lexend-semibold": require("C:/ReactNative/E-Commerce_TikTok-Style_App/FinalProject/app/assets/fonts/Lexend-SemiBold.ttf")
  // "./app/assets/fonts/Lexend-SemiBold.ttf"
});

export default function App() {
  // state variable to track whether custom fonts have been loaded
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // hold product data
  const [productImg, setProductImg] = useState(null);
  const [productTitle, setProductTitle] = useState(null);
  const [productPrice, setProductPrice] = useState(null);

  // state variable to track whether the search button has been pressed 
  const [searchPressed, setSearchPressed] = useState(false);
  // state variable to hold the text entered in the search input
  const [searchText, setSearchText] = useState("");
  // state variable for search results
  const [searchResults, setSearchResults] = useState([]);

  const fetchNewProduct = useCallback(() => { // useCallback prevents fetching of new products during each render
    // fetch product data only when fonts are loaded and the search button hasn't been pressed
    if(fontsLoaded && !searchPressed){
      // DO NOT CLICK THIS LINK UNLESS YOU WANT TO WASTE CREDITS ($)
      axios.get("https://api.bluecartapi.com/request?api_key=B30548478ACD45A6A0D3C31F707CE5A8&search_term=electronics&type=search")
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
  }, [fontsLoaded, searchPressed]); 

  const fetchSearchResults = useCallback((searchText) => { 
    // check if searchText is not empty before making the API call
    if(searchText.trim() !== ""){
      axios.get(`https://api.bluecartapi.com/request?api_key=B30548478ACD45A6A0D3C31F707CE5A8&search_term=${searchText}&type=search`) // use `` to allow string interpolation with ${}
      .then(response => {
        setSearchResults(response.data.search_results);
      })
      .catch(error => {
        console.error("Error fetching search results:", error);
      });
    } else {
      // clear search results if no results are found
      setSearchResults([]);
    }
  },[]);

  useEffect(() => {
    async function loadFonts() {
      await getFonts();
      setFontsLoaded(true);
    }
    loadFonts(); 
    fetchNewProduct();
  }, [fetchNewProduct]); 

  const handleAcceptProduct = () => {
    fetchNewProduct();
  };

  const handleDeclineProduct = () => {
    fetchNewProduct();
  };

  const handleSearchProduct = (itemId) => {
    // filter out item with corresponding itemId
    const updatedSearchResults = searchResults.filter(result => result.product.item_id !== itemId);
    // update searchResults state with the filtered array
    setSearchResults(updatedSearchResults);
  };

  const handleSearch = () => {
    setSearchPressed(true);
    fetchSearchResults(searchText);
  };

  const renderRightActions = (itemId) => (
    <View style={styles.rightActionsContainer}>
      <TouchableOpacity onPress = {() => handleSearchProduct(itemId)} style = {[styles.rightAction, styles.acceptAction]}>
        <MaterialIcons name = "check" size = {30} color = "white"/>
      </TouchableOpacity>
      <TouchableOpacity onPress = {() => handleSearchProduct(itemId)} style = {[styles.rightAction, styles.declineAction]}>
        <MaterialIcons name = "close" size = {30} color = "white"/>
      </TouchableOpacity>
    </View>
  );

  return (
    <GestureHandlerRootView style = {styles.container}>
      <View style = {styles.searchButton}>
        <AntDesign name = "search1" size = {35} color = "black"
         onPress = {handleSearch}/>
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
        <View style = {{flex: 1, justifyContent: "center", alignItems: "center"}}>
          {/* ActivityIndicator component used to indicate loading state */}
          <ActivityIndicator size = "large" color = {colors.taskbarContainerColor}/> 
        </View>
      )}
      {searchPressed && (
        <View style = {styles.searchContainer}>
          <View style = {styles.searchIcon}>
            <Feather name = "edit-3" size = {30} color = {colors.lightbrown}/>
          </View>
          <TextInput
            style = {styles.searchInput}
            onChangeText = {setSearchText}
            value = {searchText}
            placeholder = "Search for products..."
            placeholderTextColor = {colors.taskbarContainerColor}
          />
        </View>
      )}
      {/* if searchPressed, render search input by running the code below */}
      {/* else, continue with the "productImg && productTitle && productPrice" code */}
      {searchPressed ? (
        <ScrollView style = {styles.scrollView}>
          <View style = {styles.searchDataContainer}>
            {searchResults.map(result => (
              <Swipeable key = {result.product.item_id} renderRightActions = {() => renderRightActions(result.product.item_id)}>
                <View style = {styles.imgContainer}>
                  <Image source = {{ uri: result.product.main_image }} style = {styles.productSearchImg}/>
                </View>
                <Text style = {styles.productSearchTitle}>{result.product.title}</Text>
                <Text style = {styles.productSearchPrice}>{"$" + result.offers.primary.price}</Text>
              </Swipeable>
            ))}
          </View>
        </ScrollView>
      ) : (
      productImg && productTitle && productPrice && (
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
      ))}
    </View>
      <StatusBar style = "auto"/>
    </GestureHandlerRootView>
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 3, 
    borderBottomColor: colors.lightbrown, 
    marginBottom: 10, 
  },
  imgContainer: {
    alignItems: "center",
  },
  searchIcon: {
    marginLeft: 10, 
    marginTop: 10,
  },
  searchInput: {
    flex: 1, 
    marginLeft: 10, 
    marginTop: 10,
    fontFamily: "lexend-regular",
    color: colors.taskbarContainerColor,
    fontSize: 20, 
    paddingVertical: 10, 
  },
  scrollView: {
    flex: 1,
    marginTop: 10,
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
    flexDirection: "column",
    alignItems: "center",
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
    fontSize: 13, 
    fontFamily: "lexend-semibold",
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
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
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
    shadowColor: "black", // shadow color
    shadowOpacity: 0.3, // shadow opacity
    shadowOffset: { width: 0, height: 2 }, // shadow offset
    shadowRadius: 4, // shadow radius
    marginVertical: 25, // adjusts vertical spacing
  },
  swipeableView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: colors.productListingContainerColor,
  },
  searchDataContainer: {
    padding: 10,
    marginVertical: 5,
  },
  productSearchImg: {
    width: 150, 
    height: 150, 
    borderRadius: 5, 
  },
  productSearchTitle: {
    marginLeft: 10, 
    marginTop: 12,
    fontSize: 18, 
    fontWeight: "bold",
    alignItems: "center",
    fontFamily: "lexend-semibold",
    color: colors.taskbarContainerColor, 
  },
  productSearchPrice: {
    marginLeft: "auto", 
    marginBottom: 12,
    fontSize: 25,
    fontFamily: "lexend-regular",
    color: colors.taskbarContainerColor, 
  },
  productSearchButtonsContainer: {
    flexDirection: "row",
  },
  rightActionsContainer: {
    flexDirection: "row",
  },
  rightAction: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    marginVertical: 5,
    borderRadius: 5,
  },
  acceptAction: {
    backgroundColor: "green",
    shadowColor: "black", 
    shadowOpacity: 0.3, 
    shadowOffset: { width: 0, height: 2 }, 
    shadowRadius: 4,
    marginLeft: 10,
  },
  declineAction: {
    backgroundColor: "red",
    shadowColor: "black", 
    shadowOpacity: 0.3, 
    shadowOffset: { width: 0, height: 2 }, 
    shadowRadius: 4, 
    marginLeft: 5,
  },
});
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
  "lexend-regular": require("./app/assets/fonts/Lexend-Regular.ttf"),
  "lexend-semibold": require("./app/assets/fonts/Lexend-SemiBold.ttf")
});

export default function App() {
  // track whether custom fonts have been loaded
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // hold product data
  const [productImg, setProductImg] = useState(null);
  const [productTitle, setProductTitle] = useState(null);
  const [productPrice, setProductPrice] = useState(null);

  // track whether these buttons have been pressed 
  const [searchPressed, setSearchPressed] = useState(false);
  const [discoverVisible, setDiscoverVisible] = useState(false);
  const [cartPressed, setCartPressed] = useState(false);

  // hold the text entered in the search input
  const [searchText, setSearchText] = useState("");

  // hold results
  const [searchResults, setSearchResults] = useState([]);
  const [discoverResults, setDiscoverResults] = useState([]);

  // hold user's desired products
  const [acceptedProducts, setAcceptedProducts] = useState([]);

  // track if user accessed FYP from DiscoverPage
  const [accessedFromDiscover, setAccessedFromDiscover] = useState(false);

  const fetchNewProduct = useCallback(() => { // useCallback prevents fetching of new products during each render
    // fetch product data only when fonts are loaded and the search button hasn't been pressed
    if(fontsLoaded && !searchPressed){
      // DO NOT CLICK THIS LINK UNLESS YOU WANT TO WASTE CREDITS ($)
      axios.get("https://api.bluecartapi.com/request?api_key=236061A671534CF3A837B7FCC6D31D5D&search_term=electronics&type=search")
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
    // check if searchText is defined and not empty before making the API call
    if(searchText && searchText.trim() !== ""){
      // use `` to allow string interpolation with ${}
      axios.get(`https://api.bluecartapi.com/request?api_key=236061A671534CF3A837B7FCC6D31D5D&search_term=${searchText}&type=search`) 
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
  }, []);

  const fetchDiscoverResults = useCallback(() => { 
    const searchTerms = ["GeForce", "iBUYPOWER", "iPhone", "MSI", "Pixel", "PlayStation", "Razer", "Samsung", "SteelSeries"];
  
    // holds requests for each search term
    const searchRequests = searchTerms.map(searchTerm =>
      axios.get(`https://api.bluecartapi.com/request?api_key=236061A671534CF3A837B7FCC6D31D5D&search_term=${searchTerm}&type=search`)
      .then(response => response.data.search_results)
    );

    // Promise.all waits until all tasks are completed and then reports back the results
    Promise.all(searchRequests).then(searchResultsArray => {
      const categorizedItems = {};

      // iterate over each searchTerm and its corresponding results
      searchTerms.forEach((searchTerm, index) => {
        const brand = searchTerm;
        const searchResults = searchResultsArray[index];

        // add searchResults to the array for the corresponding brand
          categorizedItems[brand] = searchResults;
        });
      // update state with categorized items
      setDiscoverResults(categorizedItems);
    })
    .catch(error => {
      console.error("Error fetching discover results:", error);
    });
  }, []);

  // makes sure getFonts() does its job and then runs the rest of the effect
  useEffect(() => {
    async function loadFonts() {
      await getFonts();
      setFontsLoaded(true);
    }
    loadFonts(); fetchNewProduct(); fetchSearchResults(); fetchDiscoverResults();
  }, [fetchNewProduct, fetchSearchResults, fetchDiscoverResults]); 

  const handleAcceptProduct = () => {
    fetchNewProduct();
    if(productImg && productTitle && productPrice){
      // "..." creates a new array by copying the values from an existing array
      setAcceptedProducts([...acceptedProducts, { img: productImg, title: productTitle, price: productPrice }]);
    }
    if(accessedFromDiscover){
      setDiscoverVisible(true);
    }
    else{
      setDiscoverVisible(false);
    }
  };

  const handleDeclineProduct = () => {
    fetchNewProduct();
    setDiscoverVisible(true);
    if(accessedFromDiscover){
      setDiscoverVisible(true);
    }
    else{
      setDiscoverVisible(false);
    }
  };

  const handleHomeButtonPress = () => {
    setSearchPressed(false);
    setDiscoverVisible(false);
    setCartPressed(false);
  };

  const handleSearchProduct = (itemId, accepted) => {
    // filter out item with corresponding itemId
    const updatedSearchResults = searchResults.filter(result => result.product.item_id !== itemId);
    
    // update searchResults state with the filtered array
    setSearchResults(updatedSearchResults);

    if(accepted){
      // find acceptedProduct in searchResults based on itemId
      const acceptedProduct = searchResults.find(result => result.product.item_id === itemId);
  
      // check if acceptedProduct is found and its data is available
      if(acceptedProduct && acceptedProduct.product.main_image && acceptedProduct.product.title && acceptedProduct.offers.primary.price){
        // follow same logic as handleAcceptProduct()
        setAcceptedProducts(prevAcceptedProducts => [
          ...prevAcceptedProducts,
          {
            img: acceptedProduct.product.main_image,
            title: acceptedProduct.product.title,
            price: `$${acceptedProduct.offers.primary.price}`
          }
        ]);
      }
    }
  };

  const handleSearch = () => {
    // when user presses searchButton, set true to render search input and results
    setSearchPressed(true);
    fetchSearchResults(searchText);
    setDiscoverVisible(false);
    setCartPressed(false);
  };

  const handleDiscover = () => {
    setAccessedFromDiscover(false); 
    setDiscoverVisible(true);
    setSearchPressed(false);
    setCartPressed(false);
  };   

  // if user is interested in a discover item and presses it, 
  // user will be brought back to the home FYP with the discover item's information displayed
  const handleDiscoverItemClick = (item) => {
    // set true to indicate that the user accessed FYP from DiscoverPage
    setAccessedFromDiscover(true);
    
    setProductImg(item.product.main_image);
    setProductTitle(item.product.title);
    setProductPrice("$" + item.offers.primary.price);

    setSearchPressed(false);
    setDiscoverVisible(false);
    setCartPressed(false);
  };

  const handleCart = () => {
    setCartPressed(true);
    setSearchPressed(false);
    setDiscoverVisible(false);
  };

  const renderRightActions = (itemId) => {
    return (
      <View style={styles.rightActionsContainer}>
        <TouchableOpacity onPress = {() => handleSearchProduct(itemId, true)} style = {[styles.rightAction, styles.acceptAction]}>
          <MaterialIcons name = "check" size = {30} color = "white"/>
        </TouchableOpacity>
        <TouchableOpacity onPress = {() => handleSearchProduct(itemId, false)} style = {[styles.rightAction, styles.declineAction]}>
          <MaterialIcons name = "close" size = {30} color = "white"/>
        </TouchableOpacity>
      </View>
    );
  };

  // render discover results inside productListingContainer when discoverButton is pressed
  const renderDiscoverResults = () => {
    return (
      <ScrollView vertical = {true}>
        {/* maps through each brand in discoverResults array */}
        {Object.keys(discoverResults).map(brand => (
          // each brand serves as a unique identifier for the rendered items
          <View key = {brand}>
            <Text style = {styles.brandTitle}>{brand}</Text>
            <ScrollView horizontal = {true}>
              {/* maps through each item belonging to the current brand that is not $0 */}
              {Array.isArray(discoverResults[brand]) && discoverResults[brand].filter(item => item.offers.primary.price !== "$0").map((item, index) => (
                <TouchableOpacity key = {`${brand}_${index}`} onPress = {() => handleDiscoverItemClick(item)}> 
                  {/* if index is 0, apply firstDiscoverItem style 
                  else, set firstDiscoverItem style to null */}
                  <View key = {`${brand}_${index}`} style = {[styles.discoverItem, index === 0 ? styles.firstDiscoverItem : null]}>
                    <Image source = {{ uri: item.product.main_image }} style = {styles.discoverImg}/>
                    <Text style = {styles.discoverPrice}>{"$" + item.offers.primary.price}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    )
  };

  // render user's desired products inside productListingContainer when cartButton is pressed
  const renderAcceptedProducts = () => {
    return (
      <ScrollView vertical = {true}>
        {acceptedProducts.map((product, index) => (
          <View key = {index} style = {styles.acceptedProductContainer}>
            <View style = {styles.productInfoContainer}>
              <Image source = {{ uri: product.img }} style = {styles.acceptedProductImg}/>
              <View style = {styles.productTextContainer}>
                <Text style = {styles.acceptedProductTitle}>{product.title}</Text>
                <Text style = {styles.acceptedProductPrice}>{product.price}</Text>
              </View>
            </View>
            <View style = {styles.divider}/>
            <Swipeable renderRightActions = {() => (
              <View style = {styles.rightActionsContainer}>
                <TouchableOpacity onPress = {() => handleViewOnWalmart(product)} style = {[styles.rightAction, styles.acceptAction]}>
                  <MaterialIcons name = "check" size = {30} color = "white"/>
                </TouchableOpacity>
                <TouchableOpacity onPress = {() => handleRemoveProduct(index)} style = {[styles.rightAction, styles.declineAction]}>
                  <MaterialIcons name = "close" size = {30} color = "white"/>
                </TouchableOpacity>
              </View>
            )}>
            </Swipeable>
          </View>
        ))}
      </ScrollView>
    );
  };
  
  return (
    <GestureHandlerRootView style = {styles.container}>
      <View style = {styles.searchButton}>
        <AntDesign name = "search1" size = {35} color = "black"
         onPress = {() => handleSearch()}/>
      </View>
      
      <View style = {styles.taskbarContainer}>
        <View style = {styles.homeButton}>
          <Octicons name = "home" size = {40} color = "black"
           onPress = {() => handleHomeButtonPress()}/>
        </View>
        <View style = {styles.discoverButton}>
          <Ionicons name = "compass-outline" size = {50} color = "black"
            onPress = {() => handleDiscover()}/> 
        </View>
        <View style = {styles.cartButton}>
          <MaterialCommunityIcons name = "cart-outline" size = {43} color = "black"
           onPress = {() => handleCart()}/> 
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
        {cartPressed && (
          <View style = {styles.acceptedProductsContainer}>
            {renderAcceptedProducts()}
          </View>
        )}
        {discoverVisible && (
          <View style = {styles.discoverResultsContainer}>
            {renderDiscoverResults()}
          </View>
        )}
        {searchPressed && (
          <>
            {/* for search input */}
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
            {/* for search results */}
            <ScrollView style = {styles.scrollView}>
              <View style = {styles.searchDataContainer}>
              {/* maps through searchResults to render each product with their specific index, fixing the duplicate products (non-unique keys) issue */}
                {searchResults.map((result, index) => (
                  <Swipeable key = {`${result.product.item_id}_${index}`} renderRightActions = {() => renderRightActions(result.product.item_id)}>
                    <View style = {styles.imgContainer}>
                      <Image source = {{ uri: result.product.main_image }} style = {styles.productSearchImg}/>
                    </View>
                    <Text style = {styles.productSearchTitle}>{result.product.title}</Text>
                    <Text style = {styles.productSearchPrice}>{"$" + result.offers.primary.price}</Text>
                  </Swipeable>
                ))}
              </View>
            </ScrollView>
          </>
        )}
        {!searchPressed && !discoverVisible && !cartPressed && productImg && productTitle && productPrice && (
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
    textAlign: "center",
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
  discoverResultsContainer: {
    marginBottom: 10,
  },
  brandTitle: {
    fontSize: 20,
    fontFamily: "lexend-semibold",
    color: colors.taskbarContainerColor,
    marginTop: 10,
    marginLeft: 20,
  },
  discoverItem: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 20, 
    marginLeft: -20, // counteract paddingHorizontal with negative margin  
  },
  // apply only to the first elements of their respective brand arrays
  firstDiscoverItem: {
    marginLeft: 0, 
  },
  discoverImg: {
    marginTop: 10,
    width: 150,
    height: 150,
    resizeMode: "cover",
    borderRadius: 10,
  },
  discoverPrice: {
    marginTop: 5, 
    fontSize: 30, 
    fontFamily: "lexend-regular",
    textAlign: "center",
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
  acceptedProductContainer: {
    flexDirection: "column",
    paddingHorizontal: 20,
  },
  productInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  productTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  acceptedProductImg: {
    marginTop: 10,
    marginBottom: 10,
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  acceptedProductTitle: {
    fontSize: 10,
    fontFamily: "lexend-semibold",
    textAlign: "center",
    color: colors.taskbarContainerColor,
  },
  acceptedProductPrice: {
    marginTop: 5, 
    fontSize: 30, 
    fontFamily: "lexend-regular",
    textAlign: "center",
    color: colors.taskbarContainerColor,
  },
  divider: {
    borderBottomColor: colors.lightbrown,
    borderBottomWidth: 1,
  },
});
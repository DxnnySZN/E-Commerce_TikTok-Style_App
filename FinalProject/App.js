import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import colors from './app/config/colors';
import { AntDesign, Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons } from '@expo/vector-icons';

export default function App() {
  // API endpoint
  const url = "https://marketplace.walmartapis.com/v3/items/{id}";

  // path parameter
  const itemId = "your_item_id_here";

  // query parameters
  const productIdType = "SKU";  // can change this to the appropriate code type
  const condition = "New";  // can change this to the desired condition

  // headers
  const headers = {
    "WM_SEC.ACCESS_TOKEN": "your_access_token_here",
    "WM_QOS.CORRELATION_ID": "your_correlation_id_here",
    "WM_SVC.NAME": "Walmart Service Name",
    // add other required headers here
  };

  // parameters
  const params = new URLSearchParams({
    productIdType: productIdType,
    condition: condition,
  });

  // make the request
  fetch(`${url}/${itemId}?${params}`, {
    method: "GET",
    headers: headers,
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
        throw new Error(`Failed to retrieve item details. Status code: ${response.status}`);
    }
  })
  .then(data => {
    const itemDetails = data.responseRecord;
    // display item details
    console.log("Item Details:");
    console.log("SKU:", itemDetails.sku);
    console.log("Condition:", itemDetails.condition);
    console.log("Walmart Product ID:", itemDetails.wpid);
    console.log("UPC:", itemDetails.upc);
    console.log("GTIN:", itemDetails.gtin);
    console.log("Product Name:", itemDetails.productName);
    console.log("Shelf:", itemDetails.shelf);
    console.log("Product Type:", itemDetails.productType);
    console.log("Price:", itemDetails.price);
    console.log("Published Status:", itemDetails.publishedStatus);
    // display other relevant details as needed
  })
  .catch(error => {
    console.error("Error:", error.message);
  });

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
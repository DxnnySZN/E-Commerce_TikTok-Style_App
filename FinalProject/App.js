import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Configuration, AuthenticationApi, OrdersApi } from '@whitebox-co/walmart-marketplace-api';
import { Buffer } from 'buffer/'; // trailing slash is important and not a mistake
import colors from './app/config/colors';
import { AntDesign, Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons } from '@expo/vector-icons';

export default function App() {
  const randomFxn = () => {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }   
  };

  const apiStarter = async() => {
  // configure authorization api
  const configuration = new Configuration();
  const authApi = new AuthenticationApi(configuration);
  const authorization = 'Basic ' + Buffer.from(env.CLIENT_ID + ':' + env.CLIENT_SECRET).toString('base64');

  // get response token
  const tokenResponse = await authApi.tokenAPI({
	  authorization,
	  wMQOSCORRELATIONID: randomFxn(),
	  wMSVCNAME: '@whitebox-co/walmart-marketplace-api',
	  grantType: 'client_credentials',
	  wMCONSUMERCHANNELTYPE: env.CONSUMER_CHANNEL_TYPE,
  });

  // configure orders api
  const ordersApi = new OrdersApi(configuration);

  // make subsequent order calls
  const orderResponse = await ordersApi.getAnOrder({
	  authorization,
	  wMSECACCESSTOKEN: tokenResponse.data?.access_token,
	  wMQOSCORRELATIONID: randomFxn(),
	  wMSVCNAME: '@whitebox-co/walmart-marketplace-api',
	  wMCONSUMERCHANNELTYPE: env.CONSUMER_CHANNEL_TYPE,
	  id: 1,
  });
}

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
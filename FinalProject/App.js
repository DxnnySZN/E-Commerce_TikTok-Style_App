import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import colors from './app/config/colors';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

export default function App() {
  return (
    <View style={styles.container}>
      <View style = {styles.searchButton}>
        <AntDesign name="search1" size={35} color="black"
        onPress = {() => console.log("button pressed")} />
        </View>  

      <View style = {styles.taskbarContainer}>
        <View style = {styles.homeButton}>
          <Octicons name="home" size={40} color="black" />
          </View>
        <View style = {styles.discoverButton}>
          <Ionicons name="compass-outline" size={50} color="black" />
          </View>
        <View style = {styles.cartButton}>
          <MaterialCommunityIcons name="cart-outline" size={43} color="black" />
          </View>
        <View style = {styles.profileButton}>
        <Octicons name="person" size={43} color="black" />
          </View>
      </View>

      <View style = {styles.productListingContainer}>
        <View style = {styles.productImg}>

          </View>
        <View style = {styles.productTitle}>

          </View>
        <View style = {styles.productPrice}>

          </View>
        <View style = {styles.productDesc}>

          </View>
        <View style = {styles.productAcceptButton}>

          </View>
        <View style = {styles.productDeclineButton}>

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
    height: 90,
    width: "100%",
    // position & bottom allow the taskbarContainer to be aligned at the bottom
    position: "absolute",
    bottom: 0, 
  },
  homeButton: {
    flex: 1,
    marginLeft: 25,
  },
  discoverButton: {
    flex: 1,
    marginLeft: 34,
  },
  cartButton: {
    flex: 1,
    marginLeft: 48,
  },
  profileButton: {
    flex: 1,
    marginLeft: 43,
  },
  productListingContainer: {
    flexDirection: "column",
    height: "75%",
    width: "90%",
    marginLeft: 19.5,
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
  productAcceptButton: {
    flex: 1,

  },
  productDeclineButton: {
    flex: 1,

  },
});
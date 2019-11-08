import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Constants from "expo-constants";
import reducer from "./reducers";
import Tabs from "./components/Tabs";
import { purple, white } from "./utils/colors";
import EntryDetail from "./components/EntryDetail";

const AppNavigator = createAppContainer(
  createStackNavigator({
    Home: {
      screen: Tabs
    },
    EntryDetail: {
      screen: EntryDetail,
      navigationOptions: {
        headerTintColor: white,
        headerStyle: {
          backgroundColor: purple
        }
      }
    }
  })
);

function UdaciStatusBar({ backgroundColor, ...props }) {
  return (
    <View style={{ backgroundColor, height: Constants.statusBarHeight }}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  );
}
function App() {
  return (
    <Provider store={createStore(reducer)}>
      <UdaciStatusBar backgroundColor={purple} barStyle="light-content" />
      <AppNavigator />
    </Provider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default App;

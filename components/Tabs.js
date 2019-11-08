import React from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";

import History from "./History";
import AddEntry from "./AddEntry";

import { purple, white, gray } from "../utils/colors";

const Tabs = createBottomTabNavigator(
  {
    History: {
      screen: History,
      navigationOptions: ({ navigation }) => ({
        title: "History",
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="ios-bookmarks" size={30} color={tintColor} />
        )
      })
    },
    AddEntry: {
      screen: AddEntry,
      navigationOptions: ({ navigation }) => ({
        title: "Add Entry",
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome name="plus-square" size={30} color={tintColor} />
        )
      })
    }
  },
  {
    initialRouteName: "History",
    defaultNavigationOptions: {
      tabBarOptions: {
        activeTintColor: Platform.OS === "ios" ? purple : white,
        inactiveTintColor: gray,
        style: {
          height: 56,
          backgroundColor: Platform.OS === "ios" ? white : purple,
          shadowColor: "rgba(0,0,0.24)",
          shadowOffset: {
            width: 0,
            height: 3
          },
          shadowRadius: 6,
          shadowOpacity: 1
        }
      }
    }
  }
);

export default createAppContainer(Tabs);

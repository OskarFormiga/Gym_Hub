import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileScreen from "../screens/MainScreens/Gyms/ProfileScreen";
import UsersScreen from "../screens/MainScreens/Gyms/UsersScreen";
import ActivitiesScreen from "../screens/MainScreens/Gyms/ActivitiesScreen";
import CalendarScreen from "../screens/MainScreens/Gyms/CalendarScreen";
import GymComponent from "../core/presentation/GymProfile/GymProfileComponent";
import { SymbolView, SymbolViewProps, SFSymbol } from "expo-symbols";
import { StyleSheet, View } from "react-native";

export type MainTabParamList = {
  Calendar: undefined;
  Users: undefined;
  Activities: undefined;
  Profile: undefined;
};

const GymProfileComponent = () => {
  return <GymComponent isRegistered={false} />;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const GymMainNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: SFSymbol = "calendar";
        let style = styles.symbol;

        if (route.name === "Calendar") {
          iconName = "calendar";
        } else if (route.name === "Users") {
          iconName = "person.3.fill";
          style = { ...style, width: 40 };
        } else if (route.name === "Activities") {
          iconName = "list.dash";
        } else if (route.name === "Profile") {
          iconName = "person";
        }
        return (
          <SymbolView
            name={iconName}
            style={style}
            type="monochrome"
            tintColor={"black"}
          />
        );
      },
      tabBarActiveTintColor: "tomato",
      tabBarInactiveTintColor: "gray",
    })}
  >
    <Tab.Screen name="Users" component={UsersScreen} />
    <Tab.Screen name="Activities" component={ActivitiesScreen} />
    <Tab.Screen name="Calendar" component={CalendarScreen} />
    <Tab.Screen name="Profile" component={GymProfileComponent} />
  </Tab.Navigator>
);

export default GymMainNavigator;

const styles = StyleSheet.create({
  symbol: {
    width: 30,
    height: 30,
    margin: 5,
  },
});

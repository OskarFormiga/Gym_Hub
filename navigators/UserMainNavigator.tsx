import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CalendarScreen from "../screens/MainScreens/Users/CalendarScreen";
import RankingScreen from "../screens/MainScreens/Users/RankingScreen";
import ReservationsScreen from "../screens/MainScreens/Users/ReservationsScreen";
import UserComponent from "../core/presentation/UserProfile/UserComponent";
import GymsViewComponent from "../core/presentation/GymsView/GymsViewComponent";
import { SymbolView, SFSymbol } from "expo-symbols";
import { StyleSheet } from "react-native";

export type MainTabParamList = {
  Calendar: undefined;
  GymSearch: undefined;
  Reservations: undefined;
  Ranking: undefined;
  Profile: undefined;
};

const UserProfileComponent = () => {
  return <UserComponent isRegistered={true} />;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const UserMainNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: SFSymbol = "calendar";

        if (route.name === "Calendar") {
          iconName = "calendar";
        } else if (route.name === "Ranking") {
          iconName = "chart.bar.fill";
        } else if (route.name === "Reservations") {
          iconName = "list.dash";
        } else if (route.name === "GymSearch") {
          iconName = "magnifyingglass";
        } else if (route.name === "Profile") {
          iconName = "person.circle.fill";
        }
        return (
          <SymbolView
            name={iconName}
            style={styles.symbol}
            type="monochrome"
            tintColor={"black"}
          />
        );
      },
      tabBarActiveTintColor: "black",
      tabBarInactiveTintColor: "gray",
    })}
  >
    <Tab.Screen name="GymSearch" component={GymsViewComponent} />
    <Tab.Screen name="Calendar" component={CalendarScreen} />
    <Tab.Screen name="Reservations" component={ReservationsScreen} />
    <Tab.Screen name="Ranking" component={RankingScreen} />
    <Tab.Screen name="Profile" component={UserProfileComponent} />
  </Tab.Navigator>
);

export default UserMainNavigator;

const styles = StyleSheet.create({
  symbol: {
    width: 30,
    height: 30,
    margin: 5,
  },
});

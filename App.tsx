// src/App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthNavigator from "./navigators/AuthNavigator";
import UserMainNavigator from "./navigators/UserMainNavigator";
import { UserProvider } from "./context/UserContext";
import GymMainNavigator from "./navigators/GymMainNavigator";
import "./localization/i18n";

export type RootStackParamList = {
  Auth: undefined;
  UserMain: undefined;
  GymMain: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => (
  <UserProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserMain"
          component={UserMainNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GymMain"
          component={GymMainNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  </UserProvider>
);

export default App;

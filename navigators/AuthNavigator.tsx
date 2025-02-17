import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/AuthScreens/LoginScreen";
import RegisterUserScreen from "../screens/AuthScreens/RegisterUserScreen";
import ForgotPasswordScreen from "../screens/AuthScreens/ForgotPasswordScreen";
import RegisterGymScreen from "../screens/AuthScreens/RegisterGymScreen";

export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  RegisterUser: undefined;
  RegisterGym: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => (
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="RegisterUser"
      component={RegisterUserScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="RegisterGym"
      component={RegisterGymScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ForgotPassword"
      component={ForgotPasswordScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default AuthNavigator;

import * as React from "react";
import { View, StyleSheet, Text, Button, TextInput } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Signup from "./mainContainer/pages/signup";
import ResetPassword from "./mainContainer/ResetPassword";
import Login from "./mainContainer/pages/login";
import MainPage from "./mainContainer/MainPage";

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="signup"
          component={Signup}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="mainPage"
          component={MainPage}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="resetPassword"
          component={ResetPassword}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

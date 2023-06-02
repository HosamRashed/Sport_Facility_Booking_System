import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Signup from "./mainContainer/pages/signup";
import ResetPassword from "./mainContainer/ResetPassword";
import Login from "./mainContainer/pages/login";
import MainPage from "./mainContainer/MainPage";
import FacilityInfo from "./mainContainer/pages/facility/FacilityInfo";
import AnnounceInfo from "./mainContainer/pages/announcement/AnnounceInfo";

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainPage"
          component={MainPage}
          options={{ headerShown: false, gestureEnabled: false }}
        />

        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FacilityInfo"
          component={FacilityInfo}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AnnounceInfo"
          component={AnnounceInfo}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

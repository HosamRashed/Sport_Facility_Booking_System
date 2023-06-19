import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider, useSelector, useDispatch } from "react-redux";
import store, { setUserID } from "./mainContainer/store"; // Import your Redux store and action creator

import Signup from "./mainContainer/pages/signup";
import ResetPassword from "./mainContainer/ResetPassword";
import Login from "./mainContainer/pages/login";
import MainPage from "./mainContainer/MainPage";
import FacilityInfo from "./mainContainer/pages/facility/FacilityInfo";
import AnnounceInfo from "./mainContainer/pages/announcement/AnnounceInfo";
import BookDetails from "./mainContainer/pages/facility/BookDetails";

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="MainPage"
            component={MainPageWrapper}
            options={{ headerShown: false, gestureEnabled: false }}
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

          <Stack.Screen
            name="BookDetails"
            component={BookDetails}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

function MainPageWrapper() {
  const userID = useSelector((state) => state.userID);
  const dispatch = useDispatch();

  const handleSetUserID = (userID) => {
    dispatch(setUserID(userID));
  };

  return <MainPage userID={userID} setUserID={handleSetUserID} />;
}

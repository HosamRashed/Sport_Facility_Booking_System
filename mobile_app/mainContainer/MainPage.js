import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs();

// Screens
import Announcement from "./pages/announcement/Announcement";
import Bookings from "./pages/bookings/Bookings";
import Facility from "./pages/facility/Facility";
import UserDashboard from "./pages/userDashboard/UserDashboard";

// Screen names
const announcement = "Announcement";
const bookings = "Bookings";
const facility = "Facility";
const userDashboard = "User";

const Tab = createBottomTabNavigator();

function mainPage() {
  return (
    <Tab.Navigator
      initialRouteName={facility}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === announcement) {
            iconName = focused ? "megaphone" : "megaphone-outline";
          } else if (route.name === bookings) {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === facility) {
            iconName = focused ? "location" : "location-outline";
          } else if (route.name === userDashboard) {
            iconName = focused ? "person" : "person-outline";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        tabBarStyle: { fontSize: 50 },

        activeTintColor: "#2b79ff",
        inactiveTintColor: "grey",
        labelStyle: { fontSize: 14 },
        tabStyle: {
          borderBottomWidth: 4,
          borderBottomColor: "#2b79ff",
          height: 50,
        },
        showLabel: false,
        showIcon: true,
      }}
    >
      <Tab.Screen
        name={facility}
        component={Facility}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name={bookings}
        component={Bookings}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name={announcement}
        component={Announcement}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name={userDashboard}
        component={UserDashboard}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default mainPage;

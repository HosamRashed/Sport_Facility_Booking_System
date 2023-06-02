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
const AnnouncementScreen = "Announcement";
const BookingsScreen = "Bookings";
const FacilityScreen = "Facility";
const UserDashboardScreen = "User";

const Tab = createBottomTabNavigator();

function MainPage() {
  return (
    <Tab.Navigator
      initialRouteName={FacilityScreen}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === AnnouncementScreen) {
            iconName = focused ? "megaphone" : "megaphone-outline";
          } else if (route.name === BookingsScreen) {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === FacilityScreen) {
            iconName = focused ? "location" : "location-outline";
          } else if (route.name === UserDashboardScreen) {
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
        name={FacilityScreen}
        component={Facility}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name={BookingsScreen}
        component={Bookings}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name={AnnouncementScreen}
        component={Announcement}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name={UserDashboardScreen}
        component={UserDashboard}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default MainPage;

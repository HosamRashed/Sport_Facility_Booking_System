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
          return <Ionicons name={iconName} size={27} color="#6495ed" />;
        },
      })}
      tabBarOptions={{
        tabBarActiveTintColor: "#2b79ff",
        tabBarInactiveTintColor: "grey",
        tabBarShowLabel: false,

        tabBarLabelStyle: {
          fontSize: 15,
        },
        tabBarItemStyle: {
          height: 50,
        },
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

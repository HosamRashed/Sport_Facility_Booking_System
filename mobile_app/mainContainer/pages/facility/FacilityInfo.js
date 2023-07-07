import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";

const FacilityInfo = () => {
  const route = useRoute();
  const { facility } = route.params;
  let NoOfStars = 0;
  for (let i = 0; i < facility.rating.length; i++) {
    NoOfStars += facility.rating[i].value;
  }
  const averageStars = NoOfStars / facility.rating.length;

  const image = facility.image;
  const navigation = useNavigation();

  const handleDetailsPress = () => {
    navigation.navigate("BookDetails", {
      info: facility,
      returnToBooking: false,
    });
  };

  const renderStars = () => {
    const filledStars = Math.floor(averageStars);
    const emptyStars = 5 - filledStars;
    const stars = [];

    // Render filled stars
    for (let i = 0; i < filledStars; i++) {
      stars.push(<Ionicons key={i} name="star" size={25} color="#FFD700" />);
    }

    // Render empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons
          key={filledStars + i}
          name="star-outline"
          size={25}
          color="#FFD700"
        />
      );
    }

    return stars;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Image
          style={styles.profilePicture}
          source={{
            uri: `${image}`,
          }}
        />
        <View style={styles.review}>
          <Text style={styles.inputLabel}>
            {facility.rating.length > 0
              ? facility.rating.length +
                (facility.rating.length === 1 ? " Review" : " Reviews")
              : "No reviews yet"}
          </Text>
          <View style={styles.starsContainer}>{renderStars()}</View>
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{facility.name.toUpperCase()}</Text>
          <Text style={styles.name}>Description:</Text>
          <Text style={styles.contentText}>{facility.description}</Text>
        </View>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 2.9279508,
            longitude: 101.6424027,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: 2.9279508,
              longitude: 101.6424027,
            }}
            title="Multimedia University Football Field"
          />
        </MapView>
        <TouchableOpacity style={styles.bookText} onPress={handleDetailsPress}>
          <Text style={styles.text}>BOOK A SLOT</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "white",
    paddingTop: 20,
    justifyContent: "start",
    alignItems: "start",
    paddingHorizontal: 20,
  },
  profilePicture: {
    borderWidth: 0.5,
    left: "auto",
    right: "auto",
    borderRadius: 20,
    width: 380,
    height: 200,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: "#171717",
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  review: {
    marginTop: 5,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  bookText: {
    position: "absolute",
    top: 630,
    left: 15,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: "#171717",
    shadowOpacity: 0.5,
    shadowRadius: 3,
    marginLeft: 35,
    backgroundColor: "#3cb371",
    borderRadius: 35,
    padding: 15,
    paddingHorizontal: 80,
    marginTop: 35,
  },
  text: {
    color: "white",
    fontSize: 25,
  },
  content: {
    marginTop: 12,
  },
  inputLabel: {
    fontSize: 20,
  },
  contentText: {
    // borderWidth: 1,
    maxWidth: "100%",
    fontSize: 20,
    // textAlign: "justify",
  },
  name: {
    marginBottom: 5,
    color: "#2b79ff",
    fontSize: 25,
  },
  map: {
    borderWidth: 0.5,
    borderRadius: 20,
    marginTop: 10,
    width: "100%",
    height: 110,
  },
});

export default FacilityInfo;

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

const FacilityInfo = () => {
  const route = useRoute();
  const { facility } = route.params;

  const image = facility.image;
  const navigation = useNavigation();

  const handleDetailsPress = () => {
    navigation.navigate("BookDetails", {
      info: facility,
      returnToBooking: false,
    });
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
          <Text style={styles.inputLabel}>3 reviews</Text>
          <Text style={styles.inputLabel}></Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{facility.name.toUpperCase()}</Text>
          <Text style={styles.name}>Description:</Text>
          <Text style={styles.contentText}>{facility.description}</Text>
        </View>
        <TouchableOpacity style={styles.bookText} onPress={handleDetailsPress}>
          <Text style={styles.text}>BOOK A SLOT</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    justifyContent: "start",
    alignItems: "start",
    paddingHorizontal: 20,
  },

  profilePicture: {
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
  bookText: {
    position: "absolute",
    top: 600,
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
    textAlign: "justify",
  },
  name: {
    marginBottom: 5,
    color: "#2b79ff",
    fontSize: 25,
  },
});

export default FacilityInfo;

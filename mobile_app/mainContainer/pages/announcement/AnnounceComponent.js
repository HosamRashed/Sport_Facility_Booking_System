import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const AnnounceComponent = (props) => {
  const navigation = useNavigation();
  const informaion = props.info;

  const dateData = informaion.date;
  const date = new Date(dateData);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;

  const sentence = informaion.title;
  const capitalizedSentence =
    sentence.charAt(0).toUpperCase() + sentence.slice(1);

  const handleDetailsPress = () => {
    navigation.navigate("AnnounceInfo", { announcement: informaion });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.inputLabel}>{capitalizedSentence} </Text>
        <Text style={styles.date}>Date: {formattedDate}</Text>

        <TouchableOpacity
          style={styles.detailsBtn}
          onPress={handleDetailsPress}
        >
          <Text>Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    // borderWidth: 1,
    margin: 10,
    width: 370,
    borderRadius: 10,
    paddingHorizontal: 5,
    padding: 2,
    height: 100,
    display: "flex",
    justifyContent: "center",
    marginTop: 10,
    alignItems: "start",
    paddingHorizontal: 25,
    shadowOffset: { width: -2, height: 4 },
    shadowColor: "#171717",
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  detailsBtn: {
    backgroundColor: "#90ee90",
    borderRadius: 50,
    padding: 10,
    paddingHorizontal: 30,
    position: "absolute",
    top: 40,
    right: 20,
    marginLeft: "auto",
    shadowOffset: { width: 0, height: 0 },
    shadowColor: "#171717",
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },

  inputLabel: {
    maxWidth: 200,
    marginTop: 5,
    fontSize: 20,
  },
  date: {
    maxWidth: 250,
    marginTop: 5,
    fontSize: 20,
  },
});

export default AnnounceComponent;

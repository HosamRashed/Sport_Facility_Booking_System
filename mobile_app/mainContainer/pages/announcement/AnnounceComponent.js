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
  console.log(informaion.title);

  const handleDetailsPress = () => {
    navigation.navigate("AnnounceInfo", { announcement: informaion });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.inputLabel}>{informaion.title} </Text>
        <Text style={styles.date}>Date: </Text>

        <TouchableOpacity style={styles.bookText} onPress={handleDetailsPress}>
          <Text>Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderWidth: 1,
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

  bookText: {
    backgroundColor: "#90ee90",
    borderRadius: 50,
    borderWidth: 1,
    padding: 10,
    paddingHorizontal: 30,
    position: "absolute",
    top: 40,
    right: 20,
    marginLeft: "auto",
  },
  inputLabel: {
    maxWidth: 250,
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

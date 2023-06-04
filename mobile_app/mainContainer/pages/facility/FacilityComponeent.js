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

const FacilityComponent = (props) => {
  const navigation = useNavigation();
  const informaion = props.info;

  const handleDetailsPress = () => {
    navigation.navigate("FacilityInfo", { facility: informaion });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.inputLabel}>{informaion.name} </Text>

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

  title: {
    borderWidth: 2,
    marginTop: 10,
    borderWidth: 1,
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },

  bookText: {
    backgroundColor: "#90ee90",
    borderRadius: 50,
    padding: 10,
    paddingHorizontal: 30,
    marginTop: 10,
    marginLeft: "auto",
    shadowOffset: { width: 0, height: 0 },
    shadowColor: "#171717",
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  icon: {
    marginTop: 20,
    width: 100,
  },
  inputLabel: {
    marginLeft: 3,
    fontSize: 20,
  },
  input: {
    fontSize: 20,
    width: 370,
    height: 35,
    marginVertical: 10,
    marginHorizontal: 5,
    borderBottomWidth: 2,
    borderColor: "#ccc",
  },
});

export default FacilityComponent;

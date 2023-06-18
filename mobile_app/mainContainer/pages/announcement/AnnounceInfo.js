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
import { useRoute } from "@react-navigation/native";

const AnnounceInfo = () => {
  const route = useRoute();
  const { announcement } = route.params;
  const dateData = announcement.date;
  const date = new Date(dateData);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Image
          source={require("../../../images/maintanance.png")}
          style={styles.image}
        />

        <View style={styles.content}>
          <Text style={styles.name}>{announcement.title.toUpperCase()}</Text>
          <Text style={styles.inputLabel}>{announcement.content}</Text>
        </View>
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
    borderRadius: 20,
    borderWidth: 2,
    width: "100%",
    height: "50%",
  },
  review: {
    marginTop: 5,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bookText: {
    marginLeft: 35,
    backgroundColor: "#3cb371",
    borderRadius: 35,
    borderWidth: 1,
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
  name: {
    color: "#2b79ff",
    fontSize: 25,
  },
  image: {
    marginLeft: "auto",
    marginRight: "auto",
    height: 100,
    width: 200,
  },
});

export default AnnounceInfo;

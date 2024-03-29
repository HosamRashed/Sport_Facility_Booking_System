import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import LottieView from "lottie-react-native";
import errorAnimation from "../../../assets/animation/warning.json";
import axios from "axios";
import MapView, { Marker } from "react-native-maps";

const FacilityInfo = () => {
  const route = useRoute();
  const { facility } = route.params;
  const url = useSelector((state) => state.url);
  const User = useSelector((state) => state.userID);
  const [currentStudentInfo, setCurrentStudentInfo] = useState(null);
  const [showSuccessfullConfirmation, setshowSuccessfullConfirmation] =
    useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(`${url}/api/students/${User._id}`)
      .then((response) => {
        setCurrentStudentInfo(response.data.data[0]);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  let NoOfStars = 0;
  for (let i = 0; i < facility.rating.length; i++) {
    NoOfStars += facility.rating[i].value;
  }
  const averageStars = NoOfStars / facility.rating.length;

  const image = facility.image;
  const navigation = useNavigation();

  const handleDetailsPress = () => {
    if (currentStudentInfo.User_status === "barred") {
      setshowSuccessfullConfirmation(true);
      setTimeout(() => {
        setshowSuccessfullConfirmation(false);
      }, 4000);
    } else {
      navigation.navigate("BookDetails", {
        info: facility,
        returnToBooking: false,
      });
    }
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

  const extractCoordinates = (url) => {
    const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const matches = url.match(regex);
    if (matches && matches.length === 3) {
      const latitude = parseFloat(matches[1]);
      const longitude = parseFloat(matches[2]);
      return { latitude, longitude };
    } else {
      return { latitude: null, longitude: null };
    }
  };

  const googleMapsLink = facility.location;

  const coordinates = extractCoordinates(googleMapsLink);
  const latitude = coordinates.latitude;
  const longitude = coordinates.longitude;

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
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        ></MapView>
        <TouchableOpacity style={styles.bookText} onPress={handleDetailsPress}>
          <Text style={styles.text}>BOOK A SLOT</Text>
        </TouchableOpacity>

        <Modal
          visible={showSuccessfullConfirmation}
          animationType="fade"
          transparent={true}
        >
          <View style={styles.animationModalContainer}>
            <View style={styles.animationContainer}>
              <LottieView
                source={errorAnimation}
                autoPlay
                loop={false}
                style={styles.animation}
              />
              <Text style={styles.animationText}>
                You are barred from booking any facilities
              </Text>
            </View>
          </View>
        </Modal>
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
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 80,
    marginTop: 40,
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
    maxWidth: "100%",
    fontSize: 20,
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
    height: 95,
  },
  animationModalContainer: {
    flex: 1,
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  animationContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
    backgroundColor: "white",
  },
  animation: {
    width: 150,
    height: 150,
  },
  animationText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 20,
    fontwidth: "bold",
    fontcolor: "white",
  },
});

export default FacilityInfo;

import { createStore } from "redux";

// Define initial state
const initialState = {
  userID: "",
  url: "https://f14e-2001-e68-5456-10ca-e548-609e-3524-e178.ngrok-free.app",
};

const SET_USER_ID = "SET_USER_ID";

// Define action creator
export const setUserID = (userID) => ({
  type: SET_USER_ID,
  payload: userID,
});

const SET_URL = "SET_URL";

export const setURL = (url) => ({
  type: SET_URL,
  payload: url,
});

// Define reducer function
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_ID:
      return {
        ...state,
        userID: action.payload,
      };
    case SET_URL:
      return {
        ...state,
        url: action.payload,
      };
    default:
      return state;
  }
};

// Create Redux store
const store = createStore(reducer);

export default store;

import { createStore } from "redux";

// Define initial state
const initialState = {
  userID: "",
};

// Define action types
const SET_USER_ID = "SET_USER_ID";

// Define action creator
export const setUserID = (userID) => ({
  type: SET_USER_ID,
  payload: userID,
});

// Define reducer function
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_ID:
      return {
        ...state,
        userID: action.payload,
      };
    default:
      return state;
  }
};

// Create Redux store
const store = createStore(reducer);

export default store;

import Firebase, { db } from "../config/Firebase.js";

export const UPDATE_EMAIL = "UPDATE_EMAIL";
export const UPDATE_PASSWORD = "UPDATE_PASSWORD";
export const UPDATE_USER = "UPDATE_USER";
export const UPDATE_NAME = "UPDATE_NAME";
export const ADD_IMAGE = "ADD_IMAGE";
export const ADD_ALL_IMAGES = "ADD_ALL_IMAGES";
export const LOGIN = "LOGIN";
export const SIGNUP = "SIGNUP";
export const CLEAR_USER = "CLEAR_USER";
export const ADD_USER_LOGOS_TO_REDUCER = "ADD_USER_LOGOS_TO_REDUCER";
export const LOGO_TEST = "LOGO_TEST";

import { captureScreen } from "react-native-view-shot";

import * as MediaLibrary from "expo-media-library";

export const updateEmail = email => {
  return {
    type: UPDATE_EMAIL,
    payload: email
  };
};

export const updatePassword = password => {
  return {
    type: UPDATE_PASSWORD,
    payload: password
  };
};

export const updateUser = user => {
  return {
    type: UPDATE_USER,
    payload: user
  };
};

export const updateName = name => {
  return {
    type: UPDATE_NAME,
    payload: name
  };
};

export const clearUser = user => {
  return {
    type: CLEAR_USER,
    payload: user
  };
};

export const addImage = image => {
  return {
    type: ADD_IMAGE,
    payload: image
  };
};

export const addAllImages = images => {
  return {
    type: ADD_ALL_IMAGES,
    payload: images
  };
};

export const addUserLogosToReducer = logos => {
  return {
    type: ADD_USER_LOGOS_TO_REDUCER,
    payload: logos
  };
};

export const login = () => {
  return async (dispatch, getState) => {
    try {
      // const { email, password } = getState().user;

      console.log("at login in user.js");

      const email = "78@78.com";
      const password = "Wwwwww";

      const response = await Firebase.auth().signInWithEmailAndPassword(
        email,
        password
      );

      let userData = response.user.providerData[0];

      dispatch(updateUser(userData));

      return userData;
    } catch (e) {
      // console.log("failed login at login");
      alert(e);
    }
  };
};

export const getLogos = () => {
  return async (dispatch, getState) => {
    try {
      console.log("at get logos in user.js");

      const response = await fetch(
        "https://tester-859c6.firebaseio.com/users/78/images/.json?",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json;charset=utf-8"
          }
        }
      );

      let result = await response.json();
      dispatch(addUserLogosToReducer(result));

      return result;
    } catch (e) {
      console.log("failed getting logos");
      alert(e);
    }
  };
};

export const updateProfile = name => {
  console.log("in update profile");
  const userTest = Firebase.auth().currentUser;

  userTest
    .updateProfile({
      displayName: name
    })
    .then(function(res) {});
};

addToUserTable = async (name, email) => {
  console.log("at user table");
  let updatedRoute =
    "https://tester-859c6.firebaseio.com/users/" + name + ".json?";
  let response = await fetch(updatedRoute, {
    method: "PATCH",
    body: JSON.stringify({
      name: name,
      email: email
    }),
    headers: {
      "Content-Type": "application/json;charset=utf-8"
    }
  });

  let result = await response.json();
  console.log(result);
};

export const signup = () => {
  console.log("in signup in user");
  return async (dispatch, getState) => {
    try {
      console.log("in try in signup");
      const { email, password, name } = getState().user;
      const response = await Firebase.auth().createUserWithEmailAndPassword(
        email,
        password
      );
      if (response.user.uid) {
        console.log("in response in signup");
        updateProfile(name);
        addToUserTable(name, email);
        return [email, password];
      }
    } catch (e) {
      console.log("in catch in signup");
      alert(e);
    }
  };
};

import React from "react";
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import Profile from "../screens/Profile";
import Canvas from "../screens/Canvas";
import CanvasBack from "../screens/CanvasBack";

const SwitchNavigator = createSwitchNavigator(
  {
    Login: {
      screen: Login
    },
    Signup: {
      screen: Signup
    },
    Profile: {
      screen: Profile
    },
    Canvas: {
      screen: Canvas
    },
    CanvasBack: {
      screen: CanvasBack
    }
  },
  {
    initialRouteName: "Canvas"
  }
);

export default createAppContainer(SwitchNavigator);

import React from "react";
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import Profile from "../screens/Profile";
import CanvasTest from "../screens/CanvasTest";
import CanvasBackup from "../screens/CanvasBackup";

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
    CanvasTest: {
      screen: CanvasTest
    },
    CanvasBackup: {
      screen: CanvasBackup
    }
  },
  {
    initialRouteName: "CanvasTest"
  }
);

export default createAppContainer(SwitchNavigator);

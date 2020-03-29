import React from "react";
import RNDraw from "rn-draw";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Button
} from "react-native";
import Svg, { Circle, Rect } from "react-native-svg";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  updateEmail,
  updatePassword,
  login,
  getUser,
  updateUser
} from "../actions/user";

class CanvasTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log("in comp did mount at canvas test");
  }

  render() {
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "green"
          }
        ]}
      >
        <Svg height="50%" width="50%" viewBox="0 0 100 100">
          <Circle
            cx="50"
            cy="50"
            r="45"
            stroke="blue"
            strokeWidth="2.5"
            fill="green"
          />
          <Rect
            x="15"
            y="15"
            width="70"
            height="70"
            stroke="red"
            strokeWidth="2"
            fill="yellow"
          />
        </Svg>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { updateEmail, updatePassword, login, getUser, updateUser },
    dispatch
  );
};

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CanvasTest);

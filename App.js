import React from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunkMiddleware from "redux-thunk";

import * as Font from "expo-font";

import SwitchNavigator from "./navigation/SwitchNavigator";
import reducer from "./reducers";

const middleware = applyMiddleware(thunkMiddleware);
const store = createStore(reducer, middleware);

export default class App extends React.Component {
  async componentDidMount() {
    console.log("comp did mount at app.js");
    await Font.loadAsync({
      // 'any_name' : require('path_to_your_font_file')

      Unique: require("./assets/fonts/Unique.ttf"),
      Roboto: require("./assets/fonts/Roboto-Regular.ttf"),
      Arial: require("./assets/fonts/Arial.ttf")
    });
  }

  render() {
    return (
      <Provider store={store}>
        <SwitchNavigator />
      </Provider>
    );
  }
}

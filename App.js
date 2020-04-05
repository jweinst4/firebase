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
      "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
      Arial: require("./assets/fonts/Arial.ttf"),
      "NunitoSans-Regular": require("./assets/fonts/NunitoSans-Regular.ttf"),
      Montserrat: require("./assets/fonts/Montserrat-Regular.ttf"),
      "OpenSans-Regular": require("./assets/fonts/OpenSans-Regular.ttf"),
      "SourceSansPro-Regular": require("./assets/fonts/SourceSansPro-Regular.ttf"),
      "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
      "Inika-Regular": require("./assets/fonts/Inika-Regular.ttf"),
      Hetilica: require("./assets/fonts/hetilica.ttf"),
      "BalooPaaji2-Regular": require("./assets/fonts/BalooPaaji2-Regular.ttf"),
      "ComicNeue-Regular": require("./assets/fonts/ComicNeue-Regular.ttf"),
      "CrimsonText-Regular": require("./assets/fonts/CrimsonText-Regular.ttf"),
      "Gotu-Regular": require("./assets/fonts/Gotu-Regular.ttf"),
      "Heebo-Regular": require("./assets/fonts/Heebo-Regular.ttf"),
      Inconsolata: require("./assets/fonts/Inconsolata.ttf"),
      Lora: require("./assets/fonts/Lora.ttf"),
      "Merriweather-Regular": require("./assets/fonts/Merriweather-Regular.ttf"),
      Oswald: require("./assets/fonts/Oswald.ttf"),
      Quicksand: require("./assets/fonts/Quicksand.ttf"),
      "Raleway-Regular": require("./assets/fonts/Raleway-Regular.ttf"),
      "Rubik-Regular": require("./assets/fonts/Rubik-Regular.ttf")
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

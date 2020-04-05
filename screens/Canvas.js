import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Animated,
  TextInput
} from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as Permissions from "expo-permissions";
import Draggable from "react-native-draggable";
import ViewShot from "react-native-view-shot";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import ImagePickerComponent from "../components/ImagePickerComponent";
import PinchableBox from "../components/PinchableBox";
import { PinchGestureHandler, State } from "react-native-gesture-handler";

import { screenShotUtility } from "../utilities/screenShotUtility";

import { toggleLoading } from "../actions/loading";
import { login, getLogos } from "../actions/user";
import {
  changeGarment,
  changeLogoDimensions,
  toggleFrontOrBack,
  setCurrentScale
} from "../actions/items";

let currentVersion = "v6";

let colors = [
  "black",
  "red",
  "green",
  "orange",
  "blue",
  "pink",
  "lightblue",
  "yellow",
  "white"
];

let defaultTextOptions = [
  "Unique",
  "Roboto-Regular",
  "Arial",
  "NunitoSans-Regular",
  "Montserrat",
  "OpenSans-Regular",
  "SourceSansPro-Regular",
  "Poppins-Regular",
  "Inika-Regular",
  "Hetilica",
  "BalooPaaji2-Regular",
  "ComicNeue-Regular",
  "CrimsonText-Regular",
  "Gotu-Regular",
  "Heebo-Regular",
  "Inconsolata",
  "Lora",
  "Merriweather-Regular",
  "Oswald",
  "Quicksand",
  "Raleway-Regular",
  "Rubik-Regular"
];

class Canvas extends React.Component {
  panRef = React.createRef();
  rotationRef = React.createRef();
  pinchRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      showDetail: false,
      detailType: "",
      showLogoUploadDetail: false,
      showLogoChooseDetail: false,
      showTextDetail: false,
      logoChangeScalar: 1.1,
      currentScale: 1,
      allLogosFront: [],
      allLogosBack: [],
      allTextFront: [],
      allTextBack: [],
      currentText: "",
      currentTextColor: colors[0],
      zIndexList: [],
      editZIndexModal: false,
      logo1Front: {
        url: "",
        logoPositionX: 0,
        logoPositionY: 0,
        height: 0,
        heightDefault: 0,
        width: 0,
        widthDefault: 0,
        offsetX: 0,
        offsetY: 0
      },
      logo1Back: {
        url: "",
        logoPositionX: 0,
        logoPositionY: 0,
        height: 0,
        heightDefault: 0,
        width: 0,
        widthDefault: 0,
        offsetX: 0,
        offsetY: 0
      },
      logo2Front: {
        url: "",
        logoPositionX: 0,
        logoPositionY: 0,
        height: 0,
        heightDefault: 0,
        width: 0,
        widthDefault: 0
      },
      logo2Back: {
        url: "",
        logoPositionX: 0,
        logoPositionY: 0,
        height: 0,
        heightDefault: 0,
        width: 0,
        widthDefault: 0
      },
      logo3Front: {
        url: "",
        logoPositionX: 0,
        logoPositionY: 0,
        height: 0,
        heightDefault: 0,
        width: 0,
        widthDefault: 0
      },
      logo3Back: {
        url: "",
        logoPositionX: 0,
        logoPositionY: 0,
        height: 0,
        heightDefault: 0,
        width: 0,
        widthDefault: 0
      },
      logo4Front: {
        url: "",
        logoPositionX: 0,
        logoPositionY: 0,
        height: 0,
        heightDefault: 0,
        width: 0,
        widthDefault: 0
      },
      logo4Back: {
        url: "",
        logoPositionX: 0,
        logoPositionY: 0,
        height: 0,
        heightDefault: 0,
        width: 0,
        widthDefault: 0
      },
      logo5Front: {
        url: "",
        logoPositionX: 0,
        logoPositionY: 0,
        height: 0,
        heightDefault: 0,
        width: 0,
        widthDefault: 0
      },
      logo5Back: {
        url: "",
        logoPositionX: 0,
        logoPositionY: 0,
        height: 0,
        heightDefault: 0,
        width: 0,
        widthDefault: 0
      },
      logo6Front: {
        url: "",
        logoPositionX: 0,
        logoPositionY: 0,
        height: 0,
        heightDefault: 0,
        width: 0,
        widthDefault: 0
      },
      logo6Back: {
        url: "",
        logoPositionX: 0,
        logoPositionY: 0,
        height: 0,
        heightDefault: 0,
        width: 0,
        widthDefault: 0
      },
      text1Front: {
        font: "",
        textPositionX: 0,
        textPositionY: 0,
        height: 0,
        heightDefault: 0,
        width: 0,
        widthDefault: 0,
        offsetX: 0,
        offsetY: 0,
        textValue: "",
        fontSize: 0
      },
      text1Back: {
        font: "",
        textPositionX: 0,
        textPositionY: 0,
        height: 0,
        heightDefault: 0,
        width: 0,
        widthDefault: 0,
        offsetX: 0,
        offsetY: 0,
        textValue: "",
        fontSize: 0
      },
      text2Front: {
        font: "",
        textPositionX: 0,
        textPositionY: 0,
        height: 0,
        heightDefault: 0,
        width: 0,
        widthDefault: 0,
        offsetX: 0,
        offsetY: 0,
        textValue: "",
        fontSize: 0
      },
      text2Back: {
        font: "",
        textPositionX: 0,
        textPositionY: 0,
        height: 0,
        heightDefault: 0,
        width: 0,
        widthDefault: 0,
        offsetX: 0,
        offsetY: 0,
        textValue: "",
        fontSize: 0
      },
      text3Front: {
        font: "",
        textPositionX: 0,
        textPositionY: 0,
        height: 0,
        heightDefault: 0,
        width: 0,
        widthDefault: 0,
        offsetX: 0,
        offsetY: 0,
        textValue: "",
        fontSize: 0
      },
      text3Back: {
        font: "",
        textPositionX: 0,
        textPositionY: 0,
        height: 0,
        heightDefault: 0,
        width: 0,
        widthDefault: 0,
        offsetX: 0,
        offsetY: 0,
        textValue: "",
        fontSize: 0
      },
      text4Front: {
        font: "",
        textPositionX: 0,
        textPositionY: 0,
        height: 0,
        heightDefault: 0,
        width: 0,
        widthDefault: 0,
        offsetX: 0,
        offsetY: 0,
        textValue: "",
        fontSize: 0
      },
      text4Back: {
        font: "",
        textPositionX: 0,
        textPositionY: 0,
        height: 0,
        heightDefault: 0,
        width: 0,
        widthDefault: 0,
        offsetX: 0,
        offsetY: 0,
        textValue: "",
        fontSize: 0
      },
      text5Front: {
        font: "",
        textPositionX: 0,
        textPositionY: 0,
        height: 0,
        heightDefault: 0,
        width: 0,
        widthDefault: 0,
        offsetX: 0,
        offsetY: 0,
        textValue: "",
        fontSize: 0
      },
      text5Back: {
        font: "",
        textPositionX: 0,
        textPositionY: 0,
        height: 0,
        heightDefault: 0,
        width: 0,
        widthDefault: 0,
        offsetX: 0,
        offsetY: 0,
        textValue: "",
        fontSize: 0
      },
      text6Front: {
        font: "",
        textPositionX: 0,
        textPositionY: 0,
        height: 0,
        heightDefault: 0,
        width: 0,
        widthDefault: 0,
        offsetX: 0,
        offsetY: 0,
        textValue: "",
        fontSize: 0
      },
      text6Back: {
        font: "",
        textPositionX: 0,
        textPositionY: 0,
        height: 0,
        heightDefault: 0,
        width: 0,
        widthDefault: 0,
        offsetX: 0,
        offsetY: 0,
        textValue: "",
        fontSize: 0
      }
    };

    /* Pinching */
    // this._baseScale = new Animated.Value(1);
    // this._pinchScale = new Animated.Value(1);
    // this._scale = Animated.multiply(this._baseScale, this._pinchScale);
    // this._lastScale = 1;
    // this._onPinchGestureEvent = Animated.event(
    //   [{ nativeEvent: { scale: this._pinchScale } }],
    //   { useNativeDriver: true }
    // );

    // /* Rotation */
    // this._rotate = new Animated.Value(0);
    // this._rotateStr = this._rotate.interpolate({
    //   inputRange: [-100, 100],
    //   outputRange: ["-100rad", "100rad"]
    // });
    // this._lastRotate = 0;
    // this._onRotateGestureEvent = Animated.event(
    //   [{ nativeEvent: { rotation: this._rotate } }],
    //   { useNativeDriver: true }
    // );

    // /* Tilt */
    // this._tilt = new Animated.Value(0);
    // this._tiltStr = this._tilt.interpolate({
    //   inputRange: [-501, -500, 0, 1],
    //   outputRange: ["1rad", "1rad", "0rad", "0rad"]
    // });
    // this._lastTilt = 0;
    // this._onTiltGestureEvent = Animated.event(
    //   [{ nativeEvent: { translationY: this._tilt } }],
    //   { useNativeDriver: true }
    // );

    // this.onRotateHandlerStateChange = this.onRotateHandlerStateChange.bind(
    //   this
    // );
    // this.onPinchHandlerStateChange = this.onPinchHandlerStateChange.bind(this);
  }

  // onRotateHandlerStateChange = event => {
  //   if (event.nativeEvent.oldState === State.ACTIVE) {
  //     this._lastRotate += event.nativeEvent.rotation;
  //     this._rotate.setOffset(this._lastRotate);
  //     this._rotate.setValue(0);
  //   }
  // };

  // onPinchHandlerStateChange = (currentKey, event) => {
  //   // console.log("pinch handler");
  //   // // console.log(this.state);
  //   // console.log(event);
  //   // console.log(currentKey);
  //   if (event.nativeEvent.oldState === State.ACTIVE) {
  //     this._lastScale *= event.nativeEvent.scale;
  //     this._baseScale.setValue(this._lastScale);
  //     this._pinchScale.setValue(1);

  //     let logoCopyInHandler = this.state[currentKey];
  //     logoCopyInHandler.scale = 1;
  //     logoCopyInHandler.widthDefault *= event.nativeEvent.scale;
  //     logoCopyInHandler.heightDefault *= event.nativeEvent.scale;

  //     this.setState({ [currentKey]: logoCopyInHandler });
  //   }
  // };

  // _onTiltGestureStateChange = event => {
  //   if (event.nativeEvent.oldState === State.ACTIVE) {
  //     this._lastTilt += event.nativeEvent.translationY;
  //     this._tilt.setOffset(this._lastTilt);
  //     this._tilt.setValue(0);
  //   }
  // };

  async componentDidMount() {
    this.props.toggleLoading(true);
    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await this.props.login();
    await this.props.getLogos();
    this.props.toggleLoading(false);
  }

  screenshotHandler = async () => {
    this.props.toggleLoading(true);
    let responseTest = await screenShotUtility(this.state);
    const emptyRequest = await responseTest;
    this.toggleLoadingFunction(emptyRequest);
  };

  toggleLoadingFunction(emptyRequest) {
    console.log("in toggle loading function end at canvas");
    this.props.toggleLoading(false);
  }

  saveLogoLocations() {
    console.log("saving logo locations");

    for (let i = 0; i < this.state.allLogosFront.length; i++) {
      let currentKey = this.state.allLogosFront[i];
      let copiedLogoState = this.state[currentKey];

      copiedLogoState.logoPositionX =
        copiedLogoState.logoPositionX + copiedLogoState.offsetX;
      copiedLogoState.logoPositionY =
        copiedLogoState.logoPositionY + copiedLogoState.offsetY;
      copiedLogoState.offsetX = 0;
      copiedLogoState.offsetY = 0;
      this.setState({ [currentKey]: copiedLogoState });
    }

    for (let i = 0; i < this.state.allLogosBack.length; i++) {
      let currentKey = this.state.allLogosBack[i];
      let copiedLogoState = this.state[currentKey];

      copiedLogoState.logoPositionX =
        copiedLogoState.logoPositionX + copiedLogoState.offsetX;
      copiedLogoState.logoPositionY =
        copiedLogoState.logoPositionY + copiedLogoState.offsetY;
      copiedLogoState.offsetX = 0;
      copiedLogoState.offsetY = 0;

      this.setState({ [currentKey]: copiedLogoState });
    }
  }

  renderEditAddOns() {
    console.log("in render edit add ons");
    return (
      <View
        style={{
          position: "absolute",
          left: 5,
          top: 200,
          width: 50,
          height: 30
        }}
      >
        <TouchableOpacity
          onPress={() => {
            this.setState({ editZIndexModal: true });
          }}
        >
          <Text>Edit Z Index</Text>
        </TouchableOpacity>
        {this.state.editZIndexModal ? this.renderZIndexModal() : null}
      </View>
    );
  }

  handleTestClick(item) {
    console.log("handle test click");
    console.log(item);
    console.log("z index below");
    console.log(this.state.zIndexList);
    let currentKey = item[0];
    let action = item[1];
    let zIndexCopy = this.state.zIndexList;
    let currentKeyZIndex = zIndexCopy.indexOf(currentKey);

    console.log("current Key z index below");
    console.log(currentKeyZIndex);

    if (action === "increase") {
      let itemToSwitchZIndex = currentKeyZIndex + 1;
      let switchedItem = zIndexCopy[itemToSwitchZIndex];

      zIndexCopy[itemToSwitchZIndex] = currentKey;
      zIndexCopy[currentKeyZIndex] = switchedItem;
    } else {
      let itemToSwitchZIndex = currentKeyZIndex - 1;
      let switchedItem = zIndexCopy[itemToSwitchZIndex];

      zIndexCopy[itemToSwitchZIndex] = currentKey;
      zIndexCopy[currentKeyZIndex] = switchedItem;
    }
    console.log("copy below");
    console.log(zIndexCopy);

    this.setState({ zIndexList: zIndexCopy });
  }

  renderZIndexModal() {
    console.log("in render z index modal");
    console.log(this.state.zIndexList);

    return (
      <Modal
        style={{
          justifyContent: "center",
          alignItems: "center"
        }}
        animationType="slide"
        transparent={true}
      >
        <View
          style={{
            height: "40%",
            width: "100%",
            position: "absolute",
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            borderWidth: 1
          }}
        >
          <View
            style={{ width: "100%", height: "100%", flexDirection: "column" }}
          >
            <View style={{ width: "100%", height: "10%" }}>
              <Text
                style={{ textAlign: "right", fontSize: 24, marginRight: 10 }}
                onPress={() => {
                  this.setState({ editZIndexModal: false });
                }}
              >
                X
              </Text>
            </View>
            <View style={{ width: "100%", height: "80%" }}>
              <ScrollView persistentScrollbar={true}>
                {this.state.zIndexList.map((item, index) => (
                  <View key={index}>
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity style={{ width: "30%" }}>
                        <Text>{item}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          this.handleTestClick([item, "increase"]);
                        }}
                        style={{ width: "30%" }}
                      >
                        <Text>Bring To Front</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          this.handleTestClick([item, "decrease"]);
                        }}
                        style={{ width: "30%" }}
                      >
                        <Text>Send To Back</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
            <View style={{ width: "100%", height: "10%" }}></View>
          </View>
        </View>
      </Modal>
    );
  }

  saveTextLocations() {
    console.log("saving text locations");

    for (let i = 0; i < this.state.allTextFront.length; i++) {
      let currentKey = this.state.allTextFront[i];
      let copiedTextState = this.state[currentKey];

      copiedTextState.textPositionX =
        copiedTextState.textPositionX + copiedTextState.offsetX;
      copiedTextState.textPositionY =
        copiedTextState.textPositionY + copiedTextState.offsetY;
      copiedTextState.offsetX = 0;
      copiedTextState.offsetY = 0;

      this.setState({ [currentKey]: copiedTextState });
    }

    for (let i = 0; i < this.state.allTextBack.length; i++) {
      let currentKey = this.state.allTextBack[i];
      let copiedTextState = this.state[currentKey];

      copiedTextState.textPositionX =
        copiedTextState.textPositionX + copiedTextState.offsetX;
      copiedTextState.textPositionY =
        copiedTextState.textPositionY + copiedTextState.offsetY;
      copiedTextState.offsetX = 0;
      copiedTextState.offsetY = 0;

      this.setState({ [currentKey]: copiedTextState });
    }
  }

  renderCanvas() {
    // console.log("at render canvas");
    return (
      <ViewShot
        style={{ height: "100%" }}
        ref="viewShot"
        options={{ format: "jpg", quality: 0.9 }}
      >
        <View
          style={{
            height: "100%",
            marginTop: "10%"
          }}
        >
          <Image
            style={{ flex: 1, width: undefined, height: undefined }}
            source={
              this.props.items.front
                ? {
                    uri: this.props.items.shirtUrl
                  }
                : {
                    uri: this.props.items.backShirtUrl
                  }
            }
            resizeMode="contain"
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              top: "85%",
              marginLeft: "5%"
            }}
            onPress={() => {
              this.saveLogoLocations();
              this.saveTextLocations();
              this.props.toggleFrontOrBack();
            }}
          >
            <Icon name="rotate-3d" size={50} />
          </TouchableOpacity>

          {this.state.zIndexList.length === 0
            ? null
            : this.renderLogosAndText()}
          {this.state.zIndexList.length === 0
            ? null
            : this.renderLogosToolbar()}
          {this.state.zIndexList.length === 0 ? null : this.renderText()}
          {this.state.zIndexList.length === 0 ? null : this.renderEditAddOns()}
        </View>
      </ViewShot>
    );
  }

  renderGarmentChoice() {
    return (
      <TouchableOpacity
        style={{
          width: "30%",
          marginHorizontal: 5,
          borderWidth: 2,
          borderRadius: 1,
          borderColor: "black",
          height: 100,
          justifyContent: "center",
          alignItems: "center"
        }}
        onPress={() => {
          this.setState({ showDetail: true });
          this.setState({ detailType: "garment" });
        }}
      >
        <Text style={{ textAlign: "center" }}>
          Choose Garment({currentVersion})
        </Text>
      </TouchableOpacity>
    );
  }

  renderAddOns() {
    return (
      <TouchableOpacity
        style={{
          width: "30%",
          marginHorizontal: 5,
          borderWidth: 2,
          borderRadius: 1,
          borderColor: "black",
          height: 100,
          justifyContent: "center",
          alignItems: "center"
        }}
        onPress={() => {
          this.setState({ showDetail: true });
          this.setState({ detailType: "addOn" });
        }}
      >
        <Text style={{ textAlign: "center" }}>Choose Logos/Text</Text>
      </TouchableOpacity>
    );
  }

  renderSaveProject() {
    return (
      <TouchableOpacity
        style={{
          width: "30%",
          marginHorizontal: 5,
          borderWidth: 2,
          borderRadius: 1,
          borderColor: "black",
          height: 100,
          justifyContent: "center",
          alignItems: "center"
        }}
        onPress={() => {
          this.screenshotHandler();
        }}
      >
        <Text style={{ textAlign: "center" }}>Save Project</Text>
      </TouchableOpacity>
    );
  }

  renderNonDetailOptions() {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: 200
        }}
      >
        <TouchableOpacity style={{ height: "10%", width: "100%" }}>
          <Text style={{ textAlign: "right", marginRight: 10 }}></Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {this.renderGarmentChoice()}
          {this.renderAddOns()}
          {this.renderSaveProject()}
        </View>
        <TouchableOpacity
          style={{ height: "10%", width: "100%" }}
        ></TouchableOpacity>
      </View>
    );
  }

  renderAddOnDetail() {
    return (
      <View
        style={{
          width: "100%",
          height: 200,
          alignSelf: "stretch"
        }}
      >
        <TouchableOpacity
          style={{ height: "10%", width: "100%" }}
          onPress={() => {
            this.setState({ showDetail: false });
          }}
        >
          <Text
            style={{
              textAlign: "right",
              marginRight: 10,
              position: "relative",
              marginLeft: "90%",
              fontSize: 16
            }}
          >
            X
          </Text>
        </TouchableOpacity>
        <View
          style={{
            width: "100%",
            height: "80%",
            flexDirection: "row",
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <TouchableOpacity
            style={{
              width: "30%",
              marginHorizontal: 5,
              borderWidth: 2,
              borderRadius: 1,
              borderColor: "black",
              height: 100,
              justifyContent: "center",
              alignItems: "center"
            }}
            onPress={() => {
              console.log("pressing");
              this.setState({ showLogoUploadDetail: true });
            }}
          >
            <Text style={{ textAlign: "center" }}>Upload Logo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: "30%",
              marginHorizontal: 5,
              borderWidth: 2,
              borderRadius: 1,
              borderColor: "black",
              height: 100,
              justifyContent: "center",
              alignItems: "center"
            }}
            onPress={() => {
              this.setState({ showLogoChooseDetail: true });
            }}
          >
            <Text style={{ textAlign: "center" }}>Choose Logo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: "30%",
              marginHorizontal: 5,
              borderWidth: 2,
              borderRadius: 1,
              borderColor: "black",
              height: 100,
              justifyContent: "center",
              alignItems: "center"
            }}
            onPress={() => {
              this.setState({ showTextDetail: true });
            }}
          >
            <Text style={{ textAlign: "center" }}>Add Text</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: "100%",
            height: "10%"
          }}
        ></View>
      </View>
    );
  }

  renderSwatchDetail() {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: 200
        }}
      >
        <TouchableOpacity
          style={{ height: "10%", width: "100%" }}
          onPress={() => {
            this.setState({ showDetail: false });
          }}
        >
          <Text style={{ marginLeft: "90%" }}>X</Text>
        </TouchableOpacity>
        <ScrollView>
          <View style={{ height: "80%" }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap"
              }}
            >
              {this.props.items.defaultItems.map((item, index) => (
                <TouchableOpacity
                  style={{
                    height: 40,
                    width: 40,
                    margin: 3
                  }}
                  key={index}
                  onPress={() => {
                    this.props.changeGarment(item);
                  }}
                >
                  <Image
                    style={{
                      flex: 1,
                      width: undefined,
                      height: undefined
                    }}
                    source={{
                      uri: item.swatch
                    }}
                    resizeMode="cover"
                    onError={() => {
                      console.log("error" + index);
                    }}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
        <TouchableOpacity
          style={{ height: "10%", width: "100%" }}
        ></TouchableOpacity>
      </View>
    );
  }

  renderDetailOptions() {
    // console.log("in detail options");
    if (this.state.detailType === "garment") {
      return this.renderSwatchDetail();
    } else if (this.state.detailType === "addOn") {
      return this.renderAddOnDetail();
    }
  }

  renderToolbar() {
    return (
      <View>
        {this.state.showDetail
          ? this.renderDetailOptions()
          : this.renderNonDetailOptions()}
      </View>
    );
  }

  saveScaleInformation(information) {
    console.log("in remember scale at canvas");
    // console.log(information);

    // let currentKey = information[0];
    // let scale = information[1];

    // console.log(currentKey);
    // console.log(scale);
    console.log(this.state);

    // let logoCopyForScale = this.state[currentKey];
    // logoCopyForScale.widthDefault *= scale;
    // logoCopyForScale.heightDefault *= scale;
    // console.log(logoCopyForScale);

    // this.setState({ [currentKey]: logoCopyForScale });
  }

  onPinchHandler(currentKey) {
    console.log("on pinch handler canvas");

    this.onPinchHandlerStateChange(event);
  }

  renderText() {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    let offsetX = 0;
    let offsetY = 0;

    let frontOrBack = "Front";

    if (!this.props.items.front) {
      frontOrBack = "Back";
    }

    let newKey = "allText" + frontOrBack;
    // console.log("new key below");
    // console.log(newKey);
    // console.log(this.state[newKey]);
    // console.log(this.state.text1Front);

    return this.state[newKey].map((currentKey, index) => (
      <Draggable
        onPressIn={({ nativeEvent }) => {
          console.log("on press text");
          startX = nativeEvent.pageX;
          startY = nativeEvent.pageY;

          console.log(startX + "," + startY);
        }}
        onDragRelease={({ nativeEvent }) => {
          console.log("on release text");

          endX = nativeEvent.pageX;
          endY = nativeEvent.pageY;

          offsetX = endX - startX;
          offsetY = endY - startY;

          console.log(endX + "," + endY);

          let textCopy = this.state[currentKey];
          textCopy.offsetX = textCopy.offsetX + offsetX;
          textCopy.offsetY = textCopy.offsetY + offsetY;

          this.setState({ [currentKey]: textCopy });
        }}
        x={this.state[currentKey].textPositionX}
        y={this.state[currentKey].textPositionY}
        key={frontOrBack + currentKey}
      >
        <View
          style={{
            margin: 5
          }}
        >
          {/* <PinchableBox
            uri={this.state[currentKey].url}
            height={this.state[currentKey].heightDefault}
            width={this.state[currentKey].widthDefault}
            currentKey={currentKey}
          /> */}

          {/* <PinchGestureHandler
            ref={this.pinchRef}
            onGestureEvent={this._onPinchGestureEvent}
            onHandlerStateChange={this.onPinchHandlerStateChange.bind(
              this,
              currentKey
            )}
          >
            <Animated.Image
              style={{
                height: this.state[currentKey].heightDefault,
                width: this.state[currentKey].widthDefault,

                transform: [
                  { perspective: 200 },
                  {
                    scale: this._scale
                  },
                  { rotate: this._rotateStr },
                  { rotateX: this._tiltStr }
                ]
              }}
              source={{
                uri: this.state[currentKey].url
              }}
            />
          </PinchGestureHandler> */}

          <Text
            style={{
              fontFamily: this.state[currentKey].font,
              fontSize: this.state[currentKey].fontSize,
              color: this.state[currentKey].color,
              zIndex: this.state.zIndexList.indexOf(currentKey) + 1
            }}
          >
            {this.state[currentKey].textValue}
          </Text>
        </View>
      </Draggable>
    ));
  }

  renderLogosAndText() {
    console.log("in render logos and text");

    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    let offsetX = 0;
    let offsetY = 0;

    let frontOrBack = "Front";

    if (!this.props.items.front) {
      frontOrBack = "Back";
    }

    let newKey = "allLogos" + frontOrBack;

    console.log("z index list below");
    console.log(this.state.zIndexList);

    return this.state.zIndexList.map((currentKey, index) => (
      <Draggable
        onPressIn={({ nativeEvent }) => {
          console.log("on press");
          startX = nativeEvent.pageX;
          startY = nativeEvent.pageY;

          console.log(startX + "," + startY);
        }}
        onDragRelease={({ nativeEvent }) => {
          console.log("on release");

          endX = nativeEvent.pageX;
          endY = nativeEvent.pageY;

          offsetX = endX - startX;
          offsetY = endY - startY;

          console.log(endX + "," + endY);

          let logoCopy = this.state[currentKey];
          logoCopy.offsetX = logoCopy.offsetX + offsetX;
          logoCopy.offsetY = logoCopy.offsetY + offsetY;

          this.setState({ [currentKey]: logoCopy });
        }}
        x={this.state[currentKey].logoPositionX}
        y={this.state[currentKey].logoPositionY}
        key={frontOrBack + currentKey}
      >
        <View
          style={{
            width: this.state[currentKey].widthDefault,
            height: this.state[currentKey].heightDefault,
            margin: 5
          }}
        >
          <Image
            style={{
              flex: 1,
              width: undefined,
              height: undefined
            }}
            source={{
              uri: this.state[currentKey].url
            }}
            resizeMode="contain"
          />
        </View>
      </Draggable>
    ));
  }
  renderLogos() {
    console.log("in render logos");

    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    let offsetX = 0;
    let offsetY = 0;

    let frontOrBack = "Front";

    if (!this.props.items.front) {
      frontOrBack = "Back";
    }

    let newKey = "allLogos" + frontOrBack;
    console.log(newKey);
    console.log(this.state[newKey]);

    return this.state[newKey].map((currentKey, index) => (
      <Draggable
        style={{
          zIndex: currentKey === "logo1Front" ? 5 : 1
        }}
        onPressIn={({ nativeEvent }) => {
          console.log("on press");
          startX = nativeEvent.pageX;
          startY = nativeEvent.pageY;

          console.log(startX + "," + startY);
        }}
        onDragRelease={({ nativeEvent }) => {
          console.log("on release");

          endX = nativeEvent.pageX;
          endY = nativeEvent.pageY;

          offsetX = endX - startX;
          offsetY = endY - startY;

          console.log(endX + "," + endY);

          let logoCopy = this.state[currentKey];
          logoCopy.offsetX = logoCopy.offsetX + offsetX;
          logoCopy.offsetY = logoCopy.offsetY + offsetY;

          this.setState({ [currentKey]: logoCopy });
        }}
        x={this.state[currentKey].logoPositionX}
        y={this.state[currentKey].logoPositionY}
        key={frontOrBack + currentKey}
      >
        <View
          style={{
            width: this.state[currentKey].widthDefault,
            height: this.state[currentKey].heightDefault,
            margin: 5,
            zIndex: currentKey === "logo1Front" ? 5 : 1
          }}
        >
          {/* <PinchableBox
            uri={this.state[currentKey].url}
            height={this.state[currentKey].heightDefault}
            width={this.state[currentKey].widthDefault}
            currentKey={currentKey}
          /> */}

          {/* <PinchGestureHandler
            ref={this.pinchRef}
            onGestureEvent={this._onPinchGestureEvent}
            onHandlerStateChange={this.onPinchHandlerStateChange.bind(
              this,
              currentKey
            )}
          >
            <Animated.Image
              style={{
                height: this.state[currentKey].heightDefault,
                width: this.state[currentKey].widthDefault,

                transform: [
                  { perspective: 200 },
                  {
                    scale: this._scale
                  },
                  { rotate: this._rotateStr },
                  { rotateX: this._tiltStr }
                ]
              }}
              source={{
                uri: this.state[currentKey].url
              }}
            />
          </PinchGestureHandler> */}
          <Image
            style={{
              flex: 1,
              width: undefined,
              height: undefined,
              zIndex: currentKey === "logo1Front" ? 5 : 1
            }}
            source={{
              uri: this.state[currentKey].url
            }}
            resizeMode="contain"
          />
        </View>
      </Draggable>
    ));
  }

  renderLogosToolbar() {
    // console.log("render logos toolbar");

    let frontOrBack = "Front";

    if (!this.props.items.front) {
      frontOrBack = "Back";
    }

    let newKey = "allLogos" + frontOrBack;

    const userLogos = this.state[newKey];

    return (
      <View
        style={{
          position: "absolute",
          top: 190,
          right: 20,
          width: 70
        }}
      >
        <View>
          {userLogos.map((currentKey, index) => (
            <View key={currentKey}>
              <Text>{currentKey}</Text>
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: "50%" }}>
                  <Text
                    onPress={() => {
                      let copiedLogo = this.state[currentKey];

                      copiedLogo.widthDefault =
                        copiedLogo.widthDefault * this.state.logoChangeScalar;
                      copiedLogo.heightDefault =
                        copiedLogo.heightDefault * this.state.logoChangeScalar;

                      this.setState({ [currentKey]: copiedLogo });
                    }}
                  >
                    Inc
                  </Text>
                </View>
                <View style={{ width: "50%" }}>
                  <Text
                    onPress={() => {
                      let copiedLogo = this.state[currentKey];

                      copiedLogo.widthDefault =
                        copiedLogo.widthDefault / this.state.logoChangeScalar;
                      copiedLogo.heightDefault =
                        copiedLogo.heightDefault / this.state.logoChangeScalar;

                      this.setState({ [currentKey]: copiedLogo });
                    }}
                  >
                    Dec
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }

  chooseLogo(item) {
    console.log("choose logo at canvas");

    let frontOrBack = "Front";

    if (!this.props.items.front) {
      frontOrBack = "Back";
    }

    let newKeyAll = "allLogos" + frontOrBack;
    let newKeyAllState = this.state[newKeyAll];
    let currentKey = "";

    if (newKeyAllState.indexOf("logo1" + frontOrBack) === -1) {
      currentKey = "logo1" + frontOrBack;
    } else if (newKeyAllState.indexOf("logo2" + frontOrBack) === -1) {
      currentKey = "logo2" + frontOrBack;
    } else if (newKeyAllState.indexOf("logo3" + frontOrBack) === -1) {
      currentKey = "logo3" + frontOrBack;
    } else if (newKeyAllState.indexOf("logo4" + frontOrBack) === -1) {
      currentKey = "logo4" + frontOrBack;
    } else if (newKeyAllState.indexOf("logo5" + frontOrBack) === -1) {
      currentKey = "logo5" + frontOrBack;
    } else if (newKeyAllState.indexOf("logo6" + frontOrBack) === -1) {
      currentKey = "logo6" + frontOrBack;
    } else {
    }

    this.setState({
      [currentKey]: {
        url: item[0].url,
        logoPositionX: item[0].defaultLogoPositionX,
        logoPositionY: item[0].defaultLogoPositionY,
        height: item[0].height,
        heightDefault: item[0].heightDefault,
        width: item[0].width,
        widthDefault: item[0].widthDefault,
        offsetX: 0,
        offsetY: 0,
        scale: 1
      }
    });
    this.setState({
      [newKeyAll]: [...newKeyAllState, currentKey]
    });
    this.setState({ zIndexList: [...this.state.zIndexList, currentKey] });
  }

  chooseText(item) {
    console.log("choose text at canvas");

    let frontOrBack = "Front";

    if (!this.props.items.front) {
      frontOrBack = "Back";
    }

    let newKeyAll = "allText" + frontOrBack;
    let newKeyAllState = this.state[newKeyAll];
    let currentKey = "";

    if (newKeyAllState.indexOf("text1" + frontOrBack) === -1) {
      currentKey = "text1" + frontOrBack;
    } else if (newKeyAllState.indexOf("text2" + frontOrBack) === -1) {
      currentKey = "text2" + frontOrBack;
    } else if (newKeyAllState.indexOf("text3" + frontOrBack) === -1) {
      currentKey = "text3" + frontOrBack;
    } else if (newKeyAllState.indexOf("text4" + frontOrBack) === -1) {
      currentKey = "text4" + frontOrBack;
    } else if (newKeyAllState.indexOf("text5" + frontOrBack) === -1) {
      currentKey = "text5" + frontOrBack;
    } else if (newKeyAllState.indexOf("text6" + frontOrBack) === -1) {
      currentKey = "text6" + frontOrBack;
    } else {
    }

    this.setState({
      [currentKey]: {
        font: item,
        textPositionX: 200,
        textPositionY: 200,
        height: 30,
        heightDefault: 30,
        width: 100,
        widthDefault: 100,
        offsetX: 0,
        offsetY: 0,
        scale: 1,
        textValue: this.state.currentText,
        fontSize: 20,
        color: this.state.currentTextColor
      }
    });
    this.setState({
      [newKeyAll]: [...newKeyAllState, currentKey]
    });
    this.setState({ zIndexList: [...this.state.zIndexList, currentKey] });
  }

  renderZIndexChooser() {
    console.log("in render z index chooser");
    console.log(this.state.zIndexList);
    return (
      <View
        style={{
          position: "absolute",
          marginTop: 200,
          background: "red",
          width: 100,
          height: 100
        }}
      >
        {this.state.zIndexList.map((item, index) => {
          <View>
            <Text>
              {item}: {index}
            </Text>
          </View>;
        })}
      </View>
    );
  }

  renderLoadingModal() {
    return (
      <Modal
        style={{ height: "100%" }}
        animationType="slide"
        transparent={true}
      >
        <View
          style={{
            height: "100%",
            width: "100%",
            top: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white"
          }}
        >
          <ActivityIndicator animating={true} size="large" color="#0000ff" />
        </View>
      </Modal>
    );
  }

  renderTextModal() {
    return (
      <Modal
        style={{
          justifyContent: "center",
          alignItems: "center"
        }}
        animationType="slide"
        transparent={true}
      >
        <View
          style={{
            height: "80%",
            width: "80%",
            marginTop: "10%",
            marginLeft: "10%",
            top: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            borderWidth: 1
          }}
        >
          <View
            style={{ width: "100%", height: "100%", flexDirection: "column" }}
          >
            <View style={{ width: "100%", height: "10%" }}>
              <Text
                style={{ textAlign: "right", fontSize: 24, marginRight: 10 }}
                onPress={() => {
                  this.setState({ showTextDetail: false });
                }}
              >
                X
              </Text>
            </View>
            <View style={{ width: "80%", height: "10%", marginLeft: "10%" }}>
              <ScrollView horizontal={true} persistentScrollbar={true}>
                {colors.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      this.setState({ currentTextColor: item });
                    }}
                    style={
                      this.state.currentTextColor === item
                        ? {
                            width: 50,
                            height: 50,
                            marginHorizontal: 5,
                            backgroundColor: item
                          }
                        : {
                            width: 40,
                            height: 40,
                            marginHorizontal: 5,
                            backgroundColor: item
                          }
                    }
                  ></TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={{ width: "90%", height: "80%", marginLeft: "10%" }}>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderRadius: 5,
                  height: 30,
                  width: "80%",
                  paddingHorizontal: 10,
                  color: this.state.currentTextColor
                }}
                value={this.state.currentText}
                onChangeText={value => this.setState({ currentText: value })}
                placeholder="Enter Text Here"
                autoCapitalize="none"
              />
              <ScrollView>
                {defaultTextOptions.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      this.chooseText(item);
                      this.setState({ currentText: "" });
                      this.setState({ currentTextColor: colors[0] });
                      this.setState({ showTextDetail: false });
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <View style={{ width: "40%" }}>
                        <Text
                          style={{
                            fontFamily: item,
                            margin: 5
                          }}
                        >
                          {item}:
                        </Text>
                      </View>
                      <View style={{ width: "60%" }}>
                        <Text
                          style={{
                            fontFamily: item,
                            color: this.state.currentTextColor,
                            margin: 5
                          }}
                        >
                          {this.state.currentText}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  renderChooseLogoModal() {
    let allLogos = [];
    console.log("in render choose logo modal");

    if (!this.props.user.logos) {
    } else {
      allLogos = Object.keys(this.props.user.logos);
    }

    return (
      <Modal
        style={{
          justifyContent: "center",
          alignItems: "center"
        }}
        animationType="slide"
        transparent={true}
      >
        <View
          style={{
            height: "80%",
            width: "80%",
            marginTop: "10%",
            marginLeft: "10%",
            top: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            borderWidth: 1
          }}
        >
          <View
            style={{ width: "100%", height: "100%", flexDirection: "column" }}
          >
            <View style={{ width: "100%", height: "10%" }}>
              <Text
                style={{ textAlign: "right", fontSize: 24, marginRight: 10 }}
                onPress={() => {
                  this.setState({ showLogoChooseDetail: false });
                }}
              >
                X
              </Text>
            </View>
            <View style={{ width: "100%", height: "90%" }}>
              <ScrollView>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {allLogos.map((item, index) => (
                    <TouchableOpacity
                      style={{
                        height: this.props.user.logos[item].heightDefault,
                        width: this.props.user.logos[item].widthDefault,
                        margin: 5,
                        borderWidth: 1
                      }}
                      key={index}
                      onPress={() => {
                        this.chooseLogo([this.props.user.logos[item], item]);
                        this.setState({ showLogoChooseDetail: false });
                      }}
                    >
                      <Image
                        style={{ flex: 1, width: undefined, height: undefined }}
                        source={{
                          uri: this.props.user.logos[item].url
                        }}
                        resizeMode="contain"
                        onError={() => {
                          console.log("error" + index);
                        }}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  renderUploadLogoModal() {
    console.log("in upload logo choose modal");
    return (
      <Modal
        style={{
          justifyContent: "center",
          alignItems: "center"
        }}
        animationType="slide"
        transparent={true}
      >
        <View
          style={{
            height: "80%",
            width: "80%",
            marginTop: "10%",
            marginLeft: "10%",
            top: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            borderWidth: 1
          }}
        >
          <View
            style={{ width: "100%", height: "100%", flexDirection: "column" }}
          >
            <View style={{ width: "100%", height: "40%" }}>
              <Text
                style={{ textAlign: "right", fontSize: 24, marginRight: 10 }}
                onPress={() => {
                  this.setState({ showLogoUploadDetail: false });
                }}
              >
                X
              </Text>
            </View>
            <View style={{ width: "100%", height: "20%" }}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <ImagePickerComponent />
              </View>
            </View>
            <View style={{ width: "100%", height: "40%" }}></View>
          </View>
        </View>
      </Modal>
    );
  }

  render() {
    return (
      <View>
        {this.props.loading ? this.renderLoadingModal() : null}

        {this.state.showTextDetail ? this.renderTextModal() : null}
        {this.state.showLogoChooseDetail ? this.renderChooseLogoModal() : null}
        {this.state.showLogoUploadDetail ? this.renderUploadLogoModal() : null}
        <View style={{ height: "70%", width: "100%" }}>
          {this.renderCanvas()}
        </View>

        <View
          style={{
            height: "30%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {this.renderToolbar()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "red"
  },
  wrapper: {
    flex: 1
  }
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      changeGarment,
      toggleLoading,
      login,
      getLogos,
      changeLogoDimensions,
      toggleFrontOrBack,
      setCurrentScale
    },
    dispatch
  );
};

const mapStateToProps = state => {
  return {
    items: state.items,
    loading: state.loading,
    user: state.user
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Canvas);

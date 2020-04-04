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
  Animated
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

class Canvas extends React.Component {
  panRef = React.createRef();
  rotationRef = React.createRef();
  pinchRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      imageUri: "",
      showDetail: false,
      detailType: "",
      showLogoUploadDetail: false,
      showLogoChooseDetail: false,
      showTextDetail: false,
      defaultItems: {},
      logoChangeScalar: 1.1,
      currentScale: 1,
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
      allLogosFront: [],
      allLogosBack: []
    };

    /* Pinching */
    this._baseScale = new Animated.Value(1);
    this._pinchScale = new Animated.Value(1);
    this._scale = Animated.multiply(this._baseScale, this._pinchScale);
    this._lastScale = 1;
    this._onPinchGestureEvent = Animated.event(
      [{ nativeEvent: { scale: this._pinchScale } }],
      { useNativeDriver: true }
    );

    /* Rotation */
    this._rotate = new Animated.Value(0);
    this._rotateStr = this._rotate.interpolate({
      inputRange: [-100, 100],
      outputRange: ["-100rad", "100rad"]
    });
    this._lastRotate = 0;
    this._onRotateGestureEvent = Animated.event(
      [{ nativeEvent: { rotation: this._rotate } }],
      { useNativeDriver: true }
    );

    /* Tilt */
    this._tilt = new Animated.Value(0);
    this._tiltStr = this._tilt.interpolate({
      inputRange: [-501, -500, 0, 1],
      outputRange: ["1rad", "1rad", "0rad", "0rad"]
    });
    this._lastTilt = 0;
    this._onTiltGestureEvent = Animated.event(
      [{ nativeEvent: { translationY: this._tilt } }],
      { useNativeDriver: true }
    );

    this.onRotateHandlerStateChange = this.onRotateHandlerStateChange.bind(
      this
    );
    this.onPinchHandlerStateChange = this.onPinchHandlerStateChange.bind(this);
  }

  onRotateHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastRotate += event.nativeEvent.rotation;
      this._rotate.setOffset(this._lastRotate);
      this._rotate.setValue(0);
    }
  };

  onPinchHandlerStateChange = event => {
    console.log("pinch handler");
    console.log(this.state);
    console.log(event);
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastScale *= event.nativeEvent.scale;
      this._baseScale.setValue(this._lastScale);
      this._pinchScale.setValue(1);
    }
  };
  _onTiltGestureStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastTilt += event.nativeEvent.translationY;
      this._tilt.setOffset(this._lastTilt);
      this._tilt.setValue(0);
    }
  };

  async componentDidMount() {
    // this.props.toggleLoading(true);
    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await this.props.login();
    await this.props.getLogos();
    // this.props.toggleLoading(false);
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
              this.props.toggleFrontOrBack();
            }}
          >
            <Icon name="rotate-3d" size={50} />
          </TouchableOpacity>

          {this.renderLogos()}
          {this.renderLogosToolbar()}
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
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: 200
          // backgroundColor: "pink"
        }}
      >
        {this.renderUploadLogoModal()}
        {this.renderChooseLogoModal()}
        <TouchableOpacity
          style={{
            height: "10%",
            width: "100%"
            // backgroundColor: "blue"
          }}
          onPress={() => {
            this.setState({ showDetail: false });
          }}
        >
          <Text style={{ textAlign: "right", marginRight: 10 }}>X</Text>
        </TouchableOpacity>

        <View
          style={{
            height: "80%",
            // backgroundColor: "yellow",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              // backgroundColor: "red",
              borderWidth: 1,
              borderRadius: 5,
              height: "100%"
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: "30%"
                // backgroundColor: "white"
              }}
            >
              <Text
                style={{
                  width: "100%",
                  height: "100%",
                  textAlign: "center",
                  // backgroundColor: "grey",
                  flex: 1
                }}
                onPress={() => {
                  this.setState({ showLogoUploadDetail: true });
                }}
              >
                Upload Logo
              </Text>
            </View>
            <Text
              style={{
                width: "30%",
                height: "80%",
                textAlign: "center"
              }}
              onPress={() => {
                this.setState({ showLogoChooseDetail: true });
              }}
            >
              Choose Logo
            </Text>
            <Text
              style={{
                width: "30%",
                height: "80%",
                textAlign: "center"
              }}
              onPress={() => {
                this.setState({ showTextDetail: true });
              }}
            >
              Choose Text
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={{
            height: "10%",
            width: "100%"
            // backgroundColor: "green"
          }}
        ></TouchableOpacity>
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
          <Text style={{ textAlign: "right", marginRight: 10 }}>X</Text>
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
                    // this.setState({ showDetail: false });
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
        <View>
          {this.state.showDetail
            ? this.renderDetailOptions()
            : this.renderNonDetailOptions()}
        </View>
      </View>
    );
  }

  renderUploadLogoModal() {
    return (
      <Modal
        style={{ height: "100%" }}
        animationType="slide"
        transparent={true}
        visible={this.state.showLogoUploadDetail}
      >
        <View
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            top: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white"
          }}
        >
          <View>
            <Text>In Show Logo Upload Modal</Text>
            <Text
              onPress={() => {
                this.setState({ showLogoUploadDetail: false });
              }}
            >
              Close
            </Text>
            <ImagePickerComponent />
          </View>
        </View>
      </Modal>
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

  renderLogos() {
    console.log("in render logos");
    console.log(this.state);

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

    return this.state[newKey].map((currentKey, index) => (
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
          // console.log(logoCopy);
          logoCopy.offsetX = logoCopy.offsetX + offsetX;
          logoCopy.offsetY = logoCopy.offsetY + offsetY;
          // console.log(logoCopy);

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
          {/* <PinchableBox
            uri={this.state[currentKey].url}
            height={this.state[currentKey].heightDefault}
            width={this.state[currentKey].widthDefault}
            currentKey={currentKey}
          /> */}

          {/* <PinchGestureHandler
            ref={this.pinchRef}
            onGestureEvent={this._onPinchGestureEvent}
            onHandlerStateChange={this.onPinchHandlerStateChange}
          >
            <Animated.Image
              style={{
                height: this.state[currentKey].heightDefault,
                width: this.state[currentKey].widthDefault,

                transform: [
                  { perspective: 200 },
                  { scale: this._scale },
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
            style={{ flex: 1, width: undefined, height: undefined }}
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
    console.log("render logos toolbar");

    let frontOrBack = "Front";

    if (!this.props.items.front) {
      frontOrBack = "Back";
    }

    let newKey = "allLogos" + frontOrBack;

    console.log(newKey);

    const userLogos = this.state[newKey];
    const logoKeys = Object.keys(userLogos);

    // console.log(userLogos);
    // console.log(logoKeys);

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
            <View>
              <Text>{currentKey}</Text>
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: "50%" }}>
                  <Text
                    onPress={() => {
                      let copiedLogo = this.state[currentKey];
                      console.log(copiedLogo);
                      copiedLogo.widthDefault =
                        copiedLogo.widthDefault * this.state.logoChangeScalar;
                      copiedLogo.heightDefault =
                        copiedLogo.heightDefault * this.state.logoChangeScalar;
                      console.log(copiedLogo);

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
                      console.log(copiedLogo);
                      copiedLogo.widthDefault =
                        copiedLogo.widthDefault / this.state.logoChangeScalar;
                      copiedLogo.heightDefault =
                        copiedLogo.heightDefault / this.state.logoChangeScalar;
                      console.log(copiedLogo);

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
    // console.log(item);
    // console.log(this.state.allLogosFront);

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
    console.log("add logo key below");
    console.log(currentKey);

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
  }

  renderChooseLogoModal() {
    let allLogos = [];
    // console.log("in render choose logo modal");

    if (!this.props.user.logos) {
      // console.log("currently no logos at choose logo modal");
    } else {
      // console.log("at least one logo at choose logo modal");
      // console.log(this.props.user.logos);

      allLogos = Object.keys(this.props.user.logos);
      // console.log(allLogos);
    }

    return (
      <Modal
        style={{ height: "100%" }}
        animationType="slide"
        transparent={true}
        visible={this.state.showLogoChooseDetail}
      >
        <View
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            top: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white"
          }}
        >
          <View>
            <Text>In Show Logo Choose Modal</Text>
            <Text
              onPress={() => {
                this.setState({ showLogoChooseDetail: false });
              }}
            >
              Close
            </Text>

            {!allLogos ? (
              <View>
                <Text>No Logos</Text>
              </View>
            ) : (
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
            )}
          </View>
        </View>
      </Modal>
    );
  }

  renderModal() {
    return (
      <Modal
        style={{ height: "100%" }}
        animationType="slide"
        transparent={true}
        visible={this.props.loading}
      >
        <View
          style={{
            position: "absolute",
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

  render() {
    return (
      <View>
        {this.renderModal()}
        <View style={{ height: "70%" }}>{this.renderCanvas()}</View>

        <View
          style={{
            height: "30%",
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

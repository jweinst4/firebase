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
  TextInput,
  Dimensions
} from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as Permissions from "expo-permissions";
import Draggable from "react-native-draggable";
import ViewShot from "react-native-view-shot";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import ImagePickerComponent from "../components/ImagePickerComponent";
import { screenShotUtility } from "../utilities/screenShotUtility";

import { toggleLoading } from "../actions/loading";
import { login, getLogos } from "../actions/user";
import {
  changeGarment,
  changeLogoDimensions,
  toggleFrontOrBack,
  setCurrentScale
} from "../actions/items";

let currentVersion = "v7";

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
      textChangeScalar: 1.1,
      currentScale: 1,
      allLogosFront: [],
      allLogosBack: [],
      allTextFront: [],
      allTextBack: [],
      currentText: "",
      currentTextColor: colors[0],
      zIndexList: [],
      editZIndexModal: false,
      editLogoAndTextSizeModal: false,
      splitScreenView: false,
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
  }

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
    console.log(this.state.splitScreenView);

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
      <TouchableOpacity
        onPress={() => {
          this.setState({ editZIndexModal: true });
        }}
      >
        <Text style={{ fontSize: 12 }}>Edit Logo/</Text>
        <Text style={{ fontSize: 12 }}>Text Details</Text>
      </TouchableOpacity>
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

  renderLogoAndTextSizeModal() {
    console.log("in logo and text size modal");

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
            backgroundColor: "pink",
            borderWidth: 1,
            justifyContent: "center"
          }}
        >
          <View
            style={{
              height: "100%",
              width: "100%",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            <View style={{ height: "10%", justifyContent: "center" }}>
              <Text
                style={{ textAlign: "right", fontSize: 24, marginRight: 10 }}
                onPress={() => {
                  this.setState({ editLogoAndTextSizeModal: false });
                }}
              >
                X
              </Text>
            </View>
            <View
              style={{
                height: "80%",
                width: "100%",
                justifyContent: "center",
                backgroundColor: "orange"
              }}
            >
              <ScrollView persistentScrollbar={true}>
                {this.state.zIndexList.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      backgroundColor: "green"
                    }}
                  >
                    <View style={{ width: "20%", backgroundColor: "red" }}>
                      <Text>{item}</Text>
                    </View>
                    <View style={{ width: "40%", backgroundColor: "blue" }}>
                      <Text
                        onPress={() => {
                          let copiedLogo = this.state[item];
                          if (item.includes("logo")) {
                            copiedLogo.widthDefault =
                              copiedLogo.widthDefault *
                              this.state.logoChangeScalar;
                            copiedLogo.heightDefault =
                              copiedLogo.heightDefault *
                              this.state.logoChangeScalar;
                          } else {
                            copiedLogo.fontSize *= this.state.textChangeScalar;
                          }
                          console.log(item);
                          console.log(copiedLogo);

                          this.setState({ [item]: copiedLogo });
                        }}
                      >
                        Inc
                      </Text>
                    </View>
                    <View style={{ width: "40%", backgroundColor: "yellow" }}>
                      <Text
                        onPress={() => {
                          let copiedLogo = this.state[item];
                          if (item.includes("logo")) {
                            copiedLogo.widthDefault =
                              copiedLogo.widthDefault /
                              this.state.logoChangeScalar;
                            copiedLogo.heightDefault =
                              copiedLogo.heightDefault /
                              this.state.logoChangeScalar;
                          } else {
                            copiedLogo.fontSize /= this.state.textChangeScalar;
                          }
                          console.log(item);
                          console.log(copiedLogo);

                          this.setState({ [item]: copiedLogo });
                        }}
                      >
                        Dec
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
            <View style={{ height: "10%" }}></View>
          </View>
        </View>
      </Modal>
    );
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
            borderWidth: 1,
            justifyContent: "center"
          }}
        >
          <View
            style={{
              height: "100%",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            <View style={{ height: "10%", justifyContent: "center" }}>
              <Text
                style={{ textAlign: "right", fontSize: 24, marginRight: 10 }}
                onPress={() => {
                  this.setState({ editZIndexModal: false });
                }}
              >
                X
              </Text>
            </View>
            <View style={{ height: "80%", justifyContent: "center" }}>
              <ScrollView persistentScrollbar={true}>
                {this.state.zIndexList.map((item, index) => (
                  <View key={index}>
                    <View
                      style={{ flexDirection: "row", justifyContent: "center" }}
                    >
                      <TouchableOpacity
                        style={{ width: "20%", justifyContent: "center" }}
                      >
                        <Text>{item}</Text>
                      </TouchableOpacity>
                      {index === this.state.zIndexList.length - 1 ? (
                        <TouchableOpacity
                          style={{
                            width: "20%",
                            justifyContent: "center",
                            opacity: 0.2
                          }}
                        >
                          <Text>Bring To Front</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            this.handleTestClick([item, "increase"]);
                          }}
                          style={{ width: "20%", justifyContent: "center" }}
                        >
                          <Text>Bring To Front</Text>
                        </TouchableOpacity>
                      )}
                      {index === 0 ? (
                        <TouchableOpacity
                          style={{
                            width: "20%",
                            justifyContent: "center",
                            opacity: 0.2
                          }}
                        >
                          <Text>Send To Back</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            this.handleTestClick([item, "decrease"]);
                          }}
                          style={{ width: "20%", justifyContent: "center" }}
                        >
                          <Text>Send To Back</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={{ width: "20%", justifyContent: "center" }}
                      >
                        <Text
                          onPress={() => {
                            let copiedLogo = this.state[item];
                            if (item.includes("logo")) {
                              copiedLogo.widthDefault =
                                copiedLogo.widthDefault *
                                this.state.logoChangeScalar;
                              copiedLogo.heightDefault =
                                copiedLogo.heightDefault *
                                this.state.logoChangeScalar;
                            } else {
                              copiedLogo.fontSize *= this.state.textChangeScalar;
                            }
                            console.log(item);
                            console.log(copiedLogo);

                            this.setState({ [item]: copiedLogo });
                          }}
                        >
                          Inc
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{ width: "20%", justifyContent: "center" }}
                      >
                        <Text
                          onPress={() => {
                            let copiedLogo = this.state[item];
                            if (item.includes("logo")) {
                              copiedLogo.widthDefault =
                                copiedLogo.widthDefault /
                                this.state.logoChangeScalar;
                              copiedLogo.heightDefault =
                                copiedLogo.heightDefault /
                                this.state.logoChangeScalar;
                            } else {
                              copiedLogo.fontSize /= this.state.textChangeScalar;
                            }
                            console.log(item);
                            console.log(copiedLogo);

                            this.setState({ [item]: copiedLogo });
                          }}
                        >
                          Dec
                        </Text>
                      </TouchableOpacity>

                      {/* <TouchableOpacity
                          onPress={() => {
                            this.handleTestClick([item, "decrease"]);
                          }}
                          style={{ width: "20%", justifyContent: "center" }}
                        >
                          <Text>Send To Back</Text>
                        </TouchableOpacity> */}
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
            <View style={{ height: "10%" }}></View>
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

  renderCanvas(val) {
    // console.log("at render canvas");
    // console.log(this.props.items.front);
    let screenWidth = Dimensions.get("window").width;
    let screenHeight = Dimensions.get("window").height;
    // console.log(val);

    let canvasWidth = screenWidth;
    // let canvasHeight = screenHeight * 1;
    let canvasHeight = screenHeight * 0.5;
    // if (this.state.splitScreenView) {
    //   // canvasHeight = screenHeight * 1;
    //   canvasHeight = 0.5 * screenHeight;
    // }

    return (
      <ViewShot
        style={
          this.state.splitScreenView
            ? {
                width: canvasWidth,
                height: canvasHeight
              }
            : {
                width: canvasWidth,
                height: canvasHeight,
                transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
                marginTop: 100
              }
        }
        ref="viewShot"
        options={{ format: "jpg", quality: 0.9 }}
      >
        <View
          style={{
            height: "100%"
          }}
        >
          <Image
            style={{ flex: 1, width: undefined, height: undefined }}
            source={
              val
                ? {
                    uri: this.props.items.shirtUrl
                  }
                : {
                    uri: this.props.items.backShirtUrl
                  }
            }
            resizeMode="contain"
          />

          {this.state.splitScreenView ? null : (
            <TouchableOpacity
              style={{
                position: "absolute",
                top: "85%",
                marginLeft: "15%"
              }}
              onPress={() => {
                this.saveLogoLocations();
                this.saveTextLocations();
                this.props.toggleFrontOrBack();
              }}
            >
              <Icon name="rotate-3d" size={50} />
            </TouchableOpacity>
          )}
          {this.state.splitScreenView ? null : this.state.zIndexList.length ===
            0 ? null : (
            <TouchableOpacity
              style={{
                position: "absolute",
                top: "65%",
                marginLeft: "15%"
              }}
              onPress={() => {
                console.log("pressed");
              }}
            >
              {this.renderEditAddOns()}
            </TouchableOpacity>
          )}
          {this.state.editZIndexModal ? this.renderZIndexModal() : null}
          {this.state.editLogoAndTextSizeModal
            ? this.renderLogoAndTextSizeModal()
            : null}

          {this.state.zIndexList.length === 0
            ? null
            : this.renderLogosAndText(val)}
          {/* {this.state.zIndexList.length === 0
            ? null
            : this.renderLogosToolbar()} */}
          {/* {this.state.zIndexList.length === 0 ? null : this.renderEditAddOns()} */}
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

  renderAcceptedBorder() {
    return (
      <View>
        <View
          style={{
            position: "absolute",
            left: 200,
            width: 50,
            height: 50,
            top: -200,
            backgroundColor: "red"
          }}
        ></View>
      </View>
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
        onPress={() => {
          this.saveLogoLocations();
          this.saveTextLocations();
          this.setState({ splitScreenView: true });
        }}
      >
        <Text style={{ textAlign: "center" }}>Save Project Preview</Text>
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "95%",
            marginLeft: "2.5%"
          }}
        >
          {this.renderGarmentChoice()}
          {this.renderAddOns()}
          {this.renderSaveProject()}
        </View>
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

  renderLogosAndText(val) {
    // console.log("in render logos and text");
    // console.log(val);

    // console.log(this.state.splitScreenView);
    // console.log(this.state.logo1Front);

    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    let offsetX = 0;
    let offsetY = 0;

    let frontOrBack = "Front";

    if (!val) {
      frontOrBack = "Back";
    }

    let newKey = "allLogos" + frontOrBack;

    console.log("z index list below");
    console.log(this.state.zIndexList);

    return this.state.zIndexList.map((currentKey, index) =>
      !currentKey.includes(frontOrBack) ? null : currentKey.includes("logo") ? (
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
          x={
            this.state.splitScreenView
              ? this.state[currentKey].logoPositionX
              : this.state[currentKey].logoPositionX
          }
          y={
            this.state.splitScreenView
              ? this.state[currentKey].logoPositionY
              : this.state[currentKey].logoPositionY
          }
          key={frontOrBack + currentKey}
        >
          <View
            style={
              this.state.splitScreenView
                ? {
                    width: this.state[currentKey].widthDefault,
                    height: this.state[currentKey].heightDefault,
                    margin: 5
                  }
                : {
                    width: this.state[currentKey].widthDefault,
                    height: this.state[currentKey].heightDefault,
                    margin: 5
                  }
            }
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
      ) : (
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
          x={
            this.state.splitScreenView
              ? this.state[currentKey].textPositionX
              : this.state[currentKey].textPositionX
          }
          y={
            this.state.splitScreenView
              ? this.state[currentKey].textPositionY
              : this.state[currentKey].textPositionY
          }
          key={frontOrBack + currentKey}
        >
          <Text
            style={
              this.state.splitScreenView
                ? {
                    fontFamily: this.state[currentKey].font,
                    fontSize: this.state[currentKey].fontSize,
                    color: this.state[currentKey].color,
                    zIndex: this.state.zIndexList.indexOf(currentKey) + 1
                  }
                : {
                    fontFamily: this.state[currentKey].font,
                    fontSize: this.state[currentKey].fontSize,
                    color: this.state[currentKey].color,
                    zIndex: this.state.zIndexList.indexOf(currentKey) + 1
                  }
            }
          >
            {this.state[currentKey].textValue}
          </Text>
        </Draggable>
      )
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
      <View
        style={{
          // backgroundColor: "red",
          height: "100%",
          width: "100%"
        }}
      >
        {/* {this.props.loading ? this.renderLoadingModal() : null}
        // {this.state.showTextDetail ? this.renderTextModal() : null}
        {this.state.showLogoChooseDetail ? this.renderChooseLogoModal() : null}
        {this.state.showLogoUploadDetail ? this.renderUploadLogoModal() : null} */}
        {/* {this.state.splitScreenView ? null : this.state.zIndexList.length ===
          0 ? null : (
          <View
            style={{
              position: "absolute",
              top: "5%",
              width: "100%",
              backgroundColor: "green",
              justifyContent: "center",
              alignItems: "center"
            }}
            onPress={() => {
              this.setState({ editZIndexModal: true });
            }}
          >
            {this.renderEditAddOns()}
          </View>
        )} */}
        {this.state.showLogoUploadDetail ? this.renderUploadLogoModal() : null}
        {this.state.showLogoChooseDetail ? this.renderChooseLogoModal() : null}
        {this.state.showTextDetail ? this.renderTextModal() : null}

        {!this.state.splitScreenView
          ? this.props.items.front
            ? this.renderCanvas(true)
            : this.renderCanvas(false)
          : null}
        {/* {this.state.splitScreenView ? null : this.renderAcceptedBorder()} */}
        {this.state.splitScreenView ? this.renderCanvas(true) : null}
        {this.state.splitScreenView ? this.renderCanvas(false) : null}
        {this.state.splitScreenView ? (
          <View>
            <View style={{ position: "absolute", bottom: 100, right: 20 }}>
              <Text
                onPress={() => {
                  this.screenshotHandler();
                }}
              >
                Save Final
              </Text>
            </View>

            <View style={{ position: "absolute", bottom: 80, right: 20 }}>
              <Text
                onPress={() => {
                  this.setState({ splitScreenView: false });
                }}
              >
                Go Back
              </Text>
            </View>
          </View>
        ) : null}
        {this.state.splitScreenView ? null : (
          <View
            style={{
              position: "absolute",
              bottom: 0,
              height: 200,
              width: "100%"
              // backgroundColor: "green"
            }}
          >
            {this.renderToolbar()}
          </View>
        )}
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

import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal
} from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as Permissions from "expo-permissions";

import Draggable from "react-native-draggable";
import ViewShot from "react-native-view-shot";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { toggleLoading } from "../actions/loading";
import { login, addUserLogosToReducer, getLogos } from "../actions/user";
import ImagePickerComponent from "../components/ImagePickerComponent";

import { defaultItems } from "../data/defaultItems";

let currentVersion = "v5";

import { screenShotTest } from "../utilities/screenShotTest";

import {
  changeGarment,
  getDefaultItems,
  changeLogoDimensions,
  rememberLogoLocation,
  changeLogoPosition,
  toggleFrontOrBack
} from "../actions/items";

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUri: "",
      showGarment: true,
      showAddOns: true,
      showSaveProject: true,
      showDetail: false,
      showGarmentDetail: false,
      showAddOnsDetail: false,
      showSaveProjectDetail: false,
      detailType: "",
      showLogoUploadDetail: false,
      showLogoChooseDetail: false,
      showTextDetail: false,
      defaultItems: {},
      loadingCanvasComponent: true,
      startOfPressX: 0,
      startOfPressY: 0,
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
  }

  async componentDidMount() {
    // await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    // await Permissions.askAsync(Permissions.CALENDAR);
    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    // await Permissions.askAsync(Permissions.CONTACTS);
    // await Permissions.askAsync(Permissions.LOCATION);
    // await Permissions.askAsync(Permissions.NOTIFICATIONS);
    // await Permissions.askAsync(Permissions.REMINDERS);
    // await Permissions.askAsync(Permissions.SYSTEM_BRIGHTNESS);
    // await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);

    // this.setState({ defaultItems: defaultItems });

    await this.props.login();
    await this.props.getLogos();
    this.setState({ loading: false });
  }

  screenshotHandler = async () => {
    this.props.toggleLoading(true);
    let responseTest = await screenShotTest();
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
      // console.log(currentKey);

      let copiedLogoState = this.state[currentKey];
      // console.log(copiedLogoState);
      copiedLogoState.logoPositionX =
        copiedLogoState.logoPositionX + copiedLogoState.offsetX;
      copiedLogoState.logoPositionY =
        copiedLogoState.logoPositionY + copiedLogoState.offsetY;
      copiedLogoState.offsetX = 0;
      copiedLogoState.offsetY = 0;
      // console.log(copiedLogoState);
      this.setState({ [currentKey]: copiedLogoState });
    }

    for (let i = 0; i < this.state.allLogosBack.length; i++) {
      let currentKey = this.state.allLogosBack[i];
      // console.log(currentKey);

      let copiedLogoState = this.state[currentKey];
      // console.log(copiedLogoState);
      copiedLogoState.logoPositionX =
        copiedLogoState.logoPositionX + copiedLogoState.offsetX;
      copiedLogoState.logoPositionY =
        copiedLogoState.logoPositionY + copiedLogoState.offsetY;
      copiedLogoState.offsetX = 0;
      copiedLogoState.offsetY = 0;
      // console.log(copiedLogoState);
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
          {this.props.items.front
            ? this.state.allLogosFront.length === 0
              ? null
              : this.renderLogosFront()
            : this.state.allLogosBack.length === 0
            ? null
            : this.renderLogosBack()}
          {this.props.items.front
            ? this.state.allLogosFront.length === 0
              ? null
              : this.renderLogosToolbarFront()
            : this.state.allLogosBack.length === 0
            ? null
            : this.renderLogosToolbarBack()}
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
          Choose Garment Front({currentVersion})
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

  renderGarmentDetail() {
    return (
      <ScrollView horizontal={true}>
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
              width: "100%",
              height: 180
            }}
          >
            {this.props.items.defaultItems.map((item, index) => (
              <TouchableOpacity
                style={{
                  height: 160,
                  width: 120,
                  margin: 5,
                  borderWidth: 1
                }}
                key={index}
                onPress={() => {
                  this.props.changeGarment(item);
                  this.setState({ showDetail: false });
                }}
              >
                <Image
                  style={{ flex: 1, width: 80, height: 60 }}
                  source={{
                    uri: item.url
                  }}
                  resizeMode="contain"
                  onError={() => {
                    console.log("error" + index);
                  }}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
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
              {this.state.defaultItems.map((item, index) => (
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

    // return this.renderGarmentDetail();

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

  renderLogosFront() {
    console.log("in render logos front");
    console.log(this.state.logo1Front);
    console.log(this.state.allLogosFront);

    const userLogos = this.props.items.logos.front;
    const logoKeys = Object.keys(userLogos);

    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    let offsetX = 0;
    let offsetY = 0;

    return this.state.allLogosFront.map((currentKey, index) => (
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
        key={"front" + currentKey}
      >
        <View
          style={{
            width: this.state[currentKey].widthDefault,
            height: this.state[currentKey].heightDefault,
            margin: 5
          }}
        >
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

  renderLogosBack() {
    console.log("in render logos back");
    console.log(this.state.logo1Back);
    console.log(this.state.allLogosBack);

    const userLogos = this.props.items.logos.back;
    const logoKeys = Object.keys(userLogos);

    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    let offsetX = 0;
    let offsetY = 0;

    return this.state.allLogosBack.map((currentKey, index) => (
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
        key={"front" + currentKey}
      >
        <View
          style={{
            width: this.state[currentKey].widthDefault,
            height: this.state[currentKey].heightDefault,
            margin: 5
          }}
        >
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

  renderLogosToolbarFront() {
    const userLogos = this.props.items.logos.front;
    const logoKeys = Object.keys(userLogos);

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
          {logoKeys.map((currentKey, index) =>
            userLogos[currentKey] === "" ? null : (
              <View>
                <Text>Logo {index}</Text>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ width: "50%" }}>
                    <Text
                      onPress={() => {
                        this.props.changeLogoDimensions({
                          logoId: index + 1,
                          type: "inc",
                          front: true
                        });
                      }}
                    >
                      Inc
                    </Text>
                  </View>
                  <View style={{ width: "50%" }}>
                    <Text
                      onPress={() => {
                        this.props.changeLogoDimensions({
                          logoId: index + 1,
                          type: "dec",
                          front: true
                        });
                      }}
                    >
                      Dec
                    </Text>
                  </View>
                </View>

                <View style={{ width: "100%", marginVertical: 10 }}>
                  <Text
                    onPress={() => {
                      this.props.changeLogoPosition({
                        logoId: index + 1,
                        type: "up",
                        front: true
                      });
                    }}
                  >
                    Up
                  </Text>
                </View>
                <View style={{ width: "100%", marginVertical: 10 }}>
                  <Text
                    onPress={() => {
                      this.props.changeLogoPosition({
                        logoId: index + 1,
                        type: "right",
                        front: true
                      });
                    }}
                  >
                    Right
                  </Text>
                </View>
                <View style={{ width: "100%", marginVertical: 10 }}>
                  <Text
                    onPress={() => {
                      this.props.changeLogoPosition({
                        logoId: index + 1,
                        type: "down",
                        front: true
                      });
                    }}
                  >
                    Down
                  </Text>
                </View>
                <View style={{ width: "100%", marginVertical: 10 }}>
                  <Text
                    onPress={() => {
                      this.props.changeLogoPosition({
                        logoId: index + 1,
                        type: "left",
                        front: true
                      });
                    }}
                  >
                    Left
                  </Text>
                </View>
              </View>
            )
          )}
        </View>
      </View>
    );
  }

  renderLogosToolbarBack() {
    const userLogos = this.props.items.logos.back;
    const logoKeys = Object.keys(userLogos);

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
          {logoKeys.map((currentKey, index) =>
            userLogos[currentKey] === "" ? null : (
              <View>
                <Text>Logo {index}</Text>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ width: "50%" }}>
                    <Text
                      onPress={() => {
                        this.props.changeLogoDimensions({
                          logoId: index + 1,
                          type: "inc",
                          front: false
                        });
                      }}
                    >
                      Inc
                    </Text>
                  </View>
                  <View style={{ width: "50%" }}>
                    <Text
                      onPress={() => {
                        this.props.changeLogoDimensions({
                          logoId: index + 1,
                          type: "dec",
                          front: false
                        });
                      }}
                    >
                      Dec
                    </Text>
                  </View>
                </View>

                <View style={{ width: "100%", marginVertical: 10 }}>
                  <Text
                    onPress={() => {
                      this.props.changeLogoPosition({
                        logoId: index + 1,
                        type: "up",
                        front: false
                      });
                    }}
                  >
                    Up
                  </Text>
                </View>
                <View style={{ width: "100%", marginVertical: 10 }}>
                  <Text
                    onPress={() => {
                      this.props.changeLogoPosition({
                        logoId: index + 1,
                        type: "right",
                        front: false
                      });
                    }}
                  >
                    Right
                  </Text>
                </View>
                <View style={{ width: "100%", marginVertical: 10 }}>
                  <Text
                    onPress={() => {
                      this.props.changeLogoPosition({
                        logoId: index + 1,
                        type: "down",
                        front: false
                      });
                    }}
                  >
                    Down
                  </Text>
                </View>
                <View style={{ width: "100%", marginVertical: 10 }}>
                  <Text
                    onPress={() => {
                      this.props.changeLogoPosition({
                        logoId: index + 1,
                        type: "left",
                        front: false
                      });
                    }}
                  >
                    Left
                  </Text>
                </View>
              </View>
            )
          )}
        </View>
      </View>
    );
  }

  chooseLogo(item) {
    console.log("choose logo at canvas");
    // console.log(item);
    // console.log(this.state.allLogosFront);
    if (this.props.items.front) {
      if (this.state.allLogosFront.indexOf("logo1Front") === -1) {
        console.log("first logo");
        this.setState({
          logo1Front: {
            url: item[0].url,
            logoPositionX: item[0].defaultLogoPositionX,
            logoPositionY: item[0].defaultLogoPositionY,
            height: item[0].height,
            heightDefault: item[0].heightDefault,
            width: item[0].width,
            widthDefault: item[0].widthDefault,
            offsetX: 0,
            offsetY: 0
          }
        });
        this.setState({
          allLogosFront: [...this.state.allLogosFront, "logo1Front"]
        });
      } else if (this.state.allLogosFront.indexOf("logo2Front") === -1) {
        console.log("in 2nd front");
        this.setState({
          logo2Front: {
            url: item[0].url,
            logoPositionX: item[0].defaultLogoPositionX,
            logoPositionY: item[0].defaultLogoPositionY,
            height: item[0].height,
            heightDefault: item[0].heightDefault,
            width: item[0].width,
            widthDefault: item[0].widthDefault,
            offsetX: 0,
            offsetY: 0
          }
        });
        this.setState({
          allLogosFront: [...this.state.allLogosFront, "logo2Front"]
        });
      } else if (this.state.allLogosFront.indexOf("logo3Front") === -1) {
        console.log("in 3rd front");
        this.setState({
          logo3Front: {
            url: item[0].url,
            logoPositionX: item[0].defaultLogoPositionX,
            logoPositionY: item[0].defaultLogoPositionY,
            height: item[0].height,
            heightDefault: item[0].heightDefault,
            width: item[0].width,
            widthDefault: item[0].widthDefault,
            offsetX: 0,
            offsetY: 0
          }
        });
        this.setState({
          allLogosFront: [...this.state.allLogosFront, "logo3Front"]
        });
      } else if (this.state.allLogosFront.indexOf("logo4Front") === -1) {
        console.log("in 4th front");
        this.setState({
          logo4Front: {
            url: item[0].url,
            logoPositionX: item[0].defaultLogoPositionX,
            logoPositionY: item[0].defaultLogoPositionY,
            height: item[0].height,
            heightDefault: item[0].heightDefault,
            width: item[0].width,
            widthDefault: item[0].widthDefault,
            offsetX: 0,
            offsetY: 0
          }
        });
        this.setState({
          allLogosFront: [...this.state.allLogosFront, "logo4Front"]
        });
      } else if (this.state.allLogosFront.indexOf("logo5Front") === -1) {
        console.log("in 5 front");
        this.setState({
          logo5Front: {
            url: item[0].url,
            logoPositionX: item[0].defaultLogoPositionX,
            logoPositionY: item[0].defaultLogoPositionY,
            height: item[0].height,
            heightDefault: item[0].heightDefault,
            width: item[0].width,
            widthDefault: item[0].widthDefault,
            offsetX: 0,
            offsetY: 0
          }
        });
        this.setState({
          allLogosFront: [...this.state.allLogosFront, "logo5Front"]
        });
      } else if (this.state.allLogosFront.indexOf("logo6Front") === -1) {
        console.log("logo 6 front");
        this.setState({
          logo6Front: {
            url: item[0].url,
            logoPositionX: item[0].defaultLogoPositionX,
            logoPositionY: item[0].defaultLogoPositionY,
            height: item[0].height,
            heightDefault: item[0].heightDefault,
            width: item[0].width,
            widthDefault: item[0].widthDefault,
            offsetX: 0,
            offsetY: 0
          }
        });
        this.setState({
          allLogosFront: [...this.state.allLogosFront, "logo6Front"]
        });
      }
    } else {
      if (this.state.allLogosBack.indexOf("logo1Back") === -1) {
        console.log("first logo back");
        this.setState({
          logo1Back: {
            url: item[0].url,
            logoPositionX: item[0].defaultLogoPositionX,
            logoPositionY: item[0].defaultLogoPositionY,
            height: item[0].height,
            heightDefault: item[0].heightDefault,
            width: item[0].width,
            widthDefault: item[0].widthDefault,
            offsetX: 0,
            offsetY: 0
          }
        });
        this.setState({
          allLogosBack: [...this.state.allLogosBack, "logo1Back"]
        });
      } else if (this.state.allLogosBack.indexOf("logo2Back") === -1) {
        console.log("second logo back");
        this.setState({
          logo2Back: {
            url: item[0].url,
            logoPositionX: item[0].defaultLogoPositionX,
            logoPositionY: item[0].defaultLogoPositionY,
            height: item[0].height,
            heightDefault: item[0].heightDefault,
            width: item[0].width,
            widthDefault: item[0].widthDefault,
            offsetX: 0,
            offsetY: 0
          }
        });
        this.setState({
          allLogosBack: [...this.state.allLogosBack, "logo2Back"]
        });
      } else if (this.state.allLogosBack.indexOf("logo3Back") === -1) {
        console.log("3 logo back");
        this.setState({
          logo3Back: {
            url: item[0].url,
            logoPositionX: item[0].defaultLogoPositionX,
            logoPositionY: item[0].defaultLogoPositionY,
            height: item[0].height,
            heightDefault: item[0].heightDefault,
            width: item[0].width,
            widthDefault: item[0].widthDefault,
            offsetX: 0,
            offsetY: 0
          }
        });
        this.setState({
          allLogosBack: [...this.state.allLogosBack, "logo3Back"]
        });
      } else if (this.state.allLogosBack.indexOf("logo4Back") === -1) {
        console.log("4 logo back");
        this.setState({
          logo4Back: {
            url: item[0].url,
            logoPositionX: item[0].defaultLogoPositionX,
            logoPositionY: item[0].defaultLogoPositionY,
            height: item[0].height,
            heightDefault: item[0].heightDefault,
            width: item[0].width,
            widthDefault: item[0].widthDefault,
            offsetX: 0,
            offsetY: 0
          }
        });
        this.setState({
          allLogosBack: [...this.state.allLogosBack, "logo4Back"]
        });
      } else if (this.state.allLogosBack.indexOf("logo5Back") === -1) {
        console.log("5 logo back");
        this.setState({
          logo5Back: {
            url: item[0].url,
            logoPositionX: item[0].defaultLogoPositionX,
            logoPositionY: item[0].defaultLogoPositionY,
            height: item[0].height,
            heightDefault: item[0].heightDefault,
            width: item[0].width,
            widthDefault: item[0].widthDefault,
            offsetX: 0,
            offsetY: 0
          }
        });
        this.setState({
          allLogosBack: [...this.state.allLogosBack, "logo5Back"]
        });
      } else if (this.state.allLogosBack.indexOf("logo6Back") === -1) {
        console.log("6 logo back");
        this.setState({
          logo6Back: {
            url: item[0].url,
            logoPositionX: item[0].defaultLogoPositionX,
            logoPositionY: item[0].defaultLogoPositionY,
            height: item[0].height,
            heightDefault: item[0].heightDefault,
            width: item[0].width,
            widthDefault: item[0].widthDefault,
            offsetX: 0,
            offsetY: 0
          }
        });
        this.setState({
          allLogosBack: [...this.state.allLogosBack, "logo6Back"]
        });
      }
    }
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
  }
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      changeGarment,
      getDefaultItems,
      toggleLoading,
      login,
      addUserLogosToReducer,
      getLogos,
      changeLogoDimensions,
      rememberLogoLocation,
      changeLogoPosition,
      toggleFrontOrBack
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

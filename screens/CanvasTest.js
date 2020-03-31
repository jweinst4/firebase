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
  Alert
} from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import Firebase from "../config/Firebase";
import * as firebase from "firebase";
// import { sendGridEmail } from "react-native-sendgrid";
import { MAIL_API_KEY } from "react-native-dotenv";

import { captureScreen } from "react-native-view-shot";
import Draggable from "react-native-draggable";
import ViewShot from "react-native-view-shot";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { toggleLoading } from "../actions/loading";
import { login } from "../actions/user";
import ImagePickerComponent from "../components/ImagePickerComponent";

let currentVersion = "v4";

import {
  changeGarment,
  getDefaultItems,
  toggleFrontOrBack
} from "../actions/items";

class CanvasTest extends React.Component {
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
      showTextDetail: false
    };
  }

  async componentDidMount() {
    await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    await Permissions.askAsync(Permissions.CALENDAR);
    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CONTACTS);
    await Permissions.askAsync(Permissions.LOCATION);
    await Permissions.askAsync(Permissions.NOTIFICATIONS);
    await Permissions.askAsync(Permissions.REMINDERS);
    await Permissions.askAsync(Permissions.SYSTEM_BRIGHTNESS);
    await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);

    await this.props.getDefaultItems();
    await this.props.login();
  }

  // getDefaultItems = async () => {
  //   console.log("getting default items");

  //   console.log(defaultItems);

  // };

  saveCanvas = async () => {
    console.log("in save canvas");

    return await captureScreen({
      format: "jpg",
      quality: 0.9
    });
  };

  saveUriToFile = async uriHere => {
    console.log("in save uri to file at canvas");
    // console.log(this.state.imageUri);
    // console.log(uriHere);

    const asset = await MediaLibrary.createAssetAsync(uriHere);
  };

  uploadFile = async () => {
    console.log("in upload file at canvas");

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true
      // aspect: [4, 3]
    });
    console.log(pickerResult);

    return pickerResult;
  };

  _handleImagePicked = async pickerResult => {
    console.log("in handle Image picked at canvas");
    let file = await this.uploadImageAsync(pickerResult.uri);
    // console.log(file);
    return file;
  };

  uploadImageAsync = async uri => {
    console.log("in upload image async function at canvas");

    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    // console.log("in upload blob");

    let blobImageName = blob["_data"].name;

    let blobFilePath = "folder1/" + blobImageName;

    let storageRef = firebase
      .storage()
      .ref()
      .child(blobFilePath);

    let file = blob;

    let isFinished = await storageRef.put(file).then(() => {
      console.log("successfully uploaded blob");
      return blobImageName;
    });

    return isFinished;
  };

  getImageUrl = async fileName => {
    console.log("in get image Url at canvas");
    // console.log(fileName);

    const user = Firebase.auth().currentUser;

    const url =
      "https://firebasestorage.googleapis.com/v0/b/tester-859c6.appspot.com/o/folder1%2F" +
      fileName +
      "?alt=media";

    let returnedData = [user, url];

    return returnedData;
  };

  addToUserTable = async calculatedUrlAndUser => {
    console.log("in add to user table at canvas");
    // console.log(calculatedUrlAndUser);

    let url = calculatedUrlAndUser[1];
    let name = calculatedUrlAndUser[0].displayName;

    let imageDatabaseKey = Math.floor(Math.random() * 1000000 + 1);
    let urlKey = imageDatabaseKey;

    let updatedRoute =
      "https://tester-859c6.firebaseio.com/users/" + name + "/images/.json?";

    let response = await fetch(updatedRoute, {
      method: "PATCH",
      body: JSON.stringify({
        ["url" + urlKey]: url
      }),
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      }
    });

    return [url, urlKey];
  };

  addLogoToUserTable = async calculatedUrlAndUser => {
    console.log("in add to user table at canvas");
    // console.log(calculatedUrlAndUser);

    let url = calculatedUrlAndUser[1];
    let name = calculatedUrlAndUser[0].displayName;

    let imageDatabaseKey = Math.floor(Math.random() * 1000000 + 1);
    let urlKey = imageDatabaseKey;

    let updatedRoute =
      "https://tester-859c6.firebaseio.com/users/" + name + "/logos/.json?";

    let response = await fetch(updatedRoute, {
      method: "PATCH",
      body: JSON.stringify({
        ["url" + urlKey]: url
      }),
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      }
    });

    return [url, urlKey];
  };

  sendEmail = async imageInformation => {
    console.log("in send email at canvas");
    // console.log(imageInformation);

    const url = imageInformation[0];

    const fromEmail = "DesignAShirt@dedteesttest.com";
    const toEmail1 = "eric@dedtees.com";
    // const toEmail2 = "theLastAlaskn@gmail.com";
    const ccEmail = "jweinst4@gmail.com";
    const subject = "You created a design!";
    const details = "<html><body><img src='" + url + "'></body></html>";

    const apiKey = MAIL_API_KEY;

    const CONFIG = {
      SENDGRIDURL: "https://api.sendgrid.com/v3/mail/send"
    };

    fetch(CONFIG.SENDGRIDURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [
              {
                email: toEmail1
              }
            ],
            cc: [
              {
                email: ccEmail
              }
            ],
            subject: subject
          }
        ],
        from: {
          email: fromEmail
        },
        content: [
          {
            type: "text/html",
            value: details
          }
        ]
      })
    })
      .then(response => {
        return response;
      })
      .catch(error => {
        this.props.toggleLoading(false);
        return false;
      });

    // return response;
  };

  screenshotHandler = async () => {
    this.props.toggleLoading(true);
    // console.log("in screenshot handler at canvas");
    const uriHere = await this.saveCanvas();
    // console.log(uriHere);
    const savedFile = await this.saveUriToFile(uriHere);
    // console.log(savedFile);
    const uploadedFile = await this.uploadFile();
    // console.log(uploadedFile);

    if (uploadedFile.cancelled) {
      console.log("exiting function bc canceled");
      this.props.toggleLoading(false);

      return "canceled";
    }

    let handleImagePickedResult = await this._handleImagePicked(uploadedFile);

    const calculatedUrlAndUser = await this.getImageUrl(
      handleImagePickedResult
    );

    const imageInformation = await this.addToUserTable(calculatedUrlAndUser);

    const emailSent = await this.sendEmail(imageInformation);

    const emptyRequest = await emailSent;

    this.toggleLoadingFunction(emptyRequest);
  };

  uploadLogoHandler = async () => {
    console.log("in upload logo handler");

    const uploadedFile = await this.uploadFile();
    // console.log(uploadedFile);

    if (uploadedFile.cancelled) {
      console.log("exiting function bc canceled");
      this.props.toggleLoading(false);

      return "canceled";
    }

    let handleImagePickedResult = await this._handleImagePicked(uploadedFile);

    const calculatedUrlAndUser = await this.getImageUrl(
      handleImagePickedResult
    );

    const imageInformation = await this.addLogoToUserTable(
      calculatedUrlAndUser
    );

    console.log(imageInformation);
  };

  toggleLoadingFunction(emptyRequest) {
    console.log("in toggle loading function at canvas");
    this.props.toggleLoading(false);
  }

  renderCanvas() {
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
              this.props.toggleFrontOrBack();
            }}
          >
            <Icon name="rotate-3d" size={50} />
          </TouchableOpacity>
          <Draggable
            onDragRelease={({ nativeEvent }) => {
              // console.log(nativeEvent);
            }}
            x={200}
            y={200}
          >
            <View
              style={{
                width: 100,
                height: 100,
                margin: 5
              }}
            >
              <Image
                style={{ flex: 1, width: undefined, height: undefined }}
                source={{
                  uri:
                    "https://firebasestorage.googleapis.com/v0/b/tester-859c6.appspot.com/o/folder1%2F26bcf8b6-6c2b-46c9-b9c2-de8acc9d545a.jpg?alt=media"
                }}
                resizeMode="contain"
              />
            </View>
          </Draggable>
          <Draggable x={100} y={100}>
            <View>
              <Text>Tester</Text>
            </View>
          </Draggable>
        </View>
        {/* <View style={{ position: "relative" }}>
          <Draggable
            onDragRelease={({ nativeEvent }) => {
              // console.log(nativeEvent);
            }}
          >
            <View
              style={{
                width: 100,
                height: 100,
                margin: 5,
                borderWidth: 1
              }}
            >
              <Image
                style={{ flex: 1, width: undefined, height: undefined }}
                source={{
                  uri:
                    "https://firebasestorage.googleapis.com/v0/b/tester-859c6.appspot.com/o/folder1%2F2d8a0e19-c216-4d86-84b9-7ca42d9aa1cd.png?alt=media"
                }}
                resizeMode="contain"
              />
            </View>
          </Draggable>
          <Draggable
            // x={75}
            // y={100}
            renderSize={56}
            renderColor="black"
            renderText="A"
            isCircle
            shouldReverse
            onShortPressRelease={() => alert("touched!!")}
          />
          <Draggable renderColor="red" renderText="B" />
          <Draggable />

          <Draggable>
            <View>
              <Text>Tester</Text>
            </View>
          </Draggable>
        </View> */}
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
          Choose Garment ({currentVersion})
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
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {this.renderGarmentChoice()}
        {this.renderAddOns()}
        {this.renderSaveProject()}
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

  uploadLogo() {
    console.log("in upload logo");
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            console.log("clicked to upload logo");
          }}
        >
          <Text>Upload Logo Here</Text>
        </TouchableOpacity>
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
        {/* <View>
          <Text
            style={{ fontSize: 30 }}
            onPress={() => {
              this.screenshotHandler();
            }}
          >
            Save Canvas
          </Text>
        </View>
        <View>
          <Text
            style={{ fontSize: 30 }}
            onPress={() => {
              this.props.changeGarment("red shirt");
            }}
          >
            Change Garment
          </Text>
        </View> */}
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

  renderChooseLogoModal() {
    let allLogos = [];
    console.log("in render choose logo modal");
    console.log(this.props.user);
    if (!this.props.user.images) {
      console.log("currently no images");
    } else {
      console.log("at least one image");
      allLogos = Object.keys(this.props.user.images);
      console.log(allLogos);
      console.log(this.props.user.images);
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

            {!this.props.user.images ? (
              <View>
                <Text>No Images</Text>
              </View>
            ) : (
              allLogos.map((item, index) => (
                <TouchableOpacity
                  style={{
                    height: 160,
                    width: 120,
                    margin: 5,
                    borderWidth: 1
                  }}
                  key={index}
                >
                  <Image
                    style={{ flex: 1, width: 80, height: 60 }}
                    source={{
                      uri: this.props.user.images[item]
                    }}
                    resizeMode="contain"
                    onError={() => {
                      console.log("error" + index);
                    }}
                  />
                </TouchableOpacity>
              ))
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
    { changeGarment, getDefaultItems, toggleFrontOrBack, toggleLoading, login },
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
)(CanvasTest);

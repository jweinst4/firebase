import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { changeGarment, getDefaultItems } from "../actions/items";
import Draggable from "react-native-draggable";
import ViewShot from "react-native-view-shot";
import { captureScreen } from "react-native-view-shot";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import Firebase from "../config/Firebase";
import * as firebase from "firebase";
import { sendGridEmail } from "react-native-sendgrid";
import { MAIL_API_KEY } from "react-native-dotenv";

class CanvasTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUri: "",
      savingScreen: false,
      showGarment: true,
      showAddOns: true,
      showSaveProject: true,
      showDetail: false,
      showGarmentDetail: false,
      showAddOnsDetail: false,
      showSaveProjectDetail: false,
      detailType: ""
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

    await this.props.getDefaultItems();
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
    // console.log(pickerResult);

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

  sendEmail = async imageInformation => {
    console.log("in send email at canvas");
    // console.log(imageInformation);

    const url = imageInformation[0];

    const fromEmail = "DesignAShirt@dedteesttest.com";
    const toEmail = "jweinst4@gmail.com";
    const subject = "You created a new design!";
    const details = url;

    const apiKey = MAIL_API_KEY;

    const sendRequest = sendGridEmail(
      apiKey,
      toEmail,
      fromEmail,
      subject,
      details
    );
    sendRequest
      .then(response => {
        console.log("email sent success");
        return response;
      })
      .catch(error => {
        console.log(error);
      });
  };

  screenshotHandler = async () => {
    this.setState({ savingScreen: true });
    // console.log("in screenshot handler at canvas");
    const uriHere = await this.saveCanvas();
    // console.log(uriHere);
    const savedFile = await this.saveUriToFile(uriHere);
    // console.log(savedFile);
    const uploadedFile = await this.uploadFile(uriHere);
    // console.log(uploadedFile);

    if (uploadedFile.cancelled) {
      console.log("exiting function bc canceled");

      return "canceled";
    }

    let handleImagePickedResult = await this._handleImagePicked(uploadedFile);

    const calculatedUrlAndUser = await this.getImageUrl(
      handleImagePickedResult
    );

    const imageInformation = await this.addToUserTable(calculatedUrlAndUser);
    console.log(imageInformation);

    const emailSent = await this.sendEmail(imageInformation);

    // console.log(emailSent);

    this.setState({ savingScreen: false });
  };

  renderCanvas() {
    console.log("rendering canvas");
    console.log(this.props.items.shirtUrl);
    return (
      <ViewShot
        style={{ height: "100%" }}
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
            source={{
              uri: this.props.items.shirtUrl
            }}
            resizeMode="contain"
          />
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
                margin: 5,
                borderWidth: 1
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
          borderWidth: 1,
          borderRadius: 5,
          height: 100,
          justifyContent: "center",
          alignItems: "center"
        }}
        onPress={() => {
          this.setState({ showDetail: true });
          this.setState({ detailType: "garment" });
        }}
      >
        <Text style={{ textAlign: "center" }}>Choose Garment</Text>
      </TouchableOpacity>
    );
  }

  renderAddOns() {
    return (
      <TouchableOpacity
        style={{
          width: "30%",
          marginHorizontal: 5,
          borderWidth: 1,
          borderRadius: 5,
          height: 100,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text style={{ textAlign: "center" }}>Choose Addons</Text>
      </TouchableOpacity>
    );
  }

  renderSaveProject() {
    return (
      <TouchableOpacity
        style={{
          width: "30%",
          marginHorizontal: 5,
          borderWidth: 1,
          borderRadius: 5,
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
            height: 200,
            borderWidth: 1
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: 180,
              borderWidth: 1
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
                  style={{ flex: 1, width: undefined, height: undefined }}
                  source={{
                    uri: item.url
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  }

  renderDetailOptions() {
    console.log("in detail options");

    return this.renderGarmentDetail();
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

  render() {
    return (
      <View>
        <View style={{ height: "70%" }}>{this.renderCanvas()}</View>

        <View style={{ height: "30%" }}>{this.renderToolbar()}</View>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ changeGarment, getDefaultItems }, dispatch);
};

const mapStateToProps = state => {
  return {
    items: state.items
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CanvasTest);

// https://github.com/expo/examples/blob/master/with-firebase-storage-upload/App.js

import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Button,
  StatusBar,
  TouchableOpacity
} from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  updateEmail,
  updatePassword,
  login,
  getUser,
  updateUser,
  addImage
} from "../actions/user";
import { toggleLoading } from "../actions/loading";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import Firebase from "../config/Firebase";
import * as firebase from "firebase";

let imageHeight = 0;
let imageWidth = 0;

class ImagePickerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      uploading: false
    };
  }

  async componentDidMount() {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CAMERA);
  }

  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "rgba(0,0,0,0.4)",
              alignItems: "center",
              justifyContent: "center"
            }
          ]}
        >
          <Text>maybe render</Text>
        </View>
      );
    }
  };

  _maybeRenderImage = () => {
    let { image } = this.state;
    if (!image) {
      return;
    }

    return (
      <View
        style={{
          marginTop: 30,
          width: 250,
          borderRadius: 3,
          elevation: 2
        }}
      >
        <View
          style={{
            borderTopRightRadius: 3,
            borderTopLeftRadius: 3,
            shadowColor: "rgba(0,0,0,1)",
            shadowOpacity: 0.2,
            shadowOffset: { width: 4, height: 4 },
            shadowRadius: 5,
            overflow: "hidden"
          }}
        >
          <Image source={{ uri: image }} style={{ width: 250, height: 250 }} />
        </View>
        <Text
          onPress={this._copyToClipboard}
          onLongPress={this._share}
          style={{ paddingVertical: 10, paddingHorizontal: 10 }}
        >
          {image}
        </Text>
      </View>
    );
  };

  _share = () => {
    Share.share({
      message: this.state.image,
      title: "Check out this photo",
      url: this.state.image
    });
  };

  uploadImageHandler = async () => {
    this.props.toggleLoading(true);
    // console.log("at upload image handler");

    const pickImageResult = await this._pickImage();
    // console.log(pickImageResult);

    imageWidth = pickImageResult.width;
    imageHeight = pickImageResult.height;

    if (pickImageResult.cancelled) {
      console.log("exiting function bc canceled");
      this.props.toggleLoading(false);
      return "canceled";
    }

    let handleImagePickedResult = await this._handleImagePicked(
      pickImageResult
    );

    // console.log("handleImagePickedResult below");
    // console.log(handleImagePickedResult);

    const calculatedUrlAndUser = await this.getImageUrl(
      handleImagePickedResult
    );
    // console.log(calculatedUrlAndUser);

    const imageInformation = await this.addToUserTable(calculatedUrlAndUser);

    // console.log(imageInformation);

    this.props.addImage(imageInformation);

    this.props.toggleLoading(false);
  };

  _copyToClipboard = () => {
    Clipboard.setString(this.state.image);
    alert("Copied image URL to clipboard");
  };

  _takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3]
    });

    this._handleImagePicked(pickerResult);
  };

  _pickImage = async () => {
    // console.log("in pick image");
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true
      // aspect: [4, 3]
    });
    // console.log(pickerResult);

    return pickerResult;
  };

  // getUserInfo = async calculatedUrlAndUser => {
  //   console.log("in get user info");
  //   // console.log(calculatedUrlAndUser);

  //   let name2 = calculatedUrlAndUser[0].displayName;
  //   console.log(name2);

  //   let updatedRoute2 = "https://tester-859c6.firebaseio.com/users/.json?";

  //   let response2 = await fetch(updatedRoute2, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json;charset=utf-8"
  //     }
  //   });

  //   console.log(response2);

  //   return response2;
  // };

  getCurrentImageMaxKey = async calculatedUrlAndUser => {
    // console.log("in get current image max key");
    let name = calculatedUrlAndUser[0].displayName;
  };

  addToUserTable = async calculatedUrlAndUser => {
    // console.log("in add to user table");
    // console.log(calculatedUrlAndUser);

    let url = calculatedUrlAndUser[1];
    let name = calculatedUrlAndUser[0].displayName;

    let logoDatabaseKey = Math.floor(Math.random() * 1000000 + 1);
    let urlKey = logoDatabaseKey;

    let updatedRoute =
      "https://tester-859c6.firebaseio.com/users/" +
      name +
      "/logos/" +
      urlKey +
      "/.json?";

    let response = await fetch(updatedRoute, {
      method: "PATCH",
      body: JSON.stringify({
        url: url,
        width: imageWidth,
        height: imageHeight
      }),
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      }
    });

    return [url, imageWidth, imageHeight, urlKey];
  };

  getImageUrl = async fileName => {
    // console.log("in get image Url");

    const user = Firebase.auth().currentUser;

    const url =
      "https://firebasestorage.googleapis.com/v0/b/tester-859c6.appspot.com/o/folder1%2F" +
      fileName +
      "?alt=media";

    let returnedData = [user, url];

    return returnedData;
  };

  render() {
    let { image } = this.state;

    return (
      <TouchableOpacity
        style={{
          height: 40
        }}
        onPress={() => {
          this.uploadImageHandler();
        }}
      >
        <Text>Choose Image From Camera</Text>
      </TouchableOpacity>
    );
  }

  _handleImagePicked = async pickerResult => {
    // console.log("in handle Image picked");
    let file = await uploadImageAsync(pickerResult.uri);
    // console.log(file);
    return file;
  };
}

async function uploadImageAsync(uri) {
  // console.log("in upload image async function");

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
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  inputBox: {
    width: "85%",
    margin: 10,
    padding: 15,
    fontSize: 16,
    borderColor: "#d3d3d3",
    borderBottomWidth: 1,
    textAlign: "center"
  },
  button: {
    marginTop: 30,
    marginBottom: 20,
    paddingVertical: 5,
    alignItems: "center",
    backgroundColor: "#F6820D",
    borderColor: "#F6820D",
    borderWidth: 1,
    borderRadius: 5,
    width: 200
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff"
  },
  buttonSignup: {
    fontSize: 12
  }
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateEmail,
      updatePassword,
      login,
      getUser,
      updateUser,
      toggleLoading,
      addImage
    },
    dispatch
  );
};

const mapStateToProps = state => {
  return {
    user: state.user,
    loading: state.loading
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImagePickerComponent);

import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import Firebase from "../config/Firebase";
import * as firebase from "firebase";
// import { sendGridEmail } from "react-native-sendgrid";
import { MAIL_API_KEY } from "react-native-dotenv";

import { captureScreen } from "react-native-view-shot";

saveCanvas = async () => {
  console.log("in save canvas at ss test");

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
  console.log("in upload file at screenshot test");

  let pickerResult = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true
    // aspect: [4, 3]
  });
  console.log(pickerResult);

  return pickerResult;
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
  const toEmail1 = "jweinst4@gmail.com";
  // const toEmail2 = "theLastAlaskn@gmail.com";
  // const ccEmail = "jweinst4@gmail.com";
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

handleImagePicked = async pickerResult => {
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

sendEmail = async imageInformation => {
  console.log("in send email at canvas");
  // console.log(imageInformation);

  const url = imageInformation[0];

  const fromEmail = "DesignAShirt@dedteesttest.com";
  const toEmail1 = "jweinst4@gmail.com";
  // const toEmail2 = "theLastAlaskn@gmail.com";
  //   const ccEmail = "jweinst4@gmail.com";
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

export const screenShotTest = async () => {
  console.log("at screen shot test");

  const uriHere = await this.saveCanvas();
  console.log(uriHere);
  const savedFile = await this.saveUriToFile(uriHere);
  console.log(savedFile);
  const uploadedFile = await this.uploadFile();
  console.log(uploadedFile);

  //   if (uploadedFile.cancelled) {
  //     console.log("exiting function bc canceled");
  //   }

  let handleImagePickedResult = await this.handleImagePicked(uploadedFile);

  const calculatedUrlAndUser = await this.getImageUrl(handleImagePickedResult);

  const imageInformation = await this.addToUserTable(calculatedUrlAndUser);

  const emailSent = await this.sendEmail(imageInformation);

  return emailSent;
};

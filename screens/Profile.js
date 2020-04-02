import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView
} from "react-native";
import Firebase from "../config/Firebase";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { clearUser, updateUser, addAllImages } from "../actions/user";
import { toggleLoading } from "../actions/loading";
import ImagePickerComponent from "../components/ImagePickerComponent";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentDidMount = async () => {
    console.log("comp did mount at profile");
    const userInfo = await this.getUserInfo(this.props.user.displayName);
    this.props.addAllImages(userInfo);
    this.props.toggleLoading(false);
  };

  componentDidUpdate() {
    if (!this.props.user.uid) {
      this.props.navigation.navigate("Login");
    }
  }

  handleSignout = () => {
    Firebase.auth().signOut();
    this.props.clearUser();
    this.props.navigation.navigate("Login");
  };

  getUserInfo = async userDisplayName => {
    console.log("in get info at profile");
    let response = await fetch(
      "https://tester-859c6.firebaseio.com/users/" +
        userDisplayName +
        "/logos/.json?",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        }
      }
    );

    let result = await response.json();

    return result;
  };

  renderImages() {
    console.log("at render images in profile");

    let images = this.props.user.images;

    if (images) {
      let imageKeys = Object.keys(images);
      return (
        <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
          {imageKeys.map((key, index) => (
            <View
              style={{
                width: 100,
                height: 100,
                margin: 5,
                borderWidth: 1
              }}
              key={key}
            >
              <Image
                style={{ flex: 1, width: undefined, height: undefined }}
                source={{
                  uri: images[key]
                }}
                resizeMode="contain"
              />
            </View>
          ))}
        </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          {this.props.loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                animating={true}
                size="large"
                color="#0000ff"
              />
            </View>
          ) : (
            <View>
              <Text>Profile Screen</Text>
              <Text>Not Loading</Text>
              <ImagePickerComponent />
              {this.renderImages()}
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  loadingContainer: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  singleImage: {
    height: "30%"
  }
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { clearUser, updateUser, addAllImages, toggleLoading },
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
)(Profile);

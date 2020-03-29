import React from "react";
import {
  View,
  TextInput,
  Input,
  StyleSheet,
  TouchableOpacity,
  Text
} from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  updateEmail,
  updatePassword,
  updateName,
  signup,
  login,
  updateUser
} from "../actions/user";
import { toggleLoading } from "../actions/loading";

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSignUp = async () => {
    console.log("handle signup toggle trueloading below");
    this.props.toggleLoading(true);
    const returnedVal = await this.props.signup();
    console.log("signup response below");
    console.log(returnedVal);
    console.log("handle signup toggle false loading below");
    console.log("logging in below");
    const userData = await this.props.login();
    console.log("isLoggedInBelow");
    console.log(userData);
    this.props.toggleLoading(false);
    console.log("navigate to profile below");
    this.props.navigation.navigate("Profile");
  };

  getUserInfo = async () => {};

  renderLoadingScreen() {
    return (
      <View>
        <Text>Loading Screen</Text>
      </View>
    );
  }

  renderNonLoadingScreen() {
    return (
      <View>
        <Text>Non Loading Screen</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.props.loading
          ? this.renderLoadingScreen()
          : this.renderNonLoadingScreen()}
        <TouchableOpacity
          onPress={() => {
            this.props.toggleLoading(true);
          }}
          style={{ margin: 50 }}
        >
          <Text>Toggle Loading True</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.props.toggleLoading(false);
          }}
          style={{ margin: 50 }}
        >
          <Text>Toggle Loading False</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.inputBox}
          value={this.props.user.name}
          onChangeText={name => this.props.updateName(name)}
          placeholder="Name"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.inputBox}
          value={this.props.user.email}
          onChangeText={email => this.props.updateEmail(email)}
          placeholder="Email"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.inputBox}
          value={this.props.user.password}
          onChangeText={password => this.props.updatePassword(password)}
          placeholder="Password"
          secureTextEntry={true}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.handleSignUp();
          }}
        >
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
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
    backgroundColor: "#FFA611",
    borderColor: "#FFA611",
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
      updateName,
      signup,
      toggleLoading,
      login,
      updateUser
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
)(Signup);

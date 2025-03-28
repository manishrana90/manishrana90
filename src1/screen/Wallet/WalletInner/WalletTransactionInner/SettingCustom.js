import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";

import { AuthContext } from "../../../../store/auth-context";
import { Socket } from "../../../../util/socket";

const SettingCustom = (props) => {
  const authCtx = useContext(AuthContext);

  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authCtx.token === null || authCtx.token === undefined) {
      props.navigation.navigate("Home");
    }

    let user = JSON.parse(authCtx.token);
    setUserName(user?.details?.username);

    const updateSuccess = (...args) => {
      setLoading(false);
      if (args[0].error === false) {
        Toast.show({
          type: "success",
          text1: "Password Update Success",
          text2: `${args[0].message}, Please Login again.😊`,
        });
        authCtx.logout();
        props.navigation.navigate("Home");
      } else {
        Toast.show({
          type: "error",
          text1: "Incorrect Password",
          text2: `${args[0].message}.😔`,
        });
      }
    };
    Socket.on("update-password-success", updateSuccess);

    Socket.on("update-password-error", updateSuccess);

    return () => {
      // Socket.off("update-password-success", updateSuccess);
    };
  }, [Socket, authCtx]);

  const specialCharRegex = /[\W_]/;
  const numericRegex = /\d/;
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;

  const PasswordVerification = () => {
    if (
      password === "" ||
      password.length < 6 ||
      !specialCharRegex.test(password) ||
      !numericRegex.test(password) ||
      !uppercaseRegex.test(password) ||
      !lowercaseRegex.test(password)
    ) {
      if (password === "") {
        Toast.show({
          type: "error",
          text1: "Incorrect Password",
          text2: `Password cannot be empty.😔`,
        });
      } else if (password.length < 6) {
        Toast.show({
          type: "error",
          text1: "Incorrect Password",
          text2: `Password must have at least 6 characters.😔`,
        });
      } else if (!specialCharRegex.test(password)) {
        Toast.show({
          type: "error",
          text1: "Incorrect Password",
          text2: `Password must have at least 1 special character.😔`,
        });
      } else if (!numericRegex.test(password)) {
        Toast.show({
          type: "error",
          text1: "Incorrect Password",
          text2: `Password must have at least 1 numeric. [0-9].😔`,
        });
      } else if (!uppercaseRegex.test(password)) {
        Toast.show({
          type: "error",
          text1: "Incorrect Password",
          text2: `Password must have at least 1 uppercase letter. [A-Z].😔`,
        });
      } else if (!lowercaseRegex.test(password)) {
        Toast.show({
          type: "error",
          text1: "Incorrect Password",
          text2: `Password must have at least 1 lowercase letter. [a-z].😔`,
        });
      }
    } else {
      submitHandler();
    }
  };

  async function submitHandler() {
    let token = JSON.parse(authCtx.token);
    let userdata = {
      user: {
        _id: token._id,
        key: token.key,
        details: {
          username: token.details.username,
          role: token.details.role,
          status: token.details.status,
        },
      },
      password: password,
      targetUser: "",
    };
    console.log("userdata", userdata);
    setLoading(true);
    Socket.emit("update-password", userdata);
  }

  return (
    <>
      <View style={styles.mainView}>
        <View style={styles.profileTextHolder}>
          <Text style={styles.profileTextStyles}>Edit Profile</Text>
        </View>

        <View style={styles.profileNameHolder}>
          <View style={styles.iconView}>
            <Image
              source={require("../../../../assets/images/navigationIcon/userIcon3x.png")}
              resizeMode="contain"
              style={styles.iconImg}
              tintColor={"#DAA520"}
            />
          </View>
          <TextInput
            style={[styles.textInputNameStyle, { color: "#DAA520" }]}
            placeholder="Name"
            placeholderTextColor={"#9f9f9f"}
            value={userName}
            editable={false}
            selectTextOnFocus={false}
          />
        </View>

        <View style={styles.profileNameHolder}>
          <View style={styles.iconView}>
            <Image
              source={require("../../../../assets/images/iconPNG/settingsIcon.png")}
              resizeMode="contain"
              style={styles.iconImg}
              tintColor={"#DAA520"}
            />
          </View>
          <TextInput
            style={styles.textInputNameStyle}
            placeholder="New Password"
            maxLength={50}
            placeholderTextColor={"#9f9f9f"}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
            }}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            PasswordVerification();
          }}
          style={styles.saveChangesHolder}
        >
          <Text style={styles.saveTextStyles}>UPDATE</Text>
        </TouchableOpacity>
      </View>
      {loading && (
        <View style={styles.loadingStyles}>
          <ActivityIndicator size={"large"} color={"#DAA520"} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  mainView: {
    marginHorizontal: 7,
    marginTop: 7,
    borderRadius: 5,
    backgroundColor: "#1E2836",
    paddingTop: 8,
    paddingBottom: 15,
  },
  profileTextHolder: {
    marginVertical: 7,
    alignItems: "center",
  },
  profileTextStyles: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  profileNameHolder: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#fff",
    marginHorizontal: 25,
    borderRadius: 5,
    padding: 9,
  },
  iconView: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconImg: {
    width: 12,
    height: 12,
    tintColor: "#DAA520"
  },
  textInputNameStyle: {
    flex: 1,
    padding: 0,
    marginLeft: 5,
    borderRadius: 10,
    color: "#151C26",
    fontSize: 14,
    fontWeight: "500",
  },
  saveChangesHolder: {
    marginVertical: 10,
    marginHorizontal: 25,
    borderRadius: 5,
    paddingVertical: 14,
    backgroundColor: "#DAA520",
    alignItems: "center",
    justifyContent: "center",
  },
  saveTextStyles: {
    fontSize: 12,
    fontWeight: "500",
    color: "#fff",
  },
  loadingStyles: {
    flex: 1,
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SettingCustom;

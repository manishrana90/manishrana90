import React, { useContext, useState } from "react";
import {
  View,
  Modal,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import { AuthContext } from "../../store/auth-context";
import OTPTextView from "react-native-otp-textinput";
import { Config } from "../../../config";
import { ResendOtp, VerifyUserOtp } from "../../util/http";

const OtpModal = ({ modalVisible, loadingHead, setModalVisible, setSuccess }) => {
    const authCtx = useContext(AuthContext);
  const [userOtp, setUserOtp] = useState("");
  const [error, seterror] = useState({
    phone: false,
    password: false,
    name: false,
    userOtp: false,
    confirmPassword: false,
    referral: false,
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    const otpIsValid = userOtp.trim().length === 4;
    if (!otpIsValid) {
      seterror((currentValues) => {
        return {
          ...currentValues,
          userOtp: !otpIsValid,
        };
      });
      return;
    }
    setSuccess(userOtp);
  };

  const resendOtp = async () => {
    const userData = JSON.parse(authCtx.token);
    setLoading(true);
    let data = {
      phone:  userData?.details?.mobile.startsWith('+91')
      ? userData?.details?.mobile.substring(3)
      : userData?.details?.mobile,
      manager: Config.ManagerName,
    };
    const userdata = await ResendOtp(data);
    setLoading(false);
    if (userdata.success === true) {
      Toast.show({
        type: "success",
        text1: "Resend OTP",
        text2: "OTP has been resend successfully.",
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Resend OTP",
        text2: userdata.message,
      });
      return;
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
        setLoading(false);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalBox}>
            <View style={styles.container}>
              <View style={styles.hideIconView}>
                <Pressable
                  style={styles.hideIconPress}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    setLoading(false);
                  }}
                >
                  <Image
                    source={require("../../assets/images/iconPNG/closeIcon.png")}
                    resizeMode="contain"
                    style={styles.hideIconImg}
                    tintColor={"#DAA520"}
                  />
                </Pressable>
              </View>
              <View style={styles.header}>
                <View style={styles.headerImgHolder}>
                  <Image
                    source={Config.logoUrl}
                    resizeMode="contain"
                    style={styles.headerImg}
                  />
                </View>
              </View>

              <Text style={styles.headtext}>Enter Otp</Text>
              <View style={styles.inputCont}>
                <View style={styles.otpView}>
                  <OTPTextView
                    ref={(e) => e}
                    containerStyle={styles.otpContainer}
                    textInputStyle={styles.inputotpText}
                    offTintColor="#FFF"
                    handleTextChange={(value) => {
                      value.length <= 4 && setUserOtp(value);
                      seterror((currentValues) => {
                        return {
                          ...currentValues,
                          userOtp: false,
                        };
                      });
                    }}
                    inputCount={4}
                    keyboardType="numeric"
                  />
                </View>
                {error.userOtp && (
                  <Text style={styles.errorText}>Please enter correct OTP</Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() => {
                  onSubmit();
                }}
                disabled={loading || loadingHead}
                style={styles.signupCont}
              >
                {!loading && !loadingHead ? (
                  <Text style={styles.signupText}>SUBMIT</Text>
                ) : (
                  <ActivityIndicator size={"small"} color={"#fff"} />
                )}
              </TouchableOpacity>

              <View style={styles.fotterCont}>
                <TouchableOpacity
                  style={styles.fotterBtn}
                  onPress={() => {
                    resendOtp();
                  }}
                >
                  <Text style={styles.fotterBtnText}>Resend Otp</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default OtpModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalView: {
    width: "90%",
    borderRadius: 5,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalBox: {
    flexDirection: "row",
    justifyContent: "center",
  },
  Icon: {
    flex: 1,
    marginVertical: 5,
    marginHorizontal: 5,
    position: "absolute",
    top: -50,
    right: 10,
  },
  container: {
    width: "100%",
    backgroundColor: "#151C26",
  },
  hideIconView: {
    alignItems: "flex-end",
    paddingTop: 10,
    paddingRight: 10,
  },
  hideIconPress: {
    width: 30,
    height: 30,
  },
  hideIconImg: {
    width: "100%",
    height: "100%",
    tintColor: "#DAA520"
  },
  header: {
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  headerImgHolder: {
    width: 100,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  headerImg: {
    width: "100%",
    height: "100%",
  },
  headtext: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
    marginVertical: 9,
  },
  inputCont: {
    marginVertical: 15,
    marginHorizontal: 35,
  },
  inputView: {
    backgroundColor: "#F7F7F7",
    borderRadius: 5,
    paddingVertical: Platform.OS === "ios" ? 10 : 0,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  otpView: {},
  inputText: {
    fontSize: 12,
    padding: 0,
    fontWeight: "400",
    color: "#000",
  },
  otpContainer: {
    justifyContent: "center",
  },
  inputotpText: {
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#000",
    borderRadius: 5,
    height: 40,
    width: 40,
    marginHorizontal: 5,
    marginVertical: 0,
    justifyContent: "center",
    fontSize: 12,
    fontWeight: "400",
    color: "#000",
  },
  signupCont: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DAA520",
    marginHorizontal: 35,
    marginTop: 5,
    marginBottom: 35,
    borderRadius: 5,
  },
  signupText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    fontWeight: "500",
  },
  fotterCont: {
    flexDirection: "row",
    marginHorizontal: 40,
    marginBottom: 20,
  },
  fotterBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fotterBtnText: {
    color: "#DAA520",
  },
});

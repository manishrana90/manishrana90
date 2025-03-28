import React, {
  useContext,
  useRef,
  useState,
  useLayoutEffect,
  useEffect,
} from "react";
import {
  View,
  Modal,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Platform,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { batch, useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Toast from "react-native-toast-message";
import { AuthContext } from "../../store/auth-context";
import { Socket } from "../../util/socket";
import OTPTextView from "react-native-otp-textinput";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Config } from "../../../config";
import {
  AddNewUser,
  GetBonusCode,
  ResendOtp,
  VerifyUserOtp,
} from "../../util/http";

const LoginModal = ({
  modalVisible,
  setModalVisible,
  navigationType,
  navigationData,
}) => {
  const dispatch = useDispatch();
  const { phone, password } = useSelector((state) => state.loginStates);

  const authCtx = useContext(AuthContext);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referral, setReferral] = useState("");
  const [name, setName] = useState("");
  const [loginType, setLoginType] = useState(0);
  const [userOtp, setUserOtp] = useState("");
  const [formStep, setFormStep] = useState(0);
  const [error, seterror] = useState({
    phone: false,
    password: false,
    name: false,
    userOtp: false,
    confirmPassword: false,
    referral: false,
  });
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    const InitialCheck = async () => {
      const storedPhone = await AsyncStorage.getItem("phone");
      const storedPass = await AsyncStorage.getItem("password");

      if (storedPhone) {
        dispatch({
          type: "PHONE",
          payload: storedPhone,
        });
      }
      if (storedPass) {
        dispatch({
          type: "PASSWORD",
          payload: storedPass,
        });
      }
      if (phone.length < 10) {
        setFormStep(0);
        setLoginType(0);
      }
    };
    InitialCheck();
  }, [isFocused, modalVisible]);

  useEffect(() => {
    const handleLoginSuccess = async (...args) => {
      if (args[0].success == false) {
        Toast.show({
          type: "error",
          text1: "User SignIn Error!",
          text2: `${args[0].message}`,
        });
        setModalVisible(false);
        setFormStep(0);
        return;
      }
      let user = args[0].output;
      if (user != null) {
        authCtx.authenticate(JSON.stringify(user));
        authCtx.setBalance(user.details.balance);
        authCtx.setDepositStatus(user?.depositstatus);
        setFormStep(0);

        await AsyncStorage.setItem("phone", phone);
        await AsyncStorage.setItem("password", password);
        dispatch({
          type: "PHONE",
          payload: "",
        });
        dispatch({
          type: "PASSWORD",
          payload: "",
        });
        setLoading(false);
        checkNavigation();
        Toast.show({
          type: "success",
          text1: "Login Successfuly",
          text2: "Your account has been login successfully.",
        });
      }
    };

    const handleLoginError = (...args) => {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "User SignIn Error!",
        text2: `${args[0].message}`,
      });
      setModalVisible(false);
      setFormStep(0);
      return;
    };

    const handleLoginOtpSuccess = (...args) => {

      setFormStep(1);
      setLoading(false);

      Toast.show({
        type: "success",
        text1: "Otp",
        text2: "Please enter your otp.",
      });
    };

    const handleResetOtpSuccess = (...args) => {
      setLoading(false);
      Toast.show({
        type: "success",
        text1: " Resend Otp",
        text2: "Otp has been resend successfully.",
      });
    };

    const handleResetOtpError = (...args) => {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Resend Otp Error!",
        text2: `${args[0].message}`,
      });
      return;
    };

    Socket.on("login-success", handleLoginSuccess);
    Socket.on("login-error", handleLoginError);
    Socket.on("loginotp-success", handleLoginOtpSuccess);
    Socket.on("reset-otp-success", handleResetOtpSuccess);
    Socket.on("reset-otp-error", handleResetOtpError);

    return () => {
      Socket.off("login-success", handleLoginSuccess);
      Socket.off("login-error", handleLoginError);
      Socket.off("loginotp-success", handleLoginOtpSuccess);
      Socket.off("reset-otp-success", handleResetOtpSuccess);
      Socket.off("reset-otp-error", handleResetOtpError);
    };
  }, [Socket, phone, password]);

  const checkNavigation = () => {
    setFormStep(0);
    setModalVisible(false);
    setTimeout(() => {
      
      if (navigationType === "cricket") {
        navigation.navigate("LiveBet", { eventId: navigationData.eventId, eventTypeId: navigationData.eventTypeId });
        authCtx.setEventId(navigationData.eventId);
      }
      if (navigationType === "Casino") {
        navigation.navigate("Casino", { filter: navigationData.gameId });
      }
      if (navigationType === "LiveGame") {
        navigation.navigate("LiveGame", { filter: navigationData.gameId });
      }
      if (navigationType === "Games") {
        navigation.navigate("Games", {
          gameId: navigationData.gameId,
          tableId: navigationData.tableId,
        });
      }
      if (navigationType === "liveVirtual") {
        navigation.navigate("Live");
      }
      if(navigationType === "TransactionHistory") {
        navigation.navigate("TransactionHistory");
      }
      if(navigationType === "CurrentBets") {
        navigation.navigate("CurrentBets");
      }if(navigationType === "BallByBall") {
        navigation.navigate("BallByBall");
      }if(navigationType === "Aviator") {
        navigation.navigate("Aviator");
      }if(navigationType === "CasinoAura") {
        navigation.navigate("CasinoAura");
      }
    }, 500);
  };

  const onSubmit = async () => {
    setLoading(true);
    if (formStep === 0) {
      // const phoneIsValid = phone.trim().length >= 8;
      const phoneIsValid = phone.trim().length > 0;
      const passwordIsValid =
        loginType === 0 ? password.trim().length >= 4 : true;
      if (!phoneIsValid || !passwordIsValid) {
        seterror((currentValues) => {
          return {
            ...currentValues,
            phone: !phoneIsValid,
            password: !passwordIsValid,
          };
        });
        setLoading(false);
        return;
      }

      setTimeout(() => {
        setLoading(false);
      }, 10000);

      let data = {
        user: {
          username: phone,
          password: password,
          manager: Config.LoginName,
        },
      };
      if (loginType === 1 || loginType === 3) {
        data = {
          user: {
            phone: phone,
            manager: Config.LoginName,
          },
        };
      }

      Socket.emit(loginType === 0 ? "login" : "login-otp", data);
    } else if (formStep === 1) {
      const otpIsValid = userOtp.trim().length === 4;
      if (!otpIsValid) {
        seterror((currentValues) => {
          return {
            ...currentValues,
            userOtp: !otpIsValid,
          };
        });
        setLoading(false);
        return;
      }

      let data = {
        user: {
          phone: phone,
          otp: userOtp,
          manager: Config.LoginName,
        },
      };


      // Socket.emit("login-verify-otp", data);
      Socket.emit("new-login-verify-otp", data);
    } else if (formStep === 2) {
      const phoneIsValid = phone.trim().length === 10;
      const nameIsValid = name.trim().length > 0;
      const passwordIsValid = password.trim().length >= 5;
      const confirmPasswordIsValid = confirmPassword === password;
      if (
        !nameIsValid ||
        !phoneIsValid ||
        !passwordIsValid ||
        !confirmPasswordIsValid ||
        error.referral
      ) {
        seterror((currentValues) => {
          return {
            ...currentValues,
            phone: !phoneIsValid,
            name: !nameIsValid,
            password: !passwordIsValid,
            confirmPassword: !confirmPasswordIsValid,
          };
        });
        setLoading(false);
        return;
      }
      let data = {
        // type: Config.ManagerType,
        // typeId: Config.ManagerId,
        // name: name,
        affilate_code: null,
        password: password,
        phone: phone,
        referal_code: referral,
        user_id: Config.newManagerId,
        username: name,
      };

      const userdata = await AddNewUser(data);
      setLoading(false);
      if (userdata.success === true) {
        Toast.show({
          type: "success",
          text1: "Create User",
          text2: "User has been created successfully.",
        });
        setFormStep(4);
        setLoginType(4);
      } else {
        Toast.show({
          type: "error",
          text1: "Create User",
          text2: userdata.message,
        });

        return;
      }
    } else if (formStep === 4) {
      const otpIsValid = userOtp.trim().length === 4;
      if (!otpIsValid) {
        seterror((currentValues) => {
          return {
            ...currentValues,
            userOtp: !otpIsValid,
          };
        });
        setLoading(false);
        return;
      }

      let data = {
        // type: Config.ManagerType,
        // typeId: Config.ManagerId,
        phone: phone,
        otp: userOtp,
        manager: Config.ManagerName
      };
      const userdata = await VerifyUserOtp(data);
      setLoading(false);
      if (userdata.success === true) {
        Toast.show({
          type: "success",
          text1: "Create User",
          text2: "User has been created successfully.",
        });

        setFormStep(0);
        setLoginType(0);
      } else {
        Toast.show({
          type: "error",
          text1: "Create User",
          text2: userdata.message,
        });
        return;
      }
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    if (loginType != 4) {
      let data = {
        user: {
          phone: phone,
          manager: Config.LoginName,
        },
      };
      Socket.emit("reset-otp", data);
    } else {
      let data = {
        phone: `+91${phone}`,
        type: Config.ManagerType,
        typeId: Config.ManagerId,
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
    }
    // reset-otp
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
        setFormStep(0);
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
                    setFormStep(0);
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
              {formStep === 0 && (
                <>
                  <Text style={styles.headtext}>
                    {loginType === 3 ? "Register" : "Sign In"}
                  </Text>
                  <View style={styles.inputCont}>
                    <View style={[styles.inputView, { flexDirection: "row" }]}>
                      {/* <View
                        style={{
                          marginRight: 5,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={[
                            styles.inputText,
                            phone.length == 0 ? { color: "#959CA7" } : "",
                          ]}
                        >
                          +91
                        </Text>
                      </View> */}
                      <TextInput
                        style={[styles.inputText, { flex: 1 }]}
                        placeholder="Username OR Phone Number"
                        placeholderTextColor="#959CA7"
                        value={phone}
                        onChangeText={(value) => {
                          dispatch({
                            type: "PHONE",
                            payload: value,
                          });
                          seterror((currentValues) => {
                            return {
                              ...currentValues,
                              phone: false,
                            };
                          });
                        }}
                        // keyboardType="numeric"
                      />
                    </View>
                    {error.phone && (
                      <Text style={styles.errorText}>
                        Please enter correct Phone Number
                      </Text>
                    )}
                  </View>
                  {loginType === 0 && (
                    <View style={styles.inputCont}>
                      <View
                        style={[styles.inputView, { flexDirection: "row" }]}
                      >
                        <TextInput
                          style={[styles.inputText, { flex: 1 }]}
                          placeholder="Enter Password"
                          placeholderTextColor="#959CA7"
                          secureTextEntry={true}
                          value={password}
                          onChangeText={(value) => {
                            dispatch({
                              type: "PASSWORD",
                              payload: value,
                            });
                            seterror((currentValues) => {
                              return {
                                ...currentValues,
                                password: false,
                              };
                            });
                          }}
                        />
                      </View>
                      {error.password && (
                        <Text style={styles.errorText}>
                          Please enter password with min 5 character.
                        </Text>
                      )}
                    </View>
                  )}
                  <TouchableOpacity
                    onPress={() => {
                      onSubmit();
                    }}
                    disabled={loading}
                    style={styles.signupCont}
                  >
                    {!loading ? (
                      <Text style={styles.signupText}>SUBMIT</Text>
                    ) : (
                      <ActivityIndicator size={"small"} color={"#fff"} />
                    )}
                  </TouchableOpacity>
                </>
              )}
              {(formStep === 1 || formStep === 4) && phone.length > 0 && (
                <>
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
                      <Text style={styles.errorText}>
                        Please enter correct OTP
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      onSubmit();
                    }}
                    disabled={loading}
                    style={styles.signupCont}
                  >
                    {!loading ? (
                      <Text style={styles.signupText}>SUBMIT</Text>
                    ) : (
                      <ActivityIndicator size={"small"} color={"#fff"} />
                    )}
                  </TouchableOpacity>
                </>
              )}
              {formStep === 2 && (
                <>
                  <Text style={styles.headtext}>Enter Details</Text>
                  <View style={styles.inputCont}>
                    <View style={[styles.inputView, { flexDirection: "row" }]}>
                      <View
                        style={{
                          marginRight: 5,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={[
                            styles.inputText,
                            phone.length == 0 ? { color: "#959CA7" } : "",
                          ]}
                        >
                          +91
                        </Text>
                      </View>
                      <TextInput
                        style={[styles.inputText, { flex: 1 }]}
                        placeholder="Phone Number"
                        placeholderTextColor="#959CA7"
                        value={phone}
                        onChangeText={(value) => {
                          value.length <= 10 &&
                            dispatch({
                              type: "PHONE",
                              payload: value,
                            });
                          seterror((currentValues) => {
                            return {
                              ...currentValues,
                              phone: false,
                            };
                          });
                        }}
                        keyboardType="numeric"
                      />
                    </View>
                    {error.phone && (
                      <Text style={styles.errorText}>
                        Please enter correct Phone Number
                      </Text>
                    )}
                  </View>
                  <View style={styles.inputCont}>
                    <View style={styles.inputView}>
                      <TextInput
                        style={styles.inputText}
                        placeholder="Name"
                        placeholderTextColor="grey"
                        value={name}
                        onChangeText={(value) => {
                          setName(value);
                          seterror((currentValues) => {
                            return {
                              ...currentValues,
                              name: false,
                            };
                          });
                        }}
                      />
                    </View>
                    {error.name && (
                      <Text style={styles.errorText}>
                        Please enter correct Name
                      </Text>
                    )}
                  </View>
                  <View style={styles.inputCont}>
                    <View style={[styles.inputView, { flexDirection: "row" }]}>
                      <TextInput
                        style={[styles.inputText, { flex: 1 }]}
                        placeholder="Enter Password"
                        placeholderTextColor="#959CA7"
                        secureTextEntry={true}
                        value={password}
                        onChangeText={(value) => {
                          dispatch({
                            type: "PASSWORD",
                            payload: value,
                          });
                          seterror((currentValues) => {
                            return {
                              ...currentValues,
                              password: false,
                            };
                          });
                        }}
                      />
                    </View>
                    {error.password && (
                      <Text style={styles.errorText}>
                        Please enter password with min 5 character.
                      </Text>
                    )}
                  </View>
                  <View style={styles.inputCont}>
                    <View style={[styles.inputView, { flexDirection: "row" }]}>
                      <TextInput
                        style={[styles.inputText, { flex: 1 }]}
                        placeholder="Enter Confirm Password"
                        placeholderTextColor="#959CA7"
                        secureTextEntry={true}
                        value={confirmPassword}
                        onChangeText={(value) => {
                          setConfirmPassword(value);
                          seterror((currentValues) => {
                            return {
                              ...currentValues,
                              confirmPassword: false,
                            };
                          });
                        }}
                      />
                    </View>
                    {error.confirmPassword && (
                      <Text style={styles.errorText}>
                        Please enter confirm password as per password.
                      </Text>
                    )}
                  </View>
                  <View style={styles.inputCont}>
                    <View style={[styles.inputView, { flexDirection: "row" }]}>
                      <TextInput
                        style={[styles.inputText, { flex: 1 }]}
                        placeholder="Enter Referral Code (Optional)"
                        placeholderTextColor="#959CA7"
                        value={referral}
                        autoCapitalize="characters"
                        onChangeText={(value) => {
                          setReferral(value);
                        }}
                      />
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      onSubmit();
                    }}
                    disabled={loading}
                    style={styles.signupCont}
                  >
                    {!loading ? (
                      <Text style={styles.signupText}>SUBMIT</Text>
                    ) : (
                      <ActivityIndicator size={"small"} color={"#fff"} />
                    )}
                  </TouchableOpacity>
                </>
              )}

              {Config?.registerLogin === false ? (
                <></>
              ) : (
                <View style={styles.fotterCont}>
                  <TouchableOpacity
                    style={styles.fotterBtn}
                    onPress={() => {
                      if (formStep === 1 || formStep === 4) {
                        resendOtp();
                      } else {
                        setFormStep(0);
                        setLoginType(loginType === 0 ? 1 : 0);
                      }
                    }}
                  >
                    <Text style={styles.fotterBtnText}>
                      {formStep === 1 || formStep === 4
                        ? "Resend Otp"
                        : `Login With ${loginType === 0 ? "Otp" : "Password"}`}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.fotterBtn, { alignItems: "flex-end" }]}
                    onPress={() => {
                      setFormStep(2);
                    }}
                  >
                    <Text style={styles.fotterBtnText}>Create Account</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LoginModal;

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
    alignItems: "flex-start",
  },
  fotterBtnText: {
    color: "#DAA520",
  },
});

import React, { useContext, useLayoutEffect, useState } from "react";
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
  Keyboard,
} from "react-native";
import Toast from "react-native-toast-message";
import { AuthContext } from "../../store/auth-context";
import {
  DepositBalance,
  GetUserDetail,
  WithdrawalBalance,
} from "../../util/http";
import { Socket } from "../../util/socket";
import { Config } from "../../../config";

const CasinoBalanceModal = ({ modalVisible, setModalVisible }) => {
  const authCtx = useContext(AuthContext);
  const [phone, setPhone] = useState(0);
  const [loginType, setLoginType] = useState(0);
  const [error, seterror] = useState({
    phone: false,
  });
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    const InitialCheck = () => {
      setPhone(0);
      setLoginType(0);
    };
    InitialCheck();
  }, []);

  Socket.on("get-balance-success", (...args) => {
    authCtx.setCasinoBalance(parseFloat(args[0].amount) * 10);
  });

  const updateBalance = async () => {
    if (authCtx.token != null && authCtx.token != undefined) {
      const userData = JSON.parse(authCtx.token);

      let userdata = {
        user: {
          _id: userData._id,
          key: userData.key,
          token: userData.verifytoken,
          details: {
            username: userData.details.username,
            role: userData.details.role,
            status: userData.details.status,
          },
        },
      };

      const userDetail = await GetUserDetail({ token: userData.verifytoken });
      if (userDetail.success == true) {
        authCtx.setBalance(JSON.parse(userDetail.doc.balance));
        authCtx.setCasinoBalance(JSON.parse(userDetail.doc.mainbalance * 10));
      }

      Socket.emit("get-userbalance", userdata);
      Socket.emit("get-user", userdata);

      if (userDetail?.logout === true) {
        authCtx.logout();
        Toast.show({
          type: "error",
          text1: "Someone Login",
          text2: `Your id has been login somewhere else.`,
        });
      }
    }
  };

  const onSubmit = async () => {
    setLoading(true);
    Keyboard.dismiss();

    const phoneIsValid = phone > 0;
    if (!phoneIsValid) {
      seterror({ phone: !phoneIsValid });
      setLoading(false);
      return;
    }

    let tokendata = JSON.parse(authCtx.token);

    if (loginType === 0) {
      const depositData = await DepositBalance(tokendata.details._id, phone);
      setLoading(false);
      if (depositData.error === true) {
        Toast.show({
          type: "error",
          text1: "Deposit Error.",
          text2: depositData.message,
        });
      } else {
        setPhone(0);
        setTimeout(() => {
          updateBalance();
        }, 1000);
        setModalVisible(!modalVisible);
        Toast.show({
          type: "success",
          text1: "Deposit Success.",
          text2: "Your amount has been deposit successfully.",
        });
      }
    } else {
      const withdrawData = await WithdrawalBalance(
        tokendata.details._id,
        phone
      );
      setLoading(false);
      if (withdrawData.error === false) {
        setPhone(0);
        setTimeout(() => {
          updateBalance();
        }, 1000);
        setModalVisible(!modalVisible);
        Toast.show({
          type: "success",
          text1: "Withdrawal Success.",
          text2: "Your amount has been withdrawal successfully.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Withdrawal Error.",
          text2: withdrawData.message,
        });
      }
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

              <>
                <Text style={styles.headtext}>
                  Note: 10 coins = 1 coins in casino wallet
                </Text>

                <View style={styles.balanceCont}>
                  <View style={styles.balanceView}>
                    <View style={styles.balanceHeadCont}>
                      <Text style={styles.balanceHeadText}>Main Balance</Text>
                    </View>
                    <View style={styles.balanceAmtCont}>
                      <Text style={styles.balanceAmtText}>
                        {authCtx.balance.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.balanceView}>
                    <View style={styles.balanceHeadCont}>
                      <Text style={styles.balanceHeadText}>Casino Balance</Text>
                    </View>
                    <View style={styles.balanceAmtCont}>
                      <Text style={styles.balanceAmtText}>
                        {(authCtx.casino / 10).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.balanceView}>
                  <View style={styles.balanceHeadCont}>
                    <TouchableOpacity
                      onPress={() => {
                        setLoginType(0);
                      }}
                      disabled={loading}
                      style={[
                        styles.signupCont,
                        {
                          marginBottom: 0,
                          backgroundColor: "#008000",
                          // backgroundColor: "#FF0000",
                          borderWidth: loginType === 0 ? 1 : 0,
                          borderColor: "#fff",
                        },
                      ]}
                    >
                      <Text style={styles.signupText}>Deposit</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.balanceHeadCont}>
                    <TouchableOpacity
                      onPress={() => {
                        setLoginType(1);
                      }}
                      disabled={loading}
                      style={[
                        styles.signupCont,
                        {
                          marginBottom: 0,
                          backgroundColor: "#FF0000",
                          // backgroundColor: "#008000",
                          borderWidth: loginType === 1 ? 1 : 0,
                          borderColor: "#fff",
                        },
                      ]}
                    >
                      <Text style={styles.signupText}>Withdrawal</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={[styles.balanceCont, { marginTop: 5 }]}>
                  <Text style={styles.balanceHeadText}>
                    {loginType === 0 ? "Deposit" : "Withdrawal"}
                  </Text>
                </View>

                <View style={styles.inputCont}>
                  <View style={[styles.inputView, { flexDirection: "row" }]}>
                    <TextInput
                      style={[styles.inputText, { flex: 1 }]}
                      placeholder="Amount"
                      placeholderTextColor="#959CA7"
                      value={phone}
                      onChangeText={(value) => {
                        value.length <= 10 && setPhone(value);
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
                      Please enter correct Amount
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
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CasinoBalanceModal;

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
  balanceCont: {
    marginHorizontal: 40,
  },
  balanceView: {
    flexDirection: "row",
    marginVertical: 5,
  },
  balanceHeadCont: {
    flex: 1,
  },
  balanceHeadText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  balanceAmtCont: {
    flex: 1,
  },
  balanceAmtText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});

import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Modal,
  StyleSheet,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Button,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-toast-message";
import { useIsFocused } from "@react-navigation/native";
import RazorPay from "./RazorPay";
import { AuthContext } from "../../store/auth-context";
import { DepositPayment, GetSetting } from "../../util/http";
import { Config } from "../../../config";

const RazorPayModal = ({ modalVisible, setModalVisible, minDeposit }) => {
  const isFocused = useIsFocused();
  const authCtx = useContext(AuthContext);
  const userData =
    authCtx.token === null || authCtx.token === undefined
      ? ""
      : JSON.parse(authCtx.token);

  const [inputs, setinputs] = useState({
    amount: {
      value: 0,
      isValid: true,
    },
  });
  const [loading, setLoading] = useState(false);
  const [razorpayKey, setRazorpayKey] = useState("");

  useEffect(() => {

    if(authCtx.token != null || authCtx.token != undefined){
      const userData = JSON.parse(authCtx.token);
      const PostGetSetting = async () => {
        const getKey = await GetSetting({}, userData.verifytoken);
          
        if(getKey.success === true ){
          setRazorpayKey(getKey.data.razorpaykey);
        } 
      }
      PostGetSetting();
    }
    
  }, [isFocused])

  function inputChangeHandler(inputIdentifier, enteredValue) {
    if (!isNaN(enteredValue)) {
      setinputs((currentInputs) => {
        return {
          ...currentInputs,
          [inputIdentifier]: { value: enteredValue, isValid: true },
        };
      });
    }
  }

  const UpdateTextInput = (addOn) => {
    setinputs((curInputs) => {
      return {
        amount: {
          value: `${addOn}`,
          isValid: true,
        },
      };
    });
  };

  const submitRazorPayData = async () => {
    setLoading(true);
    const submitData = {
      submitName: userData.details?.fullname,
      submitContact: userData.details?.mobile,
      submitAmount: inputs.amount.value,
    };

    const amountIsValid =
      submitData.submitAmount >= minDeposit && submitData.submitAmount <= 50000;

    if (!amountIsValid) {
      setinputs((curInputs) => {
        return {
          amount: {
            value: curInputs.amount.value,
            isValid: amountIsValid,
          },
        };
      });
      setLoading(false);
      return;
    }

    const paymentData = {
      type: "razorpay",
      image: "",
      managerId: Config.ManagerId,
      amount: submitData.submitAmount,
      depositId: "644a080a04a72236c0bdb4f8",
    };

    const depositPayment = await DepositPayment(
      paymentData,
      userData.verifytoken
    );

    if (depositPayment.success == true) {
    } else {
      setModalVisible(!modalVisible);
      Toast.show({
        type: "error",
        text1: "Deposit payment",
        text2: `${depositPayment.message}. 😔`,
      });
      setLoading(false);
      return;
    }
    setLoading(false);

    RazorPay(
      submitData.submitName,
      submitData.submitContact,
      submitData.submitAmount,
      depositPayment.doc.orderId,
      modalVisible,
      setModalVisible,
      razorpayKey,
      userData
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={[styles.modalBox]}>
            <View
              style={styles.container}
            >
              <View style={styles.hideIconView}>
                <TouchableOpacity
                  style={styles.hideIconPress}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    setinputs((curInputs) => {
                      return {
                        amount: {
                          value: "",
                          isValid: true,
                        },
                      };
                    });
                  }}
                >
                  <Image
                    source={require("../../assets/images/iconPNG/closeIcon.png")}
                    resizeMode="contain"
                    style={styles.hideIconImg}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.imageHolder}>
                <Text style={styles.headingText}>Deposit Amount</Text>
              </View>

              {!inputs.amount.isValid && (
                <View style={styles.textFooterError}>
                  <Text style={[styles.textMinAmtError, { color: "red" }]}>
                    Please enter valid amount between {minDeposit} - 50000
                  </Text>
                </View>
              )}

              <View
                style={[
                  styles.inputViewHolder,
                  !inputs.amount.isValid ? styles.errorInputViewHolder : "",
                ]}
              >
                <Icon
                  name="rupee"
                  size={14}
                  color="#2CC597"
                  style={{ flex: 0.6 }}
                />
                <TextInput
                  style={styles.textInputStyle}
                  placeholder="Enter Amount"
                  placeholderTextColor={"#959CA7"}
                  value={inputs.amount.value}
                  onChangeText={inputChangeHandler.bind(this, "amount")}
                  autoCapitalize="none"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.textFooter}>
                <Text style={styles.textMinAmt}>Min Amt. : {minDeposit}</Text>
                <Text style={[styles.textMinAmt, { textAlign: "right" }]}>
                  Max Amt. : 50000
                </Text>
              </View>

              <View style={styles.valueFillView}>
                <TouchableOpacity
                  onPress={() => {
                    UpdateTextInput(500);
                  }}
                  style={styles.valueFileButton}
                >
                  <Text style={styles.valueFillText}>+ 500</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    UpdateTextInput(1000);
                  }}
                  style={styles.valueFileButton}
                >
                  <Text style={styles.valueFillText}>+ 1000</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    UpdateTextInput(1500);
                  }}
                  style={styles.valueFileButton}
                >
                  <Text style={styles.valueFillText}>+ 1500</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    UpdateTextInput(2000);
                  }}
                  style={styles.valueFileButton}
                >
                  <Text style={styles.valueFillText}>+ 2000</Text>
                </TouchableOpacity>
              </View>
                <TouchableOpacity
                  style={styles.pressableStyle}
                  onPress={() => {
                    submitRazorPayData();
                  }}
                  disabled={loading}
                >
                  {!loading ? (
                    <Text style={styles.pressableText}>SUBMIT</Text>
                  ) : (
                    <ActivityIndicator size={"small"} color={"#fff"} />
                  )}
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalView: {
    width: "100%",
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
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
    backgroundColor: "#fff",
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
  imageHolder: {
    alignItems: "center",
    marginTop: 5,
    marginBottom: 23,
  },
  headingText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  imageStyles: {
    width: 200,
    height: 100,
    resizeMode: "contain",
  },
  inputViewHolder: {
    marginHorizontal: 15,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: "#fff",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    elevation: 10,
  },
  errorInputViewHolder: {
    borderWidth: 1,
    borderColor: "#e00404",
  },
  textInputStyle: {
    flex: 7,
    padding: 0,
    fontSize: 12,
    color: "#2CC597",
    fontWeight: "400",
  },
  pressableStyle: {
    backgroundColor: "#2CC597",
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 24,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  pressableText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  textFooter: {
    flexDirection: "row",
    marginHorizontal: 15,
    marginTop: 5,
  },
  textMinAmt: {
    flex: 1,
    color: "#959CA7",
    fontSize: 12,
    fontWeight: "400",
  },
  textFooterError: {
    flexDirection: "row",
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#F8D7DA",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  textMinAmtError: {
    color: "#959CA7",
    fontSize: 12,
    fontWeight: "400",
  },
  valueFillView: {
    flexDirection: "row",
    marginTop: 15,
    marginBottom: 5,
    marginHorizontal: 15,
    justifyContent: "space-between",
  },
  valueFileButton: {
    // backgroundColor: "#364253",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  valueFillText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "400",
  },
});

export default RazorPayModal;

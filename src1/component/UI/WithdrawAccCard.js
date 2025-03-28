import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Modal,
  Text,
  StyleSheet,
  Pressable,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import { Dropdown } from "react-native-element-dropdown";
import { AuthContext } from "../../store/auth-context";
import { AddWithdrawalMethod, GetBankList, ResendOtp, SendOtpWallet } from "../../util/http";
import { Config } from "../../../config";
import OTPTextView from "react-native-otp-textinput";

const TextInputCard = (props) => {
  return (
    <View
      style={[
        styles.inputViewHolder,
        !props.validity ? styles.errorInputViewHolder : "",
      ]}
    >
      <TextInput
        style={styles.textInputStyle}
        placeholder={props.placeHolder}
        keyboardType={props.type}
        placeholderTextColor={"#959CA7"}
        value={props.textFiled}
        onChangeText={props.setText}
        editable={props.editable}
        autoCapitalize="none"
      />
    </View>
  );
};

const WithdrawAccCard = ({
  inputs,
  setInputs,
  onAddWithdrawal,
  gatewayData,
  cancelExecution,
  setPageIndex,
  goToFirstIndex,
  mobile,
}) => {
  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(0);
  const [bankList, setBankList] = useState([])

  function inputChangeHandler(inputIdentifier, enteredValue) {
    setInputs((currentInputs) => {
      return {
        ...currentInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true },
      };
    });
  }

  useEffect(() => {
    if(bankList.length > 0) return;

    requestBankList();
  }, [bankList])

  const requestBankList = async() => {
    if(authCtx.token == null || authCtx.token == undefined) return;
    
    const userData = JSON.parse(authCtx.token);
    const data = {
      user_id: userData?.details?._id
    };
    console.log(1);

    const getList = await GetBankList(data);
    if(getList.success) {
      if(getList.data && getList.data.length>0) {
        const requiredData = getList.data.map(item => {
          return {
            label: item.name,
            value: item.name,
          };
        })
        setBankList(requiredData);
      }
    }
  }


  // const bankList = [
  //   {
  //     label: "Abhudaya Co-Operation Bank Ltd",
  //     value: "Abhudaya Co-Operation Bank Ltd",
  //   },
  //   { label: "Allahabad Bank", value: "Allahabad Bank" },
  //   { label: "Andhra Bank", value: "Andhra Bank" },
  //   { label: "AU Small Finance Bank", value: "AU Small Finance Bank" },
  //   { label: "Axis Bank", value: "Axis Bank" },
  //   { label: "Bandhan Bank", value: "Bandhan Bank" },
  //   {
  //     label: "Bank of Bahrain and Kuwait",
  //     value: "Bank of Bahrain and Kuwait",
  //   },
  //   { label: "Bank of Baroda", value: "Bank of Baroda" },
  //   { label: "Bank of India", value: "Bank of India" },
  //   { label: "Bank of Maharashatra", value: "Bank of Maharashatra" },
  //   { label: "Canara Bank", value: "Canara Bank" },
  //   { label: "Catholic Syrian Bank", value: "Catholic Syrian Bank" },
  //   { label: "Central Bank of India", value: "Central Bank of India" },
  //   { label: "Citibank", value: "Citibank" },
  //   { label: "City Union Bank", value: "City Union Bank" },
  //   { label: "Corporation Bank", value: "Corporation Bank" },
  //   { label: "DCB Bank", value: "DCB Bank" },
  //   { label: "Dhanlaxmi Bank", value: "Dhanlaxmi Bank" },
  //   {
  //     label: "Equitas Small Finance Bank",
  //     value: "Equitas Small Finance Bank",
  //   },
  //   { label: "Federal Bank", value: "Federal Bank" },
  //   { label: "HDFC Bank", value: "HDFC Bank" },
  //   { label: "ICICI Bank", value: "ICICI Bank" },
  //   { label: "IDBI Bank", value: "IDBI Bank" },
  //   { label: "IDFC First Bank", value: "IDFC First Bank" },
  //   { label: "Indiabulls", value: "Indiabulls" },
  //   { label: "Indian Overseas Bank", value: "Indian Overseas Bank" },
  //   { label: "IndusInd Bank", value: "IndusInd Bank" },
  //   { label: "ING Vysya Bank", value: "ING Vysya Bank" },
  //   { label: "Jammu & Kashmir Bank", value: "Jammu & Kashmir Bank" },
  //   { label: "Karnataka Bank Ltd", value: "Karnataka Bank Ltd" },
  //   { label: "Karur Vysya Bank", value: "Karur Vysya Bank" },
  //   { label: "Kotak Mahindra Bank", value: "Kotak Mahindra Bank" },
  //   { label: "Lakshmi Vilas Bank", value: "Lakshmi Vilas Bank" },
  //   { label: "Nainital Bank", value: "Nainital Bank" },
  //   { label: "Oriental Bank of Commerce", value: "Oriental Bank of Commerce" },
  //   { label: "Paytm Payments Bank", value: "Paytm Payments Bank" },
  //   { label: "Punjab & Sind Bank", value: "Punjab & Sind Bank" },
  //   { label: "Punjab National Bank", value: "Punjab National Bank" },
  //   { label: "RBL Bank", value: "RBL Bank" },
  //   {
  //     label: "Shamrao Vitthal Co-operative Bank",
  //     value: "Shamrao Vitthal Co-operative Bank",
  //   },
  //   { label: "South Indian Bank", value: "South Indian Bank" },
  //   { label: "Standard Chartered", value: "Standard Chartered" },
  //   {
  //     label: "State Bank of Bikaner & Jaipur",
  //     value: "State Bank of Bikaner & Jaipur",
  //   },
  //   { label: "State Bank of Hyderabad", value: "State Bank of Hyderabad" },
  //   { label: "State Bank of India", value: "State Bank of India" },
  //   { label: "State Bank of Mysore", value: "State Bank of Mysore" },
  //   { label: "State Bank of Patiala", value: "State Bank of Patiala" },
  //   { label: "State Bank of Travancore", value: "State Bank of Travancore" },
  //   { label: "Syndicate Bank", value: "Syndicate Bank" },
  //   {
  //     label: "Tamilnad Mercantile Bank Ltd",
  //     value: "Tamilnad Mercantile Bank Ltd",
  //   },
  //   { label: "UCO Bank", value: "UCO Bank" },
  //   { label: "Union Bank of India", value: "Union Bank of India" },
  //   { label: "United Bank of India", value: "United Bank of India" },
  //   { label: "Vijaya Bank", value: "Vijaya Bank" },
  //   { label: "Yes Bank Ltd", value: "Yes Bank Ltd" },
  // ];

  const SubmitButtonHandler = async () => {
    // const userData = authCtx.walletToken;
    const userData = JSON.parse(authCtx.token);
    setLoading(true);
    if (gatewayData?.type === "Bank") {
      const submitData = {
        submitBankName: inputs.bankSelect.value.value,
        submitIFSC: inputs.ifscCode.value,
        submitAccNumber: inputs.accNumber.value,
        submitHolderName: inputs.holderName.value,
        submitHolderOtp: inputs.otp.value,
      };

      const bankNameIsvalid = submitData.submitBankName.trim().length > 0;
      const ifscIsValid = submitData.submitIFSC.trim().length > 0;
      const accNumberIsValid = submitData.submitAccNumber.trim().length > 0;
      const holderNameIsValid = submitData.submitHolderName.trim().length > 0;
      const otpIsValid = submitData.submitHolderOtp.trim().length === 4;

      if (
        !bankNameIsvalid ||
        !ifscIsValid ||
        !accNumberIsValid ||
        !holderNameIsValid ||
        !otpIsValid
      ) {
        setInputs((curInputs) => {
          return {
            bankSelect: {
              value: { value: curInputs.bankSelect.value.value },
              isValid: bankNameIsvalid,
            },

            ifscCode: {
              value: curInputs.ifscCode.value,
              isValid: ifscIsValid,
            },

            accNumber: {
              value: curInputs.accNumber.value,
              isValid: accNumberIsValid,
            },

            holderName: {
              value: curInputs.holderName.value,
              isValid: holderNameIsValid,
            },
            otp: {
              value: curInputs.otp.value,
              isValid: otpIsValid,
            },
          };
        });
        setLoading(false);
        return;
      }

      let data = {
        accnumber: submitData.submitAccNumber,
        bankName: submitData.submitBankName,
        user_id: userData?.details?._id,
        ifsc: submitData.submitIFSC,
        name: submitData.submitHolderName,
        type: gatewayData.type,
        upi: "",
        withdrawlId: gatewayData._id,
        otp: submitData.submitHolderOtp,
      };

      const addWithdrawal = await AddWithdrawalMethod(data);
      setLoading(false);
      if (addWithdrawal.success == true) {
        Toast.show({
          type: "success",
          text1: "Withdrawal Method",
          text2: `Your withdrawal method has been added successfully. 😁`,
        });
        onAddWithdrawal();
        setType(0);
        setInputs({
          bankSelect: {
            value: { value: "" },
            isValid: true,
          },
          ifscCode: {
            value: "",
            isValid: true,
          },
          accNumber: {
            value: "",
            isValid: true,
          },
          holderName: {
            value: "",
            isValid: true,
          },
          upiNumber: {
            value: "",
            isValid: true,
          },
          otp: {
            value: "",
            isValid: true,
          },
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Withdrawal Method",
          text2: `${addWithdrawal.message} 😔`,
        });
        return;
      }
    } else {
      const submitData = {
        submitHolderName: inputs.holderName.value,
        submitHolderNumber: inputs.upiNumber.value,
        submitHolderOtp: inputs.otp.value,
      };

      const holderNameIsValid = submitData.submitHolderName.trim().length > 0;
      const holderNumIsValid = submitData.submitHolderNumber.trim().length > 0;
      const otpIsValid = submitData.submitHolderOtp.trim().length === 4;

      if (!holderNameIsValid || !holderNumIsValid || !otpIsValid) {
        setInputs((curInputs) => {
          return {
            holderName: {
              value: curInputs.holderName.value,
              isValid: holderNameIsValid,
            },
            upiNumber: {
              value: curInputs.upiNumber.value,
              isValid: holderNumIsValid,
            },
            otp: {
              value: curInputs.otp.value,
              isValid: otpIsValid,
            },
          };
        });
        setLoading(false);
        return;
      }

      let data = {
        accnumber: '',
        bankName: '',
        ifsc: '',
        // type: gatewayData.type,
        name: submitData.submitHolderName,
        otp: submitData.submitHolderOtp,
        user_id: userData?.details?._id,
        upi: submitData.submitHolderNumber,
        withdrawlId: gatewayData._id,
      };

      const addWithdrawal = await AddWithdrawalMethod(data);
      setLoading(false);
      if (addWithdrawal.success == true) {
        Toast.show({
          type: "success",
          text1: "Withdrawal Method",
          text2: `Your withdrawal method has been added successfully. 😁`,
        });

        onAddWithdrawal(gatewayData?.type);
        setType(0);
        setInputs({
          bankSelect: {
            value: { value: "" },
            isValid: true,
          },
          ifscCode: {
            value: "",
            isValid: true,
          },
          accNumber: {
            value: "",
            isValid: true,
          },
          holderName: {
            value: "",
            isValid: true,
          },
          upiNumber: {
            value: "",
            isValid: true,
          },
          otp: {
            value: "",
            isValid: true,
          },
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Withdrawal Method",
          text2: `${addWithdrawal.message} 😔`,
        });
        return;
      }
    }

    setPageIndex(0);
    goToFirstIndex();
  };

  const sendOtpHandler = async () => {
    setLoading(true);
    // const userData = authCtx.walletToken;
    const userData = JSON.parse(authCtx.token);
    const sendData = {
      user_id: userData?.details?._id,
    };

    const userOtp = await SendOtpWallet(sendData);
    setLoading(false);
    if (userOtp.success == true) {
      Toast.show({
        type: "success",
        text1: "Withdrawal Otp",
        text2: `Otp has been sent successfully. 😁`,
      });
      setType(1);
    } else {
      Toast.show({
        type: "error",
        text1: "Withdrawal Otp",
        text2: `${userOtp.message} 😔`,
      });
    }
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
    <View style={styles.mainView}>
      <View style={styles.paymentImageView}>
        <View style={styles.paymentImagecontainer}>
          {gatewayData?.type === "Bank" ? (
            <Image
              source={require("../../assets/images/iconPNG/bank.png")}
              resizeMode="contain"
              style={styles.gatewayImgStyles}
            />
          ) : gatewayData?.type === "google_pay" ? (
            <Image
              source={require("../../assets/images/iconPNG/googlePay.png")}
              resizeMode="contain"
              style={styles.gatewayImgStyles}
            />
          ) : gatewayData?.type === "paytm" ? (
            <Image
              source={require("../../assets/images/iconPNG/paytmUPI.png")}
              resizeMode="contain"
              style={styles.gatewayImgStyles}
            />
          ) : gatewayData?.type === "phone_pe" ? (
            <Image
              source={require("../../assets/images/iconPNG/phonePe.png")}
              resizeMode="contain"
              style={styles.gatewayImgStyles}
            />
          ) : (
            <Image
              source={require("../../assets/images/iconPNG/upi.png")}
              resizeMode="contain"
              style={styles.gatewayImgStyles}
            />
          )}
        </View>
      </View>

      <View style={styles.methodCont}>
        {gatewayData?.type === "Bank" ? (
          <>
            <View
              style={[
                styles.inputViewHolder,
                !inputs.bankSelect.isValid ? styles.errorInputViewHolder : "",
              ]}
            >
              <Dropdown
                placeholderStyle={[styles.textInputStyle, { color: "#959CA7" }]}
                selectedTextStyle={styles.textInputStyle}
                itemContainerStyle={styles.dropdownItemContainerStyle}
                itemTextStyle={styles.textInputStyle}
                data={bankList}
                maxHeight={200}
                labelField="label"
                valueField="value"
                placeholder="Select Bank"
                value={inputs.bankSelect.value}
                onChange={inputChangeHandler.bind(this, "bankSelect")}
              />
            </View>

            <TextInputCard
              textFiled={inputs.ifscCode.value}
              setText={inputChangeHandler.bind(this, "ifscCode")}
              validity={inputs.ifscCode.isValid}
              type="default"
              placeHolder="IFSC*"
              editable={true}
            />

            <TextInputCard
              textFiled={inputs.accNumber.value}
              setText={inputChangeHandler.bind(this, "accNumber")}
              validity={inputs.accNumber.isValid}
              type="numeric"
              placeHolder="Account Number*"
              editable={true}
            />

            <TextInputCard
              textFiled={inputs.holderName.value}
              setText={inputChangeHandler.bind(this, "holderName")}
              validity={inputs.holderName.isValid}
              type="default"
              placeHolder="Name*"
              editable={true}
            />

            {type === 1 && (
              <>
                <OTPTextView
                  ref={(e) => e}
                  containerStyle={styles.otpContainer}
                  textInputStyle={styles.inputotpText}
                  offTintColor="#e8e8e8"
                  handleTextChange={(value) => {
                    value.length <= 4 && inputChangeHandler("otp", value);
                  }}
                  inputCount={4}
                  keyboardType="numeric"
                />
                {!inputs?.otp?.isValid && (
                  <Text style={styles.errorText}>Please enter correct OTP</Text>
                )}
              </>
            )}

            <TouchableOpacity
              disabled={loading}
              style={styles.pressableButtonStyles}
              onPress={() => {
                type === 0 ? sendOtpHandler() : SubmitButtonHandler();
              }}
            >
              {!loading ? (
                <Text style={styles.buttonText}>SUBMIT</Text>
              ) : (
                <ActivityIndicator size={"small"} color={"#fff"} />
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.linkView}>
              <Text style={styles.detailText}>Link Payment wallet</Text>
              {/* <Text
                style={[styles.detailText, { fontSize: 20, fontWeight: "500" }]}
              >
                +91 {mobile}
              </Text> */}
            </View>

            <TextInputCard
              textFiled={inputs?.upiNumber.value}
              setText={inputChangeHandler.bind(this, "upiNumber")}
              validity={inputs?.upiNumber.isValid}
              type="default"
              placeHolder="UPI No.*"
              editable={true}
            />

            <TextInputCard
              textFiled={inputs.holderName.value}
              setText={inputChangeHandler.bind(this, "holderName")}
              validity={inputs.holderName.isValid}
              type="default"
              placeHolder="Name*"
              editable={true}
            />

            {type === 1 && (
              <>
                <OTPTextView
                  ref={(e) => e}
                  containerStyle={styles.otpContainer}
                  textInputStyle={styles.inputotpText}
                  offTintColor="#e8e8e8"
                  handleTextChange={(value) => {
                    value.length <= 4 && inputChangeHandler("otp", value);
                  }}
                  inputCount={4}
                  keyboardType="numeric"
                />
                {!inputs?.otp?.isValid && (
                  <Text style={styles.errorText}>Please enter correct OTP</Text>
                )}
              </>
            )}

            <TouchableOpacity
              style={styles.pressableButtonStyles}
              onPress={() => {
                type === 0 ? sendOtpHandler() : SubmitButtonHandler();
              }}
            >
              {!loading ? (
                <Text style={styles.buttonText}>SUBMIT</Text>
              ) : (
                <ActivityIndicator size={"small"} color={"#fff"} />
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
      {type != 0 && (
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    margin: 10,
  },
  paymentImageView: {
    marginVertical: 5,
    alignItems: "center",
  },
  paymentImagecontainer: {
    backgroundColor: "#fff",
    borderRadius: 4,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DAA520",
  },
  gatewayImgStyles: {
    height: 30,
    width: 30,
  },
  methodCont: {
    margin: 10,
  },
  inputViewHolder: {
    marginHorizontal: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
    paddingVertical: 7,
    backgroundColor: "#e8e8e8",
    borderRadius: 5,
  },
  errorInputViewHolder: {
    borderWidth: 1,
    borderColor: "#e00404",
  },
  textInputStyle: {
    padding: 0,
    fontSize: 12,
    color: "#000",
    fontWeight: "500",
  },
  dropdownItemContainerStyle: {
    justifyContent: "center",
    height: 50,
    borderBottomWidth: 1,
    borderColor: "#eaedf6",
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  pressableButtonStyles: {
    marginHorizontal: 5,
    marginVertical: 7,
    paddingVertical: 9,
    backgroundColor: "#DAA520",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  linkView: {
    marginVertical: 10,
    alignItems: "center",
  },
  detailText: {
    fontSize: 10,
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
  errorText: {
    color: "red",
    fontSize: 12,
    fontWeight: "500",
  },
  fotterCont: {
    flexDirection: "row",
    marginHorizontal: 40,
    // marginBottom: 20,
  },
  fotterBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fotterBtnText: {
    color: "#DAA520",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default WithdrawAccCard;

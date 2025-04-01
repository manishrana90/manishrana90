import React, { useLayoutEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../../store/auth-context";
import Ionicon from "react-native-vector-icons/Ionicons";
import {
  AddWithdrawalMethod,
  RemoveWithdrawalMethod,
  SendOtpWallet,
} from "../../util/http";
import Toast from "react-native-toast-message";
import WithdrawalItem from "./WithdrawalItem";
import OtpModal from "./OtpModal";
import WithdrawalItemBank from "./WithdrawalItemBank";

const WithdrawOptionProceed = ({
  gatewayData,
  setDisplayStep,
  onAddWithdrawal,
  showData,
}) => {
  const authCtx = useContext(AuthContext);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [errorPh, setPhError] = useState(false);
  const [otpModal, setOtpModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(0);
  const [removeId, setRemoveId] = useState("");

  const submitButtonHandler = async (otp) => {
    setLoading(true);
    // const userData = authCtx.walletToken;
    const userData = JSON.parse(authCtx.token);

    const submitData = {
      submitHolderName: name,
      submitHolderNumber: phone,
    };

    const nameIsValid = submitData.submitHolderName.trim().length > 0;
    const phoneIsValid = submitData.submitHolderNumber.trim().length > 5;

    if (!nameIsValid || !phoneIsValid) {
      setError(!nameIsValid);
      setPhError(!phoneIsValid);
      setLoading(false);
      return;
    }

    let data = {
      // type: gatewayData.type,
      // name: submitData.submitHolderName,
      // upi: submitData.submitHolderNumber,
      // withdrawlId: gatewayData._id,
      // otp: otp,
      
      accnumber: '',
      bankName: '',
      ifsc: '',
      name: submitData.submitHolderName,
      otp: otp,
      user_id: userData?.details?._id,
      upi: submitData.submitHolderNumber,
      withdrawlId: gatewayData._id,
    };

    const addWithdrawal = await AddWithdrawalMethod(data, userData.token);
    setLoading(false);
    if (addWithdrawal.success == true) {
      setOtpModal(false);
      Toast.show({
        type: "success",
        text1: "Withdrawal Method",
        text2: `Your withdrawal method has been added successfully. 😁`,
      });
      onAddWithdrawal();
      setName("");
      setPhone("");
      setDisplayStep(0);
    } else {
      Toast.show({
        type: "error",
        text1: "Withdrawal Method",
        text2: `${addWithdrawal.message} 😔`,
      });
    }
  };

  const removeButtonHandler = async (otp) => {
    setLoading(true);
    // const userData = authCtx.walletToken;
    const userData = JSON.parse(authCtx.token);

    let data = {
      user_id: userData?.details?._id, 
      id: removeId,
      otp: otp,
    };

    console.log("Data: ", data);
      
    const removeWithdrawal = await RemoveWithdrawalMethod(data);
    console.log("remove: ", removeWithdrawal)
    setLoading(false);
    if (removeWithdrawal.success == true) {
      setOtpModal(false);
      Toast.show({
        type: "success",
        text1: "Withdrawal Method",
        text2: `Your withdrawal method has been deleted successfully. 😁`,
      });
      onAddWithdrawal();
      setName("");
      setPhone("");
      setDisplayStep(0);
    } else {
      Toast.show({
        type: "error",
        text1: "Withdrawal Method",
        text2: `${removeWithdrawal.message} 😔`,
      });
    }
  };

  const sendOtpHandler = async () => {
    setLoading(true);
    // const userData = authCtx.walletToken;

    const submitData = {
      submitHolderName: name,
      submitHolderNumber: phone,
    };

    const nameIsValid = submitData.submitHolderName.trim().length > 0;
    const phoneIsValid = submitData.submitHolderNumber.trim().length > 5;


    if ((!nameIsValid || !phoneIsValid) && type === 0) {
      setError(!nameIsValid);
      setPhError(!phoneIsValid);
      setLoading(false);
      return;
    }

    console.log("Type2: ",type)

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
      setOtpModal(true);
    } else {
      Toast.show({
        type: "error",
        text1: "Withdrawal Otp",
        text2: `${userOtp.message} 😔`,
      });
    }
  };

  const renderWithdrawal = ({ index, item }) => {
    return (
      <WithdrawalItem
        item={item}
        loading={loading}
        onRemove={(id) => {
          setRemoveId(id);
          setType(1);
          sendOtpHandler();
        }}
      />
    );
  };

  return (
    <View style={styles.mainView}>
      <TouchableOpacity
        onPress={() => {
          setDisplayStep(0);
        }}
        style={styles.backButton}
      >
        <Ionicon size={24} color={"#fff"} name={"arrow-back"} />
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        <View style={styles.paymentImagecontainer}>
          <Image
            source={gatewayData?.name == "Gpay"?
              require("../../assets/images/iconPNG/googlePay.png") :
              gatewayData?.name == "Phonepay"?
              require("../../assets/images/iconPNG/phonePe.png") :
              gatewayData?.name?.toLowerCase() == "paytm"?
              require("../../assets/images/iconPNG/paytmUPI.png") :
              require("../../assets/images/iconPNG/upi.png")
            }
            resizeMode="contain"
            style={styles.gatewayImgStyles}
          />
        </View>
      </View>

      {showData === 0 ? (
        <>
          <View style={styles.linkView}>
            <Text style={styles.detailText}>Already Linked with</Text>
          </View>
          <FlatList
            data={gatewayData.withdrawns}
            renderItem={renderWithdrawal}
            keyExtractor={(item) => item._id}
            // horizontal={true}
          />
        </>
      ) : (
        <>
          <View style={styles.linkView}>
            <Text style={styles.detailText}>Link Payment Wallet</Text>
          </View>

          <View
            style={[
              styles.inputViewHolder,
              errorPh ? styles.errorInputViewHolder : "",
            ]}
          >
            <TextInput
              style={styles.textInputStyle}
              placeholder="UPI No."
              placeholderTextColor="#959CA7"
              value={phone}
              onChangeText={(value) => {
                setPhone(value);
                setPhError(false);
              }}
              keyboardType="default"
            />
          </View>

          <View
            style={[
              styles.inputViewHolder,
              error ? styles.errorInputViewHolder : "",
            ]}
          >
            <TextInput
              style={styles.textInputStyle}
              placeholder="Enter Name"
              placeholderTextColor="#959CA7"
              value={name}
              onChangeText={(value) => {
                setName(value);
                setError(false);
              }}
              keyboardType="default"
            />
          </View>

          <TouchableOpacity
            disabled={loading}
            style={styles.buttonView}
            onPress={() => {
              setType(0);
              sendOtpHandler();
            }}
          >
            {!loading ? (
              <Text style={styles.buttonText}>PROCEED</Text>
            ) : (
              <ActivityIndicator size={"small"} color={"#fff"} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonView, { backgroundColor: "#fff" }]}
            onPress={() => {
              setDisplayStep(0);
            }}
          >
            <Text style={[styles.buttonText, { color: "#000" }]}>CANCEL</Text>
          </TouchableOpacity>
        </>
      )}
      <OtpModal
        modalVisible={otpModal}
        loadingHead={loading}
        setModalVisible={() => {
          setOtpModal(false);
        }}
        setSuccess={(otp) => {
          type === 0 ? submitButtonHandler(otp) : removeButtonHandler(otp);
        }}
      />
    </View>
  );
};

const WithdrawOptionProceedBank = ({
  gatewayData,
  setDisplayStep,
  onAddWithdrawal,
}) => {
  const authCtx = useContext(AuthContext);
  const [otpModal, setOtpModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [removeId, setRemoveId] = useState("");

  const removeButtonHandler = async (otp) => {
    setLoading(true);
    // const userData = authCtx.walletToken;
    const userData = JSON.parse(authCtx.token);

    let data = {
      user_id: userData?.details?._id,
      id: removeId,
      otp: otp,
    };

    const removeWithdrawal = await RemoveWithdrawalMethod(data);
    console.log("remove: ", removeWithdrawal)
    setLoading(false);
    if (removeWithdrawal.success == true) {
      setOtpModal(false);
      Toast.show({
        type: "success",
        text1: "Withdrawal Method",
        text2: `Your withdrawal method has been deleted successfully. 😁`,
      });
      onAddWithdrawal();
      setDisplayStep(0);
    } else {
      Toast.show({
        type: "error",
        text1: "Withdrawal Method",
        text2: `${removeWithdrawal.message} 😔`,
      });
    }
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
      setOtpModal(true);
    } else {
      Toast.show({
        type: "error",
        text1: "Withdrawal Otp",
        text2: `${userOtp.message} 😔`,
      });
    }
  };
  const renderWithdrawal = ({ index, item }) => {
    return (
      <WithdrawalItemBank
        item={item}
        loading={loading}
        onRemove={(id) => {
          setRemoveId(id);
          sendOtpHandler();
        }}
      />
    );
  };

  return (
    <View style={styles.mainView}>
      <TouchableOpacity
        onPress={() => {
          setDisplayStep(0);
        }}
        style={styles.backButton}
      >
        <Ionicon size={24} color={"#fff"} name={"arrow-back"} />
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        <View style={styles.paymentImagecontainer}>
          {gatewayData?.type === "Bank" ? (
            <Image
              source={require("../../assets/images/iconPNG/bank.png")}
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

      <FlatList
        data={gatewayData.withdrawns}
        renderItem={renderWithdrawal}
        keyExtractor={(item) => item._id}
      />

      <OtpModal
        modalVisible={otpModal}
        loadingHead={loading}
        setModalVisible={() => {
          setOtpModal(false);
        }}
        setSuccess={(otp) => {
          removeButtonHandler(otp);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    marginTop: 20,
  },
  imageContainer: {
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
  linkView: {
    marginTop: 20,
    alignItems: "center",
  },
  detailText: {
    fontSize: 14,
    color: "#fff",
  },
  buttonView: {
    marginHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#DAA520",
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "500",
  },
  bottomView: {
    marginTop: 30,
    bottom: 5,
    width: "100%",
  },
  bottomText: {
    textAlign: "center",
    fontSize: 10,
    color: "#d7d8d9",
  },
  inputViewHolder: {
    marginTop: 10,
    marginHorizontal: 30,
    paddingHorizontal: 10,
    marginVertical: 5,
    paddingVertical: 7,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  errorInputViewHolder: {
    borderWidth: 1,
    borderColor: "#e00404",
  },
  textInputStyle: {
    padding: 0,
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  backButton: {
    left: 10,
    top: 0,
  },
});

export default WithdrawOptionProceed;
export { WithdrawOptionProceedBank };

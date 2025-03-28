import React, { useState, useContext, useLayoutEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import LottieView from "lottie-react-native";
import { AuthContext } from "../../../store/auth-context";
import LoginModal from "../../../component/UI/LoginModal";
import {
  DepositPaymentType,
  GetSetting,
  GetUserDetail,
  PaymentMethod,
} from "../../../util/http.js";
import Toast from "react-native-toast-message";
import RazorPayModal from "../../../component/UI/RazorPayModal";
import { Socket } from "../../../util/socket";
import { useIsFocused } from "@react-navigation/native";
import WalletBills from "./WalletBills";

const WalletNewHeader = (props) => {
  const authCtx = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [razorpaymodal, setRazorpayModal] = useState(false);
  const [razorpay, setRazorpay] = useState(false);
  const [minDeposit, setMinDeposit] = useState(500);

  useLayoutEffect(() => {
    async function PaymentMethodFetch() {
      if ((isFocused && authCtx.token != null) || authCtx.token != undefined) {
        const dataToken = JSON.parse(authCtx.token);
        const token = dataToken.verifytoken;

        const depositPaymentType = await DepositPaymentType(token);
        const getKey = await GetSetting({}, token);

        if (getKey.success === true && getKey?.data?.minDeposit != undefined) {
          setMinDeposit(Number(getKey.data.minDeposit));
        }
        props.setLoading();

        if (
          depositPaymentType.success == true &&
          depositPaymentType.status.razorpaystatus === "true"
        ) {
          setRazorpay(true);
        }
      } else {
        props.setLoading();
      }
    }
    PaymentMethodFetch();

    const UserBalanceDetail = async () => {
      if (isFocused && authCtx.token != null && authCtx.token != undefined) {
        const token = JSON.parse(authCtx.token);
        let data = {
          token: token.verifytoken,
          eventId: authCtx.eventId,
        };
        Socket.emit("remove-from-room", data);
        let dataVirtual = {
          token: token.verifytoken,
          eventId: "1234822733",
        };
        Socket.emit("remove-from-room-virtual", dataVirtual);

        const userDetail = await GetUserDetail(
          { userId: "" },
          token.verifytoken
        );
        if (userDetail.success == true) {
          authCtx.setBalance(JSON.parse(userDetail.doc.balance));
          if (userDetail.doc.bounsBalance) {
            authCtx.setBonus(JSON.parse(userDetail.doc.bounsBalance));
          }
        }

        if (userDetail?.logout === true) {
          authCtx.logout();
          props.navigation.navigate("Home");
          Toast.show({
            type: "error",
            text1: "Someone Login",
            text2: `Your id has been login somewhere else.`,
          });
        }
      }
    };
    UserBalanceDetail();
  }, [authCtx, isFocused, DepositPaymentType, PaymentMethod]);

  const onDepositPress = () => {
    if (razorpay) {
      setRazorpayModal(true);
    } else {
      props.navigation.navigate("DepositScreen", { minDeposit: minDeposit });
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.balanceCont, { alignItems: "center" }]}>
        <Text style={[styles.balanceText, { fontSize: 12 }]}>Main Wallet</Text>
        <Text
          style={[
            styles.balanceText,
            { fontSize: 24, fontWeight: "700", color: "#2CC597", marginTop: 4 },
          ]}
        >
          ₹ {authCtx.balance.toFixed(2)}
        </Text>
      </View>

      <View style={styles.signupCont}>
        <View style={styles.bonusCont}>
          <View style={styles.balanceCont}>
            <View style={styles.balanceBonusCont}>
              <Text
                style={[styles.balanceText, { fontSize: 12, color: "#000" }]}
              >
                <Icon name="trophy" color="#000" size={12} /> Bonus
              </Text>
              <Text
                style={[
                  styles.balanceText,
                  { fontSize: 12, fontWeight: "bold" },
                ]}
              >
                {authCtx.bonus.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.bonusCont}>
          <View style={styles.balanceCont}>
            <View style={styles.balanceBonusCont}>
              <Text
                style={[styles.balanceText, { fontSize: 12, color: "#000" }]}
              >
                <Icon name="money" color="#000" size={12} /> Cashback
              </Text>
              <Text
                style={[
                  styles.balanceText,
                  { fontSize: 12, fontWeight: "bold" },
                ]}
              >
                0.00
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.signupButtonCont}>
        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => {
            authCtx.token === null || authCtx.token === undefined
              ? setLoginModalVisible(true)
              : props.navigation.navigate("WithdrawScreen");
          }}
        >
          <View style={styles.signupIconCont}>
            <Image
              source={require(`../../../assets/images/paymentGateways/withdrawIcon.png`)}
              style={{ height: 25, width: 25, }}
            />
          </View>
          <Text style={styles.signupText}>Withdrawal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => {
            authCtx.token === null || authCtx.token === undefined
              ? setLoginModalVisible(true)
              : onDepositPress();
          }}
        >
          <View style={styles.signupIconCont}>
          <LottieView
              source={require("../../../assets/images/animation/deposit.json")}
              autoPlay={true}
              style={styles.lessHeight}
            />
          {/* <Image
              source={require(`../../../assets/images/paymentGateways/deposit.png`)}
              style={{ height: 25, width: 25, tintColor: "#2CC597", resizeMode: "contain" }}
              resizeMode="contain"
            /> */}
          </View>
          <Text style={styles.signupText}>Deposit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => {
            authCtx.token === null || authCtx.token === undefined
              ? setLoginModalVisible(true)
              : props.navigation.navigate("TransactionHistory");
          }}
        >
          <View style={styles.signupIconCont}>
          <Image
              source={require(`../../../assets/images/iconPNG/tranHistoryIcon.png`)}
              style={{ height: 21, width: 15, tintColor: "#2CC597" }}
            />
          </View>
          <Text style={styles.signupText}>Transaction</Text>
        </TouchableOpacity>
      </View>

      <WalletBills />

      <LoginModal
        modalVisible={loginModalVisible}
        setModalVisible={setLoginModalVisible}
        navigationType={""}
      />
      <RazorPayModal
        modalVisible={razorpaymodal}
        setModalVisible={setRazorpayModal}
        minDeposit={minDeposit}
      />
    </View>
  );
};

export default WalletNewHeader;

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    backgroundColor: "#fff",
  },
  balanceCont: {
    marginVertical: 8,
  },
  balanceBonusCont: {
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 15,
    justifyContent: "space-between",
  },
  balanceText: {
    color: "#000",
    fontSize: 21,
    fontWeight: "400",
  },
  signupCont: {
    flexDirection: "row",
    marginHorizontal: 5,
  },
  signupButtonCont: {
    flexDirection: "row",
    marginTop: 7,
    marginBottom: 16,
    marginHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  signupButton: {
    flex: 1,
    marginHorizontal: 9,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 5,
  },
  signupIconCont: {
    // borderRadius: 50,
    paddingVertical: 5,
    height: 40,
    // width: 50,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "#1E2836",
  },
  signupText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "500",
    // marginBottom: 5,
  },
  bonusCont: {
    flex: 1,
  },
  lessHeight: {
    width: 40,
    height: 40,
  },
});

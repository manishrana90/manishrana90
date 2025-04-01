import React, { useState, useContext } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { AuthContext } from "../../../store/auth-context";
import LoginModal from "../../../component/UI/LoginModal";

import { Config } from "../../../../config.js";

const WalletHeader = (props) => {
  const authCtx = useContext(AuthContext);
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  const onDepositPress = () => {
    props.navigation.navigate("DepositScreen", {
      minDeposit: Config.MinDeposit,
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.balanceCont, { alignItems: "center" }]}>
        <Text style={[styles.balanceText, { fontSize: 12 }]}>Main Wallet</Text>
        <Text
          style={[
            styles.balanceText,
            { fontSize: 24, fontWeight: "700", color: "#DAA520", marginTop: 4 },
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
                style={[styles.balanceText, { fontSize: 12, color: "#959CA7" }]}
              >
                <Icon name="trophy" color="#959CA7" size={12} /> Bonus
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
                style={[styles.balanceText, { fontSize: 12, color: "#959CA7" }]}
              >
                <Icon name="money" color="#959CA7" size={12} /> Cashback
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

      {Config.isWallet && (
        <View
          style={[
            styles.signupCont,
            { marginTop: 7, marginBottom: 16, marginHorizontal: 16 },
          ]}
        >
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => {
              authCtx.token === null || authCtx.token === undefined
                ? setLoginModalVisible(true)
                : onDepositPress();
            }}
          >
            <View
              colors={["#01B636", "#74E39A"]}
              style={{
                borderRadius: 4,
                paddingVertical: 5,
                width: "100%",
                alignItems: "center",
                backgroundColor: "#57c660",
              }}
            >
              <Text style={styles.signupText}>Deposit</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => {
              authCtx.token === null || authCtx.token === undefined
                ? setLoginModalVisible(true)
                : props.navigation.navigate("WithdrawScreen", {
                    methods: props.withdrawalMethod,
                  });
            }}
          >
            <View
              style={{
                borderRadius: 4,
                paddingVertical: 5,
                width: "100%",
                alignItems: "center",
                backgroundColor: "#FF7A2F",
              }}
            >
              <Text style={styles.signupText}>Withdrawal</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      <LoginModal
        modalVisible={loginModalVisible}
        setModalVisible={setLoginModalVisible}
        navigationType={""}
      />
    </View>
  );
};

export default WalletHeader;

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    backgroundColor: "#212A37",
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
    color: "#fff",
    fontSize: 21,
    fontWeight: "400",
  },
  signupCont: {
    flexDirection: "row",
  },
  signupButton: {
    flex: 1,
    marginHorizontal: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
    margin: 5,
  },
  bonusCont: {
    flex: 1,
  },
});

import React, { useState, useContext } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Linking,
} from "react-native";
import LoginModal from "../../../component/UI/LoginModal";
import { AuthContext } from "../../../store/auth-context";
import { Config } from "../../../../config";

const windowWidth = Dimensions.get("window").width;

const WalletTransaction = ({ navigation, withdrawalMethod }) => {
  const authCtx = useContext(AuthContext);
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity
        style={styles.innerCont}
        onPress={() => {
          Linking.openURL(
            "whatsapp://send?text=" + "Hello !" + "&phone=91" + "9027350140"
          );
        }}
      >
        <View style={styles.amountCont}>
          <Image
            source={require("../../../assets/images/iconPNG/supportIcon.png")}
            resizeMode="contain"
            style={styles.iconImg}
          />
        </View>
        <View style={styles.detailCont}>
          <View style={styles.detailInnerCont}>
            <Text style={styles.detailHeading}>Support</Text>
          </View>
          <View style={styles.detailLowerInner}>
            <Text
              style={[
                styles.detailHeading,
                { fontSize: 11, color: "#959CA7", fontWeight: "400" },
              ]}
            >
              If you have any questions, we will help you
            </Text>
          </View>
        </View>
      </TouchableOpacity> */}

      {Config.isWallet && (
        <>
          <TouchableOpacity
            style={styles.innerCont}
            onPress={() => {
              authCtx.token === null || authCtx.token === undefined
                ? setLoginModalVisible(true)
                : navigation.navigate("WithdrawalOptions", {
                    methods: withdrawalMethod,
                  });
            }}
          >
            <View style={styles.amountCont}>
              <Image
                source={require("../../../assets/images/iconPNG/withdrawIcon.png")}
                resizeMode="contain"
                style={styles.iconImg}
                tintColor={"#DAA520"}
              />
            </View>
            <View style={styles.detailCont}>
              <View style={styles.detailInnerCont}>
                <Text style={styles.detailHeading}>Withdrawal Options</Text>
              </View>
              <View style={styles.detailLowerInner}>
                <Text
                  style={[
                    styles.detailHeading,
                    { fontSize: 11, color: "#959CA7", fontWeight: "400" },
                  ]}
                >
                  You can add / choose your withdrawal option right here.
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.innerCont}
            onPress={() => {
              authCtx.token === null || authCtx.token === undefined
                ? setLoginModalVisible(true)
                : navigation.navigate("TransactionHistory");
            }}
          >
            <View style={styles.amountCont}>
              <Image
                source={require("../../../assets/images/iconPNG/tranHistoryIcon.png")}
                resizeMode="contain"
                style={styles.iconImg}
                tintColor={"#DAA520"}
              />
            </View>
            <View style={styles.detailCont}>
              <View style={styles.detailInnerCont}>
                <Text style={styles.detailHeading}>Transaction History</Text>
              </View>
              <View style={styles.detailLowerInner}>
                <Text
                  style={[
                    styles.detailHeading,
                    { fontSize: 11, color: "#959CA7", fontWeight: "400" },
                  ]}
                >
                  All Operations that affect the change in balance.
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.innerCont}
            onPress={() => {
              authCtx.token === null || authCtx.token === undefined
                ? setLoginModalVisible(true)
                : navigation.navigate("WalletIDs", {idType: 'my_id'});
            }}
          >
            <View style={styles.amountCont}>
              <Image
                source={require("../../../assets/images/iconPNG/myid-icon.png")}
                resizeMode="contain"
                style={styles.iconImg}
                tintColor={"#DAA520"}
              />
            </View>
            <View style={styles.detailCont}>
              <View style={styles.detailInnerCont}>
                <Text style={styles.detailHeading}>My ID</Text>
              </View>
              <View style={styles.detailLowerInner}>
                <Text
                  style={[
                    styles.detailHeading,
                    { fontSize: 11, color: "#959CA7", fontWeight: "400" },
                  ]}
                >
                  Get All your Created Ids.
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.innerCont}
            onPress={() => {
              authCtx.token === null || authCtx.token === undefined
                ? setLoginModalVisible(true)
                : navigation.navigate("WalletIDs", {idType: 'create_id'});
            }}
          >
            <View style={styles.amountCont}>
              <Image
                source={require("../../../assets/images/iconPNG/createid-icon.png")}
                resizeMode="contain"
                style={styles.iconImg}
                tintColor={"#DAA520"}
              />
            </View>
            <View style={styles.detailCont}>
              <View style={styles.detailInnerCont}>
                <Text style={styles.detailHeading}>Create ID</Text>
              </View>
              <View style={styles.detailLowerInner}>
                <Text
                  style={[
                    styles.detailHeading,
                    { fontSize: 11, color: "#959CA7", fontWeight: "400" },
                  ]}
                >
                  Create a new ID
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity
        style={styles.innerCont}
        onPress={() => {
          authCtx.token === null || authCtx.token === undefined
            ? setLoginModalVisible(true)
            : navigation.navigate("BettingHistory");
        }}
      >
        <View style={styles.amountCont}>
          <Image
            source={require("../../../assets/images/iconPNG/betHistoryIcon.png")}
            resizeMode="contain"
            style={styles.iconImg}
            tintColor={"#DAA520"}
          />
        </View>
        <View style={styles.detailCont}>
          <View style={styles.detailInnerCont}>
            <Text style={styles.detailHeading}>Bet History</Text>
          </View>
          <View style={styles.detailLowerInner}>
            <Text
              style={[
                styles.detailHeading,
                { fontSize: 11, color: "#959CA7", fontWeight: "400" },
              ]}
            >
              All your recent bets
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.innerCont}
        onPress={() => {
          authCtx.token === null || authCtx.token === undefined
            ? setLoginModalVisible(true)
            : navigation.navigate("CurrentBets");
        }}
      >
        <View style={styles.amountCont}>
          <Image
            source={require("../../../assets/images/iconPNG/dice-3x.png")}
            resizeMode="contain"
            style={styles.iconImg}
            tintColor={"#DAA520"}
          />
        </View>
        <View style={styles.detailCont}>
          <View style={styles.detailInnerCont}>
            <Text style={styles.detailHeading}>Current Bets</Text>
          </View>
          <View style={styles.detailLowerInner}>
            <Text
              style={[
                styles.detailHeading,
                { fontSize: 11, color: "#959CA7", fontWeight: "400" },
              ]}
            >
              Get your current bets.
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.innerCont}
        onPress={() => {
          authCtx.token === null || authCtx.token === undefined
            ? setLoginModalVisible(true)
            : navigation.navigate("AccountStatement");
        }}
      >
        <View style={styles.amountCont}>
          <Image
            source={require("../../../assets/images/iconPNG/supportIcon.png")}
            resizeMode="contain"
            style={styles.iconImg}
            tintColor={"#DAA520"}
          />
        </View>
        <View style={styles.detailCont}>
          <View style={styles.detailInnerCont}>
            <Text style={styles.detailHeading}>Account Statement</Text>
          </View>
          <View style={styles.detailLowerInner}>
            <Text
              style={[
                styles.detailHeading,
                { fontSize: 11, color: "#959CA7", fontWeight: "400" },
              ]}
            >
              Get your account statement.
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* {Config.isCasino && (
        <TouchableOpacity
          style={styles.innerCont}
          onPress={() => {
            authCtx.token === null || authCtx.token === undefined
              ? setLoginModalVisible(true)
              : navigation.navigate("CasinoHistory");
          }}
        >
          <View style={styles.amountCont}>
            <Image
              source={require("../../../assets/images/iconPNG/controller-3x.png")}
              resizeMode="contain"
              style={styles.iconImg}
              tintColor={"#DAA520"}
            />
          </View>
          <View style={styles.detailCont}>
            <View style={styles.detailInnerCont}>
              <Text style={styles.detailHeading}>Casino History</Text>
            </View>
            <View style={styles.detailLowerInner}>
              <Text
                style={[
                  styles.detailHeading,
                  { fontSize: 11, color: "#959CA7", fontWeight: "400" },
                ]}
              >
                Get You Casino History.
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )} */}

      <TouchableOpacity
        style={styles.innerCont}
        onPress={() => {
          authCtx.token === null || authCtx.token === undefined
            ? setLoginModalVisible(true)
            : navigation.navigate("SettingCustom");
        }}
      >
        <View style={styles.amountCont}>
          <Image
            source={require("../../../assets/images/iconPNG/settingsIcon.png")}
            resizeMode="contain"
            style={styles.iconImg}
            tintColor={"#DAA520"}
          />
        </View>
        <View style={styles.detailCont}>
          <View style={styles.detailInnerCont}>
            <Text style={styles.detailHeading}>Edit Password</Text>
          </View>
          <View style={styles.detailLowerInner}>
            <Text
              style={[
                styles.detailHeading,
                { fontSize: 11, color: "#959CA7", fontWeight: "400" },
              ]}
            >
              Set your profile password.
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.innerCont}
        onPress={() => {
          authCtx.token === null || authCtx.token === undefined
            ? setLoginModalVisible(true)
            : navigation.navigate("Reffer");
        }}
      >
        <View style={styles.amountCont}>
          <Image
            source={require("../../../assets/images/iconPNG/reffer.png")}
            resizeMode="contain"
            style={styles.iconImg}
            tintColor={"#DAA520"}
          />
        </View>
        <View style={styles.detailCont}>
          <View style={styles.detailInnerCont}>
            <Text style={styles.detailHeading}>Refer Account</Text>
          </View>
          <View style={styles.detailLowerInner}>
            <Text
              style={[
                styles.detailHeading,
                { fontSize: 11, color: "#959CA7", fontWeight: "400" },
              ]}
            >
              Get your Refer Account.
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.innerCont}
        onPress={() => {
          authCtx.token === null || authCtx.token === undefined
            ? setLoginModalVisible(true)
            : navigation.navigate("ReferalReport");
        }}
      >
        <View style={styles.amountCont}>
          <Image
            source={require("../../../assets/images/iconPNG/share.png")}
            resizeMode="contain"
            style={styles.iconImg}
            tintColor={"#DAA520"}
          />
        </View>
        <View style={styles.detailCont}>
          <View style={styles.detailInnerCont}>
            <Text style={styles.detailHeading}>Referal Report</Text>
          </View>
          <View style={styles.detailLowerInner}>
            <Text
              style={[
                styles.detailHeading,
                { fontSize: 11, color: "#959CA7", fontWeight: "400" },
              ]}
            >
              Get your Referal Report.
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {Config.isFixedDeposit && (
        <TouchableOpacity
          style={styles.innerCont}
          onPress={() => {
            authCtx.token === null || authCtx.token === undefined
              ? setLoginModalVisible(true)
              : navigation.navigate("InvestMent");
          }}
        >
          <View style={styles.amountCont}>
            <Image
              source={require("../../../assets/images/iconPNG/investment.png")}
              resizeMode="contain"
              style={styles.iconImg}
              tintColor={"#DAA520"}
            />
          </View>
          <View style={styles.detailCont}>
            <View style={styles.detailInnerCont}>
              <Text style={styles.detailHeading}>InvestMent</Text>
            </View>
            <View style={styles.detailLowerInner}>
              <Text
                style={[
                  styles.detailHeading,
                  { fontSize: 11, color: "#959CA7", fontWeight: "400" },
                ]}
              >
                Get InvestMent Offers.
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
      {Config.isFixedDeposit && (
        <TouchableOpacity
          style={styles.innerCont}
          onPress={() => {
            authCtx.token === null || authCtx.token === undefined
              ? setLoginModalVisible(true)
              : navigation.navigate("FixDepositReport");
          }}
        >
          <View style={styles.amountCont}>
            <Image
              source={require("../../../assets/images/iconPNG/fixed.png")}
              resizeMode="contain"
              style={styles.iconImg}
              tintColor={"#DAA520"}
            />
          </View>
          <View style={styles.detailCont}>
            <View style={styles.detailInnerCont}>
              <Text style={styles.detailHeading}>Fixed Deposit Report</Text>
            </View>
            <View style={styles.detailLowerInner}>
              <Text
                style={[
                  styles.detailHeading,
                  { fontSize: 11, color: "#959CA7", fontWeight: "400" },
                ]}
              >
                Get your Fixed Deposit InvestMent Report Here.
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* <TouchableOpacity
        style={styles.innerCont}
        onPress={() => {
          authCtx.token === null || authCtx.token === undefined
            ? setLoginModalVisible(true)
            : navigation.navigate("WalletIDs");
        }}
      >
        <View style={styles.amountCont}>
          <Image
            source={require("../../../assets/images/iconPNG/id-icon.png")}
            resizeMode="contain"
            style={styles.iconImg}
            tintColor={"#DAA520"}
          />
        </View>
        <View style={styles.detailCont}>
          <View style={styles.detailInnerCont}>
            <Text style={styles.detailHeading}>Ids</Text>
          </View>
          <View style={styles.detailLowerInner}>
            <Text
              style={[
                styles.detailHeading,
                { fontSize: 11, color: "#959CA7", fontWeight: "400" },
              ]}
            >
              Create your Ids.
            </Text>
          </View>
        </View>
      </TouchableOpacity> */}

      <LoginModal
        modalVisible={loginModalVisible}
        setModalVisible={setLoginModalVisible}
        navigationType={""}
      />
    </View>
  );
};

export default WalletTransaction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 3,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  innerCont: {
    width: windowWidth / 2 - 14,
    backgroundColor: "#212A37",
    margin: 5,
    borderRadius: 5,
    height: 110,
  },
  detailCont: {
    alignItems: "center",
    justifyContent: "center",
  },
  detailInnerCont: {
    marginBottom: 5,
    alignItems: "center",
  },
  balanceBox: {
    height: "80%",
    width: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  detailHeading: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  detailLowerInner: {
    alignItems: "center",
    marginHorizontal: 15,
    marginBottom: 12,
  },
  amountCont: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 6,
  },
  iconImg: {
    width: 23,
    height: 23,
    tintColor: "#DAA520"
  },
});

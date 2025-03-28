import React, { useContext, useLayoutEffect, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Share,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useIsFocused } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import Clipboard from "@react-native-clipboard/clipboard";

import { Config } from "../../../../../config";
import { AuthContext } from "../../../../store/auth-context";
import { Socket } from "../../../../util/socket";
import ReferalReportInner from "../../../../component/UI/ReferalReportInner";

function ReferalReport({ navigation }) {
  const authCtx = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [data, setData] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [totalAmount, setTotalAmount] = useState("0");
  const [totalHold, setTotalHold] = useState("0");

  async function copy(text) {
    Clipboard.setString(text);
    Toast.show({
      type: "success",
      text1: "Coppied",
      text2: `Details has been coppied successfully. 😁`,
    });
  }

  useEffect(() => {
    if (authCtx.token === null || authCtx.token === undefined) {
      navigation.navigate("Home");
    }

    const getReferralSuccess = (...args) => {
      setData(args[0]);
      setPromoCode(args[0]?.promoCode);
      setTotalAmount(args[0]?.totalBalance_profit[0]?.total_profit);
      setTotalHold(args[0]?.totalBalance_profit_hold[0]?.total_hold);
    };
    Socket.on("get-referals-user-success", getReferralSuccess);

    return () => {
      Socket.off("get-referals-user-success", getReferralSuccess);
    };
  }, [Socket, authCtx]);

  useLayoutEffect(() => {
    if (isFocused === true) {
      async function token() {
        let tokendata = JSON.parse(authCtx.token);

        let userdata = {
          filter: { manager: tokendata.details.username, deleted: false },
          sort: { time: -1 },
          user: {
            _id: tokendata._id,
            key: tokendata.key,
            details: {
              username: tokendata.details.username,
              role: tokendata.details.role,
              status: tokendata.details.status,
            },
          },
        };

        Socket.emit("get-referal-userList", userdata);
      }

      token();
    }
  }, [isFocused]);

  const onShare = async (promoCode) => {
    const result = await Share.share({
      message: `Here's your special Offer. Ready to play
        1. Download the app from here: ${Config.AppLink}
        2. You will get special offer 7% bonus if you sign up with invite code
        3. Use my invite code ${promoCode}
        4. Website link: ${Config.WebLink}
      `,
    });
    console.log("Result: ", result);
  };

  const submitHandler = () => {};

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profile}>
          <View style={styles.leftamount}>
            <Text style={styles.InnerText}>{totalAmount}</Text>
            <Text style={styles.InnerText}>Total Amount</Text>
          </View>
          <View style={styles.rightamount}>
            <Text style={styles.InnerText}>{totalHold}</Text>
            <Text style={styles.InnerText}>Total Hold Amount</Text>
          </View>
        </View>

        <View style={styles.logoutView}>
          <View style={styles.inputButtonCont}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#f2b71a" }]}
              onPress={() => {
                submitHandler();
              }}
            >
              <Text style={[styles.buttonText]}>Settlement</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={[
            styles.profile,
            {
              borderWidth: 1,
              borderColor: "#fff",
              borderRadius: 4,
              borderStyle: "dotted",
              padding: 4,
            },
          ]}
        >
          <View style={styles.lefttextref}>
            <Text style={[styles.InnerText, { color: "#f2b71a" }]}>
              {promoCode}
            </Text>
            {promoCode !== "" && (
              <TouchableOpacity
                onPress={() => {
                  onShare(promoCode);
                }}
              >
                <Icon
                  name="share-alt"
                  size={18}
                  color="#fff"
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.textcopy}>
            <TouchableOpacity
              onPress={() => {
                copy(promoCode);
              }}
              style={{ padding: 4 }}
            >
              <Icon name="copy" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.passContainer}>
        <View style={styles.refferHeading}>
          <View style={styles.head1}>
            <Text style={styles.headText}>Username</Text>
          </View>
          <View style={styles.head1}>
            <Text style={styles.headText}>Hold Amount</Text>
          </View>
          <View style={styles.head1}>
            <Text style={styles.headText}>Action</Text>
          </View>
        </View>

        <FlatList
          data={data?.userList}
          KeyExtractor={(item) => item?._id}
          renderItem={({ item }) => {
            return <ReferalReportInner data={item} />;
          }}
        />
      </View>
    </ScrollView>
  );
}

export default ReferalReport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    // backgroundColor: "#000",
  },
  heading: {
    flexDirection: "row",
    margin: 10,
  },
  headback: {
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  headtext: {
    width: "80%",

    justifyContent: "center",
    alignItems: "center",
  },
  InnerText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  profile: {
    margin: 10,
    flexDirection: "row",
  },
  leftamount: {
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  rightamount: {
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutView: {
    margin: 10,
  },
  inputButtonCont: {
    marginHorizontal: 5,
  },
  pressed: {
    opacity: 0.75,
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  button: {
    borderRadius: 5,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginHorizontal: 10,
  },
  passContainer: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
  refferHeading: {
    flexDirection: "row",
    marginLeft: 2,
    marginRight: 2,
  },
  head: {
    width: "22%",
    alignItems: "center",
    justifyContent: "center",
    margin: 0.5,
    backgroundColor: "#000",
    borderColor: "#f2b71a",
    borderWidth: 1,
  },
  head1: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#DAA520",
    borderRadius: 3,
    justifyContent: "center",
    margin: 0.5,
  },
  headText: {
    fontSize: 12,
    color: "#fff",
    margin: 6,
  },
  codereferal: {
    flexDirection: "row",
    backgroundColor: "#000",
  },
  textrefrealcode: {
    width: "80%",
    padding: 6,
  },
  reftext: {
    color: "red",
    fontSize: 14,
  },
  lefttextref: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  textcopy: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
});

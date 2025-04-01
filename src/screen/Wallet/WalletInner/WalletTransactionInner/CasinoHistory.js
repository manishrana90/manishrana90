import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useIsFocused } from "@react-navigation/native";
import { WebView } from "react-native-webview";

import { AuthContext } from "../../../../store/auth-context";
import { Socket } from "../../../../util/socket";
import CasinoHistoryComponent from "../../../../component/UI/CasinoHistoryComponent";

const height = Dimensions.get("window").height;

function CasinoHistory({ navigation }) {
  const authCtx = useContext(AuthContext);
  const [data, setData] = useState("");
  const [type, setType] = useState("Balance");

  const isFocused = useIsFocused();

  useEffect(() => {
    const handleGetBalances = (...args) => {
      authCtx.setCasinoBalance(parseFloat(args[0].amount) * 10);
    };

    const handleGetHistory = (...args) => {
      setData(args[0].url);
    };

    Socket.on("get-balance-success", handleGetBalances);
    Socket.on(`get-history-success`, handleGetHistory);

    if (authCtx.token === null || authCtx.token === undefined) {
      navigation.navigate("Home");
    }

    return () => {
      Socket.off("get-balance-success", handleGetBalances);
      Socket.off(`get-history-success`, handleGetHistory);
    };
  }, [Socket, authCtx, navigation]);

  useLayoutEffect(() => {
    if (isFocused === true) {
      async function token() {
        let tokendata = JSON.parse(authCtx.token);

        let userdata = {
          user: {
            _id: tokendata._id,
            key: tokendata.key,
            token: tokendata.verifytoken,
            details: {
              username: tokendata.details.username,
              role: tokendata.details.role,
              status: tokendata.details.status,
            },
          },
        };

        Socket.emit("get-userbalance", userdata);
        Socket.emit("get-user", userdata);
        Socket.emit("get-history", userdata);
      }

      token();
    }
  }, [isFocused]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.button}>
        <TouchableOpacity
          style={[styles.buttons, type === "Balance" && styles.bottomBorder]}
          onPress={() => {
            setType("Balance");
          }}
        >
          <Icon name="money" color="#fff" size={20} />
          <Text style={styles.buttonText}>Balance</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttons, type === "History" && styles.bottomBorder]}
          onPress={() => {
            setType("History");
          }}
        >
          <Icon name="list-alt" color="#fff" size={20} />
          <Text style={styles.buttonText}>History</Text>
        </TouchableOpacity>
      </View>

      <View>
        {type === "Balance" ? (
          <CasinoHistoryComponent />
        ) : (
          <WebView
            nestedScrollEnabled
            automaticallyAdjustContentInsets={true}
            javaScriptEnabled={true}
            source={{ uri: data }}
            scrollEnabled={false}
            startInLoadingState={true}
            style={{
              height: height - 250,
            }}
          />
        )}
      </View>
    </ScrollView>
  );
}

export default CasinoHistory;

const styles = StyleSheet.create({
  dropdown: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.9)",
    top: 0,
    height: "100%",
    width: "100%",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#000",
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
    fontSize: 18,
    fontWeight: "bold",
  },
  balance: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    borderColor: "#f2b71a",
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 6,
  },
  balanceText: {
    color: "#fff",
    fontWeight: "bold",
    margin: 10,
  },
  button: {
    flexDirection: "row",
  },
  buttons: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    flexDirection: "row",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    margin: 10,
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderColor: "#f2b71a",
  },
});

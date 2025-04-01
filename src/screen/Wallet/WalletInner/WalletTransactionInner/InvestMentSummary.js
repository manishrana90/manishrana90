import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import moment from "moment";
import "moment-timezone";

import { AuthContext } from "../../../../store/auth-context";
import { Socket } from "../../../../util/socket";

function InvestMentSummary({ route }) {
  const { id } = route.params;
  const authCtx = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const navigation = useNavigation();
  const today = new Date();

  useEffect(() => {
    if (authCtx.token === null || authCtx.token === undefined) {
      navigation.navigate("Home");
    }

    const getInvestMentReportSuccess = (...args) => {
      if (args[0].success === true) {
        setLoading(false);
        args[0].data.length > 0 ? setList(args[0].data) : setList([]);
      }
    };
    Socket.on("get-fixed-deposit-success", getInvestMentReportSuccess);

    return () => {
      Socket.off("get-fixed-deposit-success", getInvestMentReportSuccess);
    };
  }, [Socket, authCtx]);

  useLayoutEffect(() => {
    if (isFocused === true) {
      async function token() {
        let tokendata = JSON.parse(authCtx.token);

        let userdata = {
          _id: id,
          fixed_depsoit_id: id,
          user: {
            _id: tokendata._id,
            key: tokendata.key,
            token: tokendata.verifytoken,
            details: {
              manager: tokendata.details.manager,
              username: tokendata.details.username,
              role: tokendata.details.role,
              status: tokendata.details.status,
            },
          },
        };

        setLoading(true);
        Socket.emit("get-fixed-depsoit", userdata);
      }

      token();
    }
  }, [isFocused]);

  return (
    <ScrollView>
      {loading ? (
        <View style={styles.dropdown}>
          <ActivityIndicator size={30} color="#fbb845" />
        </View>
      ) : (
        <View>
          {list.map((list, index) => {
            return (
              <View key={index}>
                <View style={styles.container}>
                  <View style={{ width: "30%", padding: 10 }}>
                    <Text style={styles.Textd}>Amount:</Text>
                    <Text style={styles.Textd}>Join Date:</Text>
                  </View>
                  <View style={{ width: "70%", padding: 10 }}>
                    <Text style={styles.Textsm}>{list.amount}</Text>
                    <Text style={styles.Textsm}>
                      {moment(list.createdAt).format("MMM DD YYYY hh:mm:ss A")}
                    </Text>
                    <Text style={styles.Textsm}>
                      {moment(list.createdAt).from(moment(today))}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}

          {list.length <= 0 && (
            <View style={styles.nofound}>
              <Text style={{ color: "#f2b71a" }}>No data Found !</Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}
export default InvestMentSummary;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    overflow: "hidden",
    backgroundColor: "#212A37",
    borderRadius: 8,
    marginHorizontal: 10,
    marginTop: 8,
  },
  Textd: {
    fontSize: 14,
    padding: 2,
    fontWeight: "400",
    color: "#fff",
  },
  Textsm: {
    fontSize: 14,
    padding: 2,
    fontWeight: "300",
    color: "#fff",
  },
  nofound: {
    alignItems: "center",
    alignSelf: "center",
    marginTop: "50%",
    justifyContent: "center",
  },
  dropdown: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: "50%",
    height: "100%",
    width: "100%",
    overflow: "hidden",
  },
});

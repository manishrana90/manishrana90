import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import { useIsFocused, useNavigation } from "@react-navigation/native";

import { AuthContext } from "../../../../store/auth-context";
import { Socket } from "../../../../util/socket";
import InvestMentInner from "../../../../component/UI/InvestMentInner";

function InvestMent() {
  const authCtx = useContext(AuthContext);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [data, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(2000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    if (authCtx.token === null || authCtx.token === undefined) {
      navigation.navigate("Home");
    }

    const getInvestMentSuccess = (...args) => {
      setDataList(args[0].data);
    };
    Socket.on("get-fixed-deposit-list-success", getInvestMentSuccess);

    return () => {
      Socket.off("get-fixed-deposit-list-success", getInvestMentSuccess);
    };
  }, [Socket, authCtx]);

  useLayoutEffect(() => {
    if (isFocused === true) {
      async function token() {
        let tokendata = JSON.parse(authCtx.token);

        let newdata = {
          user: {
            _id: tokendata._id,
            key: tokendata.key,
            details: {
              manager: tokendata.details.manager,
              username: tokendata.details.username,
              role: tokendata.details.role,
              status: tokendata.details.status,
            },
          },
        };

        Socket.emit("get-fixed-deposit-list", newdata);
      }

      token();
    }
  }, [isFocused]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {loading ? (
        <View style={styles.dropdown}>
          <ActivityIndicator size={30} color="#fbb845" />
        </View>
      ) : (
        <View style={styles.container}>
          {data.map((a) => {
            return (
              <View key={a._id}>
                <InvestMentInner data={a} />
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}
export default InvestMent;
const styles = StyleSheet.create({
  nofound: {
    alignItems: "center",
    padding: 32,
    color: "#f2b71a",
  },
  dropdown: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    top: 0,
    height: "100%",
    width: "100%",
    overflow: "hidden",
  }, 
  container: {
    marginTop: 10,
    marginHorizontal: 5,
  },
});

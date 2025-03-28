import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import Toast from "react-native-toast-message";
import HomeFooter from "../Home/HomeInner/HomeFooter";
import SportsPlay from "./SportsInner/SportsPlay";
import { useNavigation } from "@react-navigation/native";
import { GetUserDetail } from "../../util/http";
import { AuthContext } from "../../store/auth-context";
import { Socket } from "../../util/socket";
import { Config } from "../../../config";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const Sports = () => {
  const authCtx = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    restart();
    wait(2000).then(() => setRefreshing(false));
  }, [authCtx]);

  const restart = async () => {
    if (authCtx.token != null && authCtx.token != undefined) {
      let data = {
        filter: {
          managers: Config.ManagerName,
          eventTypeId: { $nin: ["t9", "4321"] },
          visible: true,
          deleted: false,
          marketType: { $in: ["MATCH_ODDS", "TOURNAMENT_WINNER"] },
          "marketBook.status": { $ne: "CLOSED" },
          // "marketBook.inplay": true,
        },
        sort: { openDate: 1 },
      };
      Socket.emit("get-free-home-markets", data);

      const userData = JSON.parse(authCtx.token);

      let refreshData = {
        user: {
          _id: userData._id,
          key: userData.key,
          token: userData.verifytoken,
          details: {
            username: userData.details.username,
            role: userData.details.role,
            status: userData.details.status,
          },
        },
      };

      Socket.emit("get-user", refreshData);
      Socket.emit("refresh-balance", refreshData);

      const userDetail = await GetUserDetail({ token: userData.verifytoken });

      if (userDetail?.logout === true) {
        authCtx.logout();
        navigation.navigate("Home");
        Toast.show({
          type: "error",
          text1: "Someone Login",
          text2: `Your id has been login somewhere else.`,
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyboardShouldPersistTaps="always"
      >
        <SportsPlay />
        <HomeFooter />
      </ScrollView>
    </View>
  );
};

export default Sports;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import HomeFooter from "../Home/HomeInner/HomeFooter";
import Toast from "react-native-toast-message";
import { GetUserDetail } from "../../util/http";
import { AuthContext } from "../../store/auth-context";
import WalletNewHeader from "./WalletNewInner/WalletNewHeader";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const WalletNew = ({ navigation }) => {
  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    restart();
    wait(2000).then(() => setRefreshing(false));
  }, [authCtx]);

  const restart = async () => {
    if (authCtx.token != null && authCtx.token != undefined) {
      const userData = JSON.parse(authCtx.token);
      const userDetail = await GetUserDetail(
        { userId: "" },
        userData.verifytoken
      );
      if (userDetail.success == true) {
        authCtx.setBalance(JSON.parse(userDetail.doc.balance));
        authCtx.setDepositStatus(userDetail?.depositstatus);
        if (userDetail.doc.bounsBalance) {
          authCtx.setBonus(JSON.parse(userDetail.doc.bounsBalance));
        }
      }

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
        <WalletNewHeader
          setLoading={() => setLoading(false)}
          navigation={navigation}
        />
        <HomeFooter />
      </ScrollView>
      {loading && (
        <View
          style={{
            flex: 1,
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size={"large"} color={"#2cc597"} />
        </View>
      )}
    </View>
  );
};

export default WalletNew;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

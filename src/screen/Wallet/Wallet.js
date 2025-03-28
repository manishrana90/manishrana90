import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import HomeFooter from "../Home/HomeInner/HomeFooter";
import WalletHeader from "./WalletInner/WalletHeader";
import WalletTransaction from "./WalletInner/WalletTransaction";
import Toast from "react-native-toast-message";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import { GetUserDetail, WithdrawalMethod } from "../../util/http";
import { AuthContext } from "../../store/auth-context";
import { Socket } from "../../util/socket";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const Wallet = ({ navigation }) => {
  const isFocused = useIsFocused();
  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [withdrawalMethod, setWithdrawalMethod] = useState([]);

  useLayoutEffect(() => {
    const GetWallet = async () => {
      if(authCtx.token != null && authCtx.token != undefined) {
        const userData = JSON.parse(authCtx.token);

        const data = {
          user_id: userData?.details?._id,
        };

        const getwithdrawalMethod = await WithdrawalMethod(data);
        setLoading(false);
        if (getwithdrawalMethod.success == true) {
          setWithdrawalMethod(getwithdrawalMethod.data);
        }
      }
    };
    if (isFocused) {
      GetWallet();
    }
  }, [isFocused]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    restart();
    wait(2000).then(() => setRefreshing(false));
  }, [authCtx]);

  const restart = async () => {
    if (authCtx.token != null && authCtx.token != undefined) {
      const userData = JSON.parse(authCtx.token);

      const data = {
        user_id: userData?.details?._id,
      };

      const getwithdrawalMethod = await WithdrawalMethod(data);
      if (getwithdrawalMethod.success == true) {
        setWithdrawalMethod(getwithdrawalMethod.data);
      }


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
        <WalletHeader
          setLoading={() => setLoading(false)}
          navigation={navigation}
          withdrawalMethod={withdrawalMethod}
        />
        <WalletTransaction
          navigation={navigation}
          withdrawalMethod={withdrawalMethod}
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
          <ActivityIndicator size={"large"} color={"#DAA520"} />
        </View>
      )}
    </View>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

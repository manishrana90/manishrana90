import React, { useContext, useLayoutEffect, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  PermissionsAndroid,
  SafeAreaView,
  Dimensions,
  Platform,
} from "react-native";
import CodePush from "react-native-code-push";
import { getVersion } from "react-native-device-info";

import HomeData from "./HomeInner/HomeData";
import HomeFooter from "./HomeInner/HomeFooter";
import HomeHeader from "./HomeInner/HomeHeader";
import InPlay from "./HomeInner/InPlay";
import Toast from "react-native-toast-message";
import MarqueeView from "react-native-marquee-view";

import OneSignal from "react-native-onesignal";
import { useIsFocused } from "@react-navigation/native";
import { GetUserDetail, UpdateDeviceId } from "../../util/http";
import { AuthContext } from "../../store/auth-context";
import WebView from "react-native-webview";
import { useDispatch } from "react-redux";
import HomeAviator from "./HomeInner/HomeAviator";
import HomeCasino from "./HomeInner/HomeCasino";
import { Socket } from "../../util/socket";
import VersionModal from "../../component/UI/VersionModal";
import { Config } from "../../../config";
const {width: windowWidth} = Dimensions.get('window');

const CODE_PUSH_OPTIONS = {
  updateDialog: true,
  installMode: CodePush.InstallMode.IMMEDIATE,
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  rollbackRetryOptions: {
    delayInHours: 1,
    maxRetryAttempts: 3,
  },
};

OneSignal.setAppId("9adf2973-6d8a-4a42-9ce0-a3a98d97deaa");
OneSignal.setLogLevel(6, 0);

OneSignal.promptForPushNotificationsWithUserResponse();

//Method for handling notifications received while app in foreground
OneSignal.setNotificationWillShowInForegroundHandler(
  (notificationReceivedEvent) => {
    console.log(
      "OneSignal: notification will show in foreground:",
      notificationReceivedEvent
    );
    let notification = notificationReceivedEvent.getNotification();
    console.log("notification: ", notification);
    const data = notification.additionalData;
    console.log("additionalData: ", data);
    // Complete with null means don't show a notification.
    notificationReceivedEvent.complete(notification);
  }
);

//Method for handling notifications opened
OneSignal.setNotificationOpenedHandler((notification) => {
  console.log("OneSignal: notification opened:", notification);
});

OneSignal.setInAppMessageClickHandler((event) => {
  console.log("OneSignal IAM clicked:", event);
  console.log("Click Name:", event.click_name);
  if (event.click_name == "Dev-Run") {
    InAppMessageNavigation();
  }
  event.close_message = false;
});

const InAppMessageNavigation = async () => {
  const supportedURL = "zolowin://live";
  const supported = await Linking.canOpenURL(supportedURL);
  // console.log("Supported: ", supported);

  if (supported) {
    await Linking.openURL(supportedURL);
  }
};

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const Home = (props) => {
  const isFocused = useIsFocused();
  const authCtx = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const [moblieId, setMobileId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const GetApkVersion = async () => {
      const myApkVersion = await getVersion();
      authCtx.setAppVersion(myApkVersion);
    };
    GetApkVersion();
  }, [authCtx, props, getVersion]);

  useEffect(() => {
    const homeMessage = (...args) => {
      if (args.length > 0 && args[0] != null) {
        setMessage(args[0].message);
      }
    };

    Socket.on("get-message-success", homeMessage);

    return () => {
      Socket.off("get-message-success", homeMessage);
    };
  }, [Socket]);

  useLayoutEffect(() => {
    
    if (isFocused && moblieId === null) {
      if (authCtx.token != null && authCtx.token != undefined) {
        async function SendDeviceId() {
          const userData = JSON.parse(authCtx.token);
          const deviceState = await OneSignal.getDeviceState();
          const data = {
            // username: userData.details.username,
            user_id: userData?.details?._id,
            deviceId: deviceState.userId,
          };

          const userDetail = await UpdateDeviceId(data);
          // setTimeout(() => {
          //   console.log('data: ', data);
          //   console.log('userDetail: ', userDetail);
          // },5000)

          if (userDetail.success == true) {
            setMobileId(deviceState.userId);
          }
        }

        SendDeviceId();
      }
    }

    async function getMessage() {
      let tokendata = JSON.parse(authCtx.token);

      let userdata = {
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
      Socket.emit("get-message", userdata);
    }
    if (authCtx.token != null && authCtx.token != undefined) {
      getMessage();
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

      if (userDetail?.logout == true) {
        authCtx.logout();
        Toast.show({
          type: "error",
          text1: "Someone Login",
          text2: `Your id has been login somewhere else.`,
        });
      }
    }
  };

  const syncWithCodePush = (status) => {
    console.log("Codepush sync status", status);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyboardShouldPersistTaps="always"
      >
        {message && (
          <MarqueeView
            style={{
              marginTop: 10,
            }}
          >
            <View style={{ width: windowWidth}}>
              <Text
                style={{ color: "#FFBF00", fontSize: 14, fontWeight: "600" }}
              >
                {message}
              </Text>
            </View>
          </MarqueeView>
        )}

        {(Config.isCasino && (!authCtx.token || !!authCtx?.availableEventTypes['c9']))&&
          <>
            <HomeHeader />
            <HomeCasino/>
            <HomeAviator />

          </>
        }
        
        <InPlay />
        <HomeData />


        {/* <HomeHeader />
        {Config.isCasino && <HomeAviator />}
        <InPlay />
        {Config.isCasino && <HomeData />} */}
        
        <HomeFooter />
      </ScrollView>
      <VersionModal modalVisible={authCtx.version < Config.version  && Platform.OS === "android"} />
    </View>
  );
};

export default CodePush(CODE_PUSH_OPTIONS)(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

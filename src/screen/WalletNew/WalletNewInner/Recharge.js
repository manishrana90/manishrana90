import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, RefreshControl, PermissionsAndroid, Alert, Linking, Platform } from "react-native";

import Contacts from 'react-native-contacts';

import HomeFooter from "../../Home/HomeInner/HomeFooter";
import Toast from "react-native-toast-message";
import { GetUserDetail } from "../../../util/http";
import { AuthContext } from "../../../store/auth-context";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const Recharge = ({ navigation }) => {
  const authCtx = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    requestContactsPermission();
  }, []);

  const requestContactsPermission = async () => {
    try {

      if (Platform.OS === 'android') {
        // Access the Android SDK version
        const androidSDKVersion = Platform.Version;
        
        console.log('Android SDK Version:', androidSDKVersion);
      }

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: "Contacts",
          message: "This app would like to view your contacts.",
          buttonPositive: "Please accept",
        }
      );
      console.log("UseEffect Granted>>>>>>>>", granted);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Permission granted, you can access contacts here
        restart();
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        // The user has denied permission with "Never ask again" selected
        // You should guide the user to the app settings to enable the permission manually
        // showPermissionSettingsAlert();
      } else {
        // Permission denied
        console.log("Permission denied");
      }
    } catch (error) {
      console.error("Permission error: ", error);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    restart();
    wait(2000).then(() => setRefreshing(false));
  }, [authCtx]);

  const restart = async () => {

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
        buttonPositive: 'Please accept',
      }
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      // Permission granted, you can now access contacts.
      Contacts.getAll().then(contacts => {
        console.log("Contacts>>>>>>", contacts)
       });
    } else {
      console.log('Permission denied or never_ask_again');
      // You can show a message to the user or redirect them to settings.
    }
  console.log("granted>>>>>", granted);


    // Contacts.getAll().then(contacts => {
    //   console.log("Contacts>>>>>>>", contacts)
    // })

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
        <HomeFooter />
      </ScrollView>
    </View>
  );
};

export default Recharge;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

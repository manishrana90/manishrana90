import React, { useContext, useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import moment from "moment";
import "moment-timezone";
import VersionModal from "./VersionModal";

import { AuthContext } from "../../store/auth-context";
import { useNavigation } from "@react-navigation/native";
import { Socket } from "../../util/socket";

let cricketImage = require("../../assets/images/sports/cricket_img.png");

export default RenderCricket = (props) => {
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();
  const [updateApkModal, setUpdateApkModal] = useState(false);

  let startdate = new Date(props.item?.openDate);
  let durationInMinutes = 15;
  startdate.setMinutes(startdate.getMinutes() - durationInMinutes);
  const rateArray =
    props?.item?.marketBook?.runners === undefined
      ? props?.item?.runners
      : props?.item?.marketBook?.runners;

  const updateCheck = () => {
    // console.log("Platform", Platform.OS);
    if (authCtx.version < 1.3 && Platform.OS != "ios") {
      setUpdateApkModal(true);
      return;
    } else {
      authCtx.token === null || authCtx.token === undefined
        ? props.setModalVisible(props.item.eventId)
        : submitOnPress();
    }
  };

  const submitOnPress = () => {
    Socket.off(`event-pulse-${authCtx.eventId}`);
    navigation.navigate("LiveBet", { eventId: props.item.eventId, eventTypeId: props.item.eventTypeId });
    authCtx.setEventId(props.item.eventId);
  };

  return (
    <TouchableOpacity
      style={styles.gameInnerView}
      onPress={() => {
        updateCheck();
      }}
    >
      <View style={styles.iconCont}>
        <View style={[styles.iconView, (props.item?.marketBook?.inplay != false || startdate < new Date()) && {backgroundColor : "#2cc597"}]}>
          {props.item?.marketBook?.inplay != false || startdate < new Date() ? (
            <Text style={styles.inPlayText}>INPLAY</Text>
          ) : (
            <Text style={styles.dateText}>
              <Image
                style={styles.calendarImg}
                resizeMode="contain"
                source={require("../../assets/images/iconPNG/calendar-3x.png")}
              />
              {"  "}
              {moment(props.item?.openDate).format("MMM D hh:mm a")}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.gameTextCont}>
        <View style={styles.gameHeadingCont}>
          <Text style={styles.gameHeading}>{props.item?.competitionName}</Text>
        </View>
        <Text style={styles.gameText}>{props.item?.eventName}</Text>

        <View style={styles.rateCont}>
          <View style={styles.rateInnerCont}>
            <View
              style={[
                styles.rateView,
                { borderTopLeftRadius: 5, borderBottomLeftRadius: 5 },
              ]}
            >
              <Text style={styles.rateText}>
                {rateArray[0]?.availableToBack?.price === undefined
                  ? 0
                  : rateArray[0]?.availableToBack?.price}
              </Text>
            </View>
            <View
              style={[
                styles.rateView,
                {
                  backgroundColor: "#eeadba",
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5,
                },
              ]}
            >
              <Text style={styles.rateText}>{rateArray[0]?.availableToBack?.price === undefined
                  ? 0
                  : rateArray[0]?.availableToBack?.price}</Text>
            </View>
          </View>
          <View style={styles.rateInnerCont}>
            <View
              style={[
                styles.rateView,
                { borderTopLeftRadius: 5, borderBottomLeftRadius: 5 },
              ]}
            >
              <Text style={styles.rateText}>-</Text>
            </View>
            <View
              style={[
                styles.rateView,
                {
                  backgroundColor: "#eeadba",
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5,
                },
              ]}
            >
              <Text style={styles.rateText}>-</Text>
            </View>
          </View>
          <View style={styles.rateInnerCont}>
            <View
              style={[
                styles.rateView,
                { borderTopLeftRadius: 5, borderBottomLeftRadius: 5 },
              ]}
            >
              <Text style={styles.rateText}>{rateArray[1]?.availableToBack?.price === undefined
                  ? 0
                  : rateArray[1]?.availableToBack?.price}</Text>
            </View>
            <View
              style={[
                styles.rateView,
                {
                  backgroundColor: "#eeadba",
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5,
                },
              ]}
            >
              <Text style={styles.rateText}>{rateArray[1]?.availableToBack?.price === undefined
                  ? 0
                  : rateArray[1]?.availableToBack?.price}</Text>
            </View>
          </View>
        </View>
      </View>

      <VersionModal
        modalVisible={updateApkModal}
        setModalVisible={setUpdateApkModal}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gameInnerView: {
    backgroundColor: "#364253",
    borderRadius: 5,
    marginHorizontal: 8,
    marginBottom: 5,
    paddingHorizontal: 8,
    flexDirection: "row",
  },
  gameTextCont: {
    flex: 1,
    margin: 10,
  },
  gameHeadingCont: {
    padding: 2,
    paddingHorizontal: 5,
    borderRadius: 5,
    backgroundColor: "#959CA7",
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  gameHeading: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "500",
  },
  gameText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
    // textAlign: "center",
  },
  inPlayText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
  },
  dateText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
    // marginTop: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    textAlign: "center",
  },
  calendarImg: {
    width: 10,
    height: 10,
    tintColor: "#fff",
  },
  iconCont: {
    marginTop: 10,
  },
  iconView: {
    width: 80,
    height: 40,
    backgroundColor: "#959CA7",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  iconViewImg: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  rateCont: {
    flexDirection: "row",
    marginTop: 5,
  },
  rateInnerCont: {
    flex: 1,
    borderRadius: 10,
    flexDirection: "row",
    marginHorizontal: 2,
  },
  rateView: {
    flex: 1,
    backgroundColor: "#83b9ea",
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  rateText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "500",
  },
});

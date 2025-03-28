import React, { useContext, useState } from "react";
import {Image, Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import moment from "moment";
import "moment-timezone";
import VersionModal from "./VersionModal";

import { AuthContext } from "../../store/auth-context";
import { useNavigation } from "@react-navigation/native";
import SportsCard from "./SportsCard";
import { Socket } from "../../util/socket";


export default RenderSports = (props) => {
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();
  const [updateApkModal, setUpdateApkModal] = useState(false);

  let startdate = new Date(props.item?.openDate);
  let durationInMinutes = 15;
  startdate.setMinutes(startdate.getMinutes() - durationInMinutes);

  const updateCheck = () => {
    if (authCtx.version < 1.0 && Platform.OS != "ios") {
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

  // if(props.item?.marketBook?.inplay == false) {
  //   return null;
  // }

  return (
    <>
      <TouchableOpacity
        style={styles.gameInnerView}
        onPress={() => {
          updateCheck();
        }}
      >
        <View style={styles.gameTextCont}>
          <Text style={styles.gameText}>{props.item?.eventName}</Text>
          {props.item?.marketBook?.inplay != false || startdate < new Date() ? (
            <Text style={styles.inPlayText}>INPLAY</Text>
          ) : (
            <Text style={styles.dateText}>
              <Image
                style={styles.calendarImg}
                resizeMode="contain"
                source={require("../../assets/images/iconPNG/calendar-3x.png")}
                tintColor="#fff"
              />
              {"  "}
              {moment(props.item?.openDate).format("MMM D hh:mm a")}
            </Text>
          )}
        </View>
        <View style={{borderColor: '#fff', borderWidth: 0.2, borderRadius: 5, marginBottom: 5,}}>
          {props?.item?.marketBook?.runners === undefined ? 
            <>
              {props?.item?.runners.map((data) => {
                return <SportsCard data={data} />;
              })}
            </> 
            :
            <>
              {props?.item?.marketBook?.runners.map((data, index) => {
                return <SportsCard data={data} runnerName={props?.item?.runners[index].runnerName} />;
              })}
            </>
          }
        </View>

        <VersionModal
          modalVisible={updateApkModal}
          setModalVisible={setUpdateApkModal}
        />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  gameInnerView: {
    backgroundColor: "#1e252e",
    borderRadius: 5,
    marginHorizontal: 8,
    marginBottom: 5,
    paddingHorizontal: 8,
    borderWidth: 0.4,
    borderColor: "#fff",
  },
  gameTextCont: {
    flex: 1,
    justifyContent: "center",
    margin: 10,
  },
  gameText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  inPlayText: {
    color: "#DAA520",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
  },
  dateText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  calendarImg: {
    width: 10,
    height: 10,
    tintColor: "#fff",
  },
  iconView: {
    width: 40,
    height: 40,
    backgroundColor: "#212A37",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  iconViewImg: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
});

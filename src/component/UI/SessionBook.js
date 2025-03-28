import React, { memo, useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import SessionModal from "./SessionModal";

const SessionBook = ({ betmodalVisible, setBetModalVisible, runners }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={betmodalVisible}
      onRequestClose={() => {
        setBetModalVisible(!betmodalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={{ maxHeight: 500 }}>
          <ScrollView
            style={[styles.modalView, { flexGrow: 0 }]}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          >
            <View style={styles.betHeader}>
              <Text style={styles.betHeadText}>
                {runners?.market?.marketName}
              </Text>

              <TouchableOpacity
                style={styles.iconCont}
                onPress={() => {
                  setBetModalVisible(!betmodalVisible);
                }}
              >
                <Image
                  source={require("../../assets/images/iconPNG/closeIcon.png")}
                  style={[styles.Icon, { textAlign: "right", tintColor: "#DAA520" }]}
                  resizeMode="contain"
                  tintColor={"#DAA520"}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.betshowCont}>
              <View style={styles.betinnerHeading}>
                <View style={styles.betinnerBox}>
                  <Text style={styles.boxinnertext}>Run</Text>
                </View>
                <View style={styles.betinnerBox}>
                  <Text style={styles.boxinnertext}>Profit</Text>
                </View>
              </View>

              {runners?.runnerProfit ? (
                Object.entries(runners?.runnerProfit)?.map(([key, value]) => (
                  <View key={key}>
                    <SessionModal name={key} value={value} />
                  </View>
                ))
              ) : (
                <ActivityIndicator size={30} color={"#DAA520"} />
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default memo(SessionBook);

const styles = StyleSheet.create({
  betHeader: {
    backgroundColor: "#000",
    justifyContent: "center",
    flexDirection: "row",
    padding: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  betHeadText: {
    textAlign: "center",
    width: "90%",
    margin: 5,
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  betHeading: {
    borderTopWidth: 0.5,
    borderTopColor: "#f2b71a",
    borderColor: "#f2b71a",
    backgroundColor: "#282828",
  },
  betHeading1: {
    flexDirection: "row",
    // backgroundColor: 'red'
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "#000",
    borderRadius: 5,
    padding: 5,
    borderWidth: 2,
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
    // paddingBottom: 20,
  },

  betinnerHeading: {
    flexDirection: "row",
    width: "100%",
  },
  betinnerBox: {
    borderColor: "#fff",
    borderWidth: 1,
    backgroundColor: "#000",
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  boxinnertext: {
    marginVertical: 5,
    marginHorizontal: 3,
    fontWeight: "bold",
    color: "#fff",
  },
  betTitleText: {
    fontSize: 16,
    padding: 4,
    fontWeight: "bold",
  },
  betshowCont: {
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 5,
    alignItems: "center",
  },
  iconCont: {
    width: 20,
    height: 20,
  },
  Icon: {
    width: "100%",
    height: "100%",
  },
});

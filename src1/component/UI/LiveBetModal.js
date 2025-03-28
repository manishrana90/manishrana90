import React, { memo, useLayoutEffect, useState } from "react";
import {
  View,
  Modal,
  StyleSheet,
  Dimensions,
  Text,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import WalletIcon from "react-native-vector-icons/FontAwesome5";

import moment from "moment";
import "moment-timezone";

const height = Dimensions.get("window").height;
const windowHeight = Dimensions.get("window").height / 3 + 240;
const videoHeight = Dimensions.get("window").height / 3;

const InvestBetCard = ({ item }) => {
  return (
    <Pressable style={styles.mainInvestBetCardStyles} onPress={() => {}}>
      <View style={styles.cardBetMessageView}>
        <Text style={styles.cardBetMessageText}>{item.marketName}</Text>
      </View>
      <View style={[styles.cardBetMessageView, { marginVertical: 0 }]}>
        <Text style={styles.cardBetMessageText}>
          SelectionName: {item.selectionName}
        </Text>
      </View>

      <View style={styles.cardBetDecisionOddView}>
        <View style={styles.cardBetDecisionView}>
          <Text style={[styles.cardBetDecisionText, { marginBottom: 10 }]}>
            Decision:{" "}
            <Text
              style={[
                styles.cardBetDecisionText,
                item.type === "Back" ? { color: "#2ba7f3" } : { color: "red" },
              ]}
            >
              {item.marketType === "SESSION"
                ? item.type === "Back"
                  ? "Yes"
                  : "No"
                : item.type}
            </Text>
          </Text>
          {item.marketType === "SESSION" ? (
            <Text style={[styles.cardBetAmount]}>
              ₹{" "}
              {item.type === "Back"
                ? item.stake
                : Math.round(item.stake * item.rate)}
            </Text>
          ) : (
            <Text style={[styles.cardBetAmount]}>
              ₹{" "}
              {item.type === "Back"
                ? item.stake
                : ((item.rate - 1) * item.stake).toFixed(2)}
            </Text>
          )}
          {/* <Text style={[styles.cardBetAmount]}>₹ { item.stake }</Text> */}
          <Text style={styles.cardBetDecisionText}>Stake Amount</Text>
        </View>
        <View
          style={[styles.investSideCardDivider, { backgroundColor: "#4e5052" }]}
        />
        <View style={styles.cardBetDecisionView}>
          <Text style={[styles.cardBetDecisionText, { marginBottom: 10 }]}>
            Date: {moment(item?.placedTime).format("MMM D hh:mm a")}
          </Text>
          {/* <View style={{ flexDirection: "row" }}> */}
          {/* <Text style={[styles.cardBetAmount]}>
              Selection Name
            </Text>
            <Text style={[styles.cardBetAmount, { color: "#2cc597" }]}>
            {item.selectionName}
            </Text> */}
          {/* </View> */}
          {/* <View style={{ flexDirection: "row" }}> */}
          <Text style={styles.cardBetDecisionText}>P&L</Text>
          <Text style={[styles.cardBetAmount, { color: "#2cc597" }]}>
            {item.rate}
          </Text>
          {/* </View> */}
        </View>
      </View>
    </Pressable>
  );
};

const LiveBetModal = ({
  modalVisible,
  setModalVisible,
  allBetData,
  eventId,
}) => {
  const [oldEvent, setOldEvent] = useState("");
  const [allBetLength, setBetLength] = useState(0);
  const [total, setTotal] = useState({ trade: 0, return: 0 });

  if (oldEvent != eventId || allBetLength != allBetData.length) {
    setBetLength(allBetData.length);
    setOldEvent(eventId);
    let totalAmount = 0;
    let totalProfit = 0;
    for (let i = 0; i < allBetData.length; i++) {
      totalAmount =
        allBetData[i]?.type === "Lay"
          ? allBetData[i]?.marketType === "SESSION"
            ? Math.round(totalAmount + allBetData[i].rate * allBetData[i].stake)
            : Math.round(
                totalAmount + (allBetData[i].rate - 1) * allBetData[i].stake
              )
          : Math.round(totalAmount + allBetData[i].stake);

      totalProfit =
        allBetData[i]?.marketType === "SESSION"
          ? totalProfit + Math.round(allBetData[i].rate * allBetData[i].stake)
          : allBetData[i].type === "Back"
          ? totalProfit + Math.round(allBetData[i].rate * allBetData[i].stake)
          : totalProfit + (allBetData[i].rate - 1) * allBetData[i].stake;

      // if(allBetData[i]?.marketType === "SESSION"){
      //   allBetData[i].type === "Back"
      //   ? (totalProfit = totalProfit + (Math.round(allBetData[i].rate * allBetData[i].stake) + allBetData[i].stake))
      //   : (totalProfit =
      //     totalProfit +
      //     (Math.round(allBetData[i].rate * allBetData[i].stake) -
      //     (Math.round(allBetData[i].rate * allBetData[i].stake) -
      //     allBetData[i].stake) * 2 + allBetData[i].stake));
      // }else{
      //   if(allBetData[i].type === "Back"){
      //     totalProfit = totalProfit + (Math.round(allBetData[i].rate * allBetData[i].stake))
      //   }else{
      //     totalProfit = totalProfit + (((allBetData[i].rate-1) * allBetData[i].stake) + allBetData[i].stake);
      //   }
      // }
    }
    setTotal({ trade: totalAmount, return: totalProfit });
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <SafeAreaView style={styles.modalView}>
          <View style={styles.modalBox}>
            <View style={styles.container}>
              <View style={styles.hideIconView}>
                <Pressable
                  style={styles.hideIconPress}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Image
                    source={require("../../assets/images/iconPNG/closeIcon.png")}
                    resizeMode="contain"
                    style={styles.hideIconImg}
                    tintColor={"#DAA520"}
                  />
                </Pressable>
              </View>

              {allBetData.length > 0 && (
                <FlatList
                  keyExtractor={(item) => item._id}
                  data={allBetData}
                  style={{ marginTop: 10, marginBottom: 20 }}
                  renderItem={({ item }) => {
                    return <InvestBetCard item={item} />;
                  }}
                />
              )}

              {allBetData.length == 0 && (
                <View style={styles.emptyTrade}>
                  <Text
                    style={{ color: "#fff", fontSize: 12, fontWeight: "500" }}
                  >
                    You Did't Placed Any Bet Yet
                  </Text>
                </View>
              )}
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalView: {
    width: "100%",
    flex: 1,
    borderRadius: 5,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalBox: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  Icon: {
    flex: 1,
    marginVertical: 5,
    marginHorizontal: 5,
    position: "absolute",
    top: -50,
    right: 10,
  },

  container: {
    width: "100%",
    height: height,
    backgroundColor: "#151C26",
  },
  hideIconView: {
    alignItems: "flex-end",
    paddingTop: 10,
    paddingRight: 10,
  },
  hideIconPress: {
    width: 20,
    height: 20,
  },
  hideIconImg: {
    width: "100%",
    height: "100%",
    tintColor: "#DAA520"
    // backgroundColor: 'black',
  },

  investedAmountMainContainer: {},

  // investLogoContainer: {
  //   flexDirection: "row",
  // },

  investLogoContainerView: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  cardAvailableBalanceView: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 2,
  },

  cardAvailableBalanceText: {
    color: "#000",
    marginLeft: 5,
  },

  investLogoText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "400",
    // marginLeft: 5,
  },

  investSideContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    marginBottom: 20,
    height: 70,
    // backgroundColor: 'orange',
  },

  investSideCardMoneyView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  investSideCardDivider: {
    width: 1,
    backgroundColor: "#364253",
  },

  investCurrentValueView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  investMoneyText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },

  investmentText: {
    color: "#959CA7",
    fontSize: 12,
    marginTop: 5,
    fontWeight: "400",
  },

  cureentValueText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2ba7f3",
  },

  currentValueTextLower: {
    color: "#6b737a",
    fontSize: 16,
    marginTop: 5,
    fontWeight: "500",
  },

  investLiveGain: {
    marginTop: 10,
  },

  investLiveGainText: {
    color: "#3c3636",
  },

  // Invest Bet Card Styles..
  mainInvestBetCardStyles: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginBottom: 5,
    borderRadius: 5,
    padding: 5,
    elevation: 5,
    shadowColor: "#fff",
  },

  cardBetMessageView: {
    marginVertical: 5,
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  cardBetMessageText: {
    color: "#000",
    fontWeight: "500",
    fontSize: 12,
  },

  cardBetDecisionOddView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingVertical: 5,
  },

  cardBetDecisionView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  cardBetDecisionText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "400",
  },

  cardBetAmount: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },

  emptyTrade: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default memo(LiveBetModal);

import React, { memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import Icons from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-vector-icons//Ionicons";
import { sessionProfitCalculate } from "../../util/sessionProfitCalculate";
import { sessionExposure } from "../../util/sessionExposure";

const BettingBetLayCard = (props) => {
  const team1rate = props.data?.marketBook?.availableToBack?.size;
  const team2rate = props.data?.marketBook?.availableToLay?.size;

  const team1price = props.data?.marketBook?.availableToBack?.price;
  const team2price = props.data?.marketBook?.availableToLay?.price;

  let betData = {
    yesPrice: props.data?.marketBook?.availableToBack?.price,
    noPrice: props.data?.marketBook?.availableToLay?.price,
    marketId: props.data?.marketId,
    eventId: props.data?.eventId,
    eventName: props.data?.eventName,
    marketType: props.data?.marketType,
  };

  return (
    <>
      <View>
        <View style={styles.horizontalBettingBar}>
          <View style={styles.optionBet}>
            <Text style={[styles.optionText, { flex: 1 }]}>
              {props.data.marketName}
            </Text>
            <TouchableOpacity
              disabled={
                props.allBetData.some(
                  (item) => item.marketId === props.data?.marketId
                )
                  ? props?.marketLoad
                  : true
              }
              onPress={() => props.sessionBetModalOpen(props.data)}
            >
              <Text
                style={[
                  styles.optionText,
                  {
                    fontSize: 14,
                    color:
                      sessionExposure(
                        props.allBetData.filter((myItem) => {
                          return myItem.marketId == props.data?.marketId;
                        }),
                        props.data?.marketId
                      ) < 0
                        ? "#FF0000"
                        : "#3CB043",
                  },
                ]}
              >
                {sessionExposure(
                  props.allBetData.filter((myItem) => {
                    return myItem.marketId == props.data?.marketId;
                  }),
                  props.data?.marketId
                ).toFixed(2)}
              </Text>
            </TouchableOpacity>
<<<<<<< HEAD
=======
            <Text style={styles.limitStatus}>{`Min: ${props?.limit?.min} Max: ${props?.limit?.max}`}</Text>
>>>>>>> origin/main
          </View>
          <View style={styles.betSelectView}>
            <TouchableOpacity
              style={[
                styles.backlayView,
                { backgroundColor: "#eeadba", borderColor: "#eeadba" },
              ]}
              onPress={() => {
                props.betModalonPress(
                  props.data.marketName,
                  team1rate,
                  team2rate,
                  "no",
                  betData
                );
              }}
            >
              <Text style={[styles.backlayText, {}]}>{team2price}</Text>
              <Text style={[styles.backlayText, { fontSize: 10 }]}>
                {team2rate}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backlayView}
              onPress={() => {
                props.betModalonPress(
                  props.data.marketName,
                  team1rate,
                  team2rate,
                  "yes",
                  betData
                );
              }}
            >
              <Text style={styles.backlayText}>{team1price}</Text>
              <Text style={[styles.backlayText, { fontSize: 10 }]}>
                {team1rate}
              </Text>
            </TouchableOpacity>
            {(props.data?.marketBook?.status != "OPEN" ||
              props.data?.marketBook.statusLabel != "OPEN" ||
              props?.marketLoad) && (
              <View style={styles.suspend}>
                <View style={styles.suspendInner}>
                  {props.data?.marketBook?.status != "SUSPENDED" &&
                    !props?.marketLoad && (
                      <Icon
                        name="tennisball"
                        color="#FF0000"
                        size={20}
                        style={{ marginRight: 2 }}
                      />
                    )}
                  <Text style={styles.suspendText}>
                    {props?.marketLoad
                      ? "SUSPENDED"
                      : props.data?.marketBook?.statusLabel}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  horizontalBettingBar: {
    flexDirection: "row",
    marginTop: 5,
  },
  optionBet: {
    flex: 1,
    flexDirection: "row",
<<<<<<< HEAD
    padding: 10,
=======
    padding: 5,
>>>>>>> origin/main
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8F7FE",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#64B3E2",
  },
  optionText: {
<<<<<<< HEAD
    fontSize: 13,
    fontWeight: "700",
=======
    fontSize: 11,
    fontWeight: "500",
>>>>>>> origin/main
    color: "#096caa",
  },
  betSelectView: {
    width: "40%",
    flexDirection: "row",
    marginLeft: 5,
  },
  backlayView: {
    flex: 1,
    padding: 5,
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 2,
    backgroundColor: "#83b9ea",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#83b9ea",
  },
  backlayText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
  suspend: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 2,
    left: 0,
    opacity: 0.8,
    alignItems: "center",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    overflow: "hidden",
    borderColor: "#DAA520",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderWidth: 2,
  },
  suspendLine: {
    width: 4,
    height: "150%",
    backgroundColor: "rgba(140, 140, 140, 0.58)",
    transform: [{ rotate: "30deg" }],
  },
  suspendInner: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  suspendText: {
    color: "#FF0000",
    fontSize: 16,
    fontWeight: "bold",
  },
<<<<<<< HEAD
=======
  limitStatus: {
    fontSize: 8,
    position: 'absolute',
    bottom: 0,
    left: 12,
     color:'#000'
  }
>>>>>>> origin/main
});

export default memo(BettingBetLayCard);

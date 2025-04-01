import React, { memo } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

const SportsCard = (props) => {
  const team1rate =
    props.data?.availableToBack?.size === undefined
      ? 0
      : props.data?.availableToBack?.size;
  const team2rate =
    props.data?.availableToLay?.size === undefined
      ? 0
      : props.data?.availableToLay?.size;

  const team1price =
    props.data?.availableToBack?.price === undefined
      ? 0
      : props.data?.availableToBack?.price;
  const team2price =
    props.data?.availableToLay?.price === undefined
      ? 0
      : props.data?.availableToLay?.price;

  return (
    <View>
      <View style={styles.horizontalBettingBar}>
        <View style={styles.optionBet}>
          <Text style={styles.optionText}>{props.data.runnerName === undefined ? props.runnerName : props.data.runnerName}</Text>
        </View>
        <View style={styles.betSelectView}>
          <View style={styles.backlayView}>
            <Text style={styles.backlayText}>{team1price}</Text>
            <Text style={[styles.backlayText, { fontSize: 10 }]}>
              {team1rate}
            </Text>
          </View>
          <View
            style={[
              styles.backlayView,
              { backgroundColor: "#eeadba", borderColor: "#eeadba" },
            ]}
          >
            <Text style={[styles.backlayText, {}]}>
              {team2price}
            </Text>
            <Text style={[styles.backlayText, { fontSize: 10 }]}>
              {team2rate}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  horizontalBettingBar: {
    flexDirection: "row",
    marginTop: 5,
    paddingBottom: 5,
    borderBottomWidth: 0.2,
    borderRadius: 10,
    borderColor: "#fff",
  },
  optionBet: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  optionText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#fff",
  },
  betSelectView: {
    width: "40%",
    flexDirection: "row",
    marginLeft: 5,
  },
  backlayView: {
    flex: 1,
    padding: 2,
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
    color: "#fff",
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
  },
  suspendLine: {
    width: 4,
    height: "150%",
    backgroundColor: "rgba(149, 156, 167, 0.2)",
    transform: [{ rotate: "30deg" }],
  },
  suspendInner: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  suspendText: {
    color: "#ed1539",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default memo(SportsCard);

import React from "react";
import { View, Text, StyleSheet } from "react-native";

function SessionModal({
  name,
  value
}) {
  return (
    <View>
      {/* {minimumStake === allbets.selectionName ? (
        <View style={styles.betHeading}>
          <View style={styles.betRunnerBox}>
            <Text style={styles.boxRunnertext}>
              {allbets.selectionName - 1}
            </Text>
          </View>
          <View style={styles.betRunnerBox}>
            <Text
              style={[
                styles.boxRunnertext,
                laytotal >= 0 ? { color: "green" } : { color: "red" },
              ]}
            >
              {Math.round(laytotal)}
            </Text>
          </View>
        </View>
      ) : (
        <View></View>
      )} */}
      <View style={styles.betHeading}>
        <View style={styles.betRunnerBox}>
          <Text style={styles.boxRunnertext}>{name}</Text>
        </View>
        <View style={styles.betRunnerBox}>
          <Text
            style={[
              styles.boxRunnertext,
              value >= 0 ? { color: "green" } : { color: "red" },
            ]}
          >
            {Math.round(value)}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default SessionModal;

const styles = StyleSheet.create({
  betHeading: {
    flexDirection: "row",
    width: "100%",
  },
  betBox: {
    borderColor: "#000",
    borderWidth: 2,
    backgroundColor: "#000",
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  boxtext: {
    marginVertical: 5,
    marginHorizontal: 3,
    fontWeight: "bold",
    color: "#fff",
  },
  betRunnerBox: {
    borderColor: "#fff",
    backgroundColor: "#202020",
    borderWidth: 1,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  boxRunnertext: {
    marginVertical: 5,
    marginHorizontal: 3,
    fontWeight: "bold",
    color: "#fff",
  },
});

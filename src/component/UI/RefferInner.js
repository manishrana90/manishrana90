import React from "react";
import { View, Text, StyleSheet } from "react-native";
import moment from "moment";
import "moment-timezone";

function RefferInner({ data }) {
  return (
    <View>
      <View style={styles.refferHeading}>
        <View style={styles.head}>
          <Text style={styles.headText}>
            {moment(data.time).format("MMMM DD YYYY hh:mm:ss A")}
          </Text>
        </View>
        <View style={styles.head}>
          <Text style={styles.headText}>
            {data?.eventName ? data?.eventName : data?.eventTypeName}
          </Text>
        </View>
        <View style={styles.head1}>
          <Text style={styles.headText}>{data.remark}</Text>
        </View>
        <View style={styles.head}>
          <Text style={styles.headText}>{data.amount}</Text>
        </View>
      </View>
    </View>
  );
}

export default RefferInner;

const styles = StyleSheet.create({
  refferHeading: {
    flexDirection: "row",
    marginTop: 5,
    marginLeft: 8,
    marginRight: 8,
  },
  head: {
    width: "22%",
    alignItems: "center",
    justifyContent: "center",
    margin: 0.5,
    borderColor: "#fff",
    borderWidth: 0.7,
    borderRadius: 2,
  },
  head1: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 0.5,
    borderColor: "#fff",
    borderWidth: 0.7,
    borderRadius: 2,
  },
  headText: {
    color: "#fff",
    margin: 10,
  },
});

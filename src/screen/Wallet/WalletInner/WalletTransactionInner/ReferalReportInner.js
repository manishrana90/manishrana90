import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ReferalReportInner = ({ data }) => {
  const navigation = useNavigation();

  return (
    <View>
      <View style={styles.refferHeading}>
        <View style={styles.head}>
          <Text style={styles.headText}>{data?.username}</Text>
        </View>
        <View style={styles.head}>
          <Text style={styles.headText}>{data?.total_referal_amount_get}</Text>
        </View>
        <View style={styles.head}>
          {/* <TouchableOpacity style={} onPress={() => {}}>
            <Text style={styles.headText}>xyz</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.histyButton}
            onPress={() => {
              navigation.navigate("ReferalHistory", { userId: data?._id });
            }}
          >
            <Text style={[{ color: "#fff" }]}>History</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ReferalReportInner;

const styles = StyleSheet.create({
  refferHeading: {
    flexDirection: "row",
    marginVertical: 2,
    marginLeft: 2,
    marginRight: 2,
  },
  head: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 0.5,
    borderColor: "#fff",
    borderWidth: 0.7,
    borderRadius: 3,
  },
  head1: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 0.5,
    borderColor: "#fff",
    borderWidth: 0.7,
  },
  headText: {
    color: "#fff",
    margin: 4,
  },

  histyButton: {
    marginVertical: 4,
    backgroundColor: "#f2b71a",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
});

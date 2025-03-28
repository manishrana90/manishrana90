import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import moment from "moment";
import "moment-timezone";

function FixDepositInner({ data }) {
  const today = new Date();

  return (
    <View style={styles.mainContainer}>
      <View style={styles.balanceCont}>
        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/images/iconPNG/f_d.jpg")}
            resizeMode="contain"
            style={styles.image}
          />
        </View>
        <View style={styles.listdename}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ width: "70%" }}>
              <Text style={styles.balnint}>
                {Number(data.amount).toFixed(2)}
              </Text>
            </View>
            <View style={{ width: "30%" }}>
              <Text
                style={[
                  styles.balnint,
                  { textAlign: "right", fontSize: 10, paddingRight: 5 },
                ]}
              >
                {moment(data.createdAt).from(moment(today))}
              </Text>
            </View>
          </View>
          <Text style={styles.smtext}>
            Old Limit: {Number(data.oldLimit).toFixed(2)}, New Limit:{" "}
            {Number(data.newLimit).toFixed(2)}
          </Text>
          <Text style={styles.smtext}>
            Amount: {data.schemeArr.amount}, {data.schemeArr.arr.name},
            Interest: {data.schemeArr.arr.percentage}%
          </Text>
        </View>
      </View>
    </View>
  );
}

export default FixDepositInner;

const styles = StyleSheet.create({
  mainContainer: {},
  listdename: {
    width: "80%",
    padding: 4,
  },
  imageContainer: {
    width: "20%",
    margin: 4,
    alignItems: "center",
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  smtext: {
    fontSize: 11,
    fontWeight: "300",
    color: "#fff",
  },
  balnint: {
    color: "#fff",
    fontSize: 12,
  },
  balanceCont: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 4,
    marginHorizontal: 8,
    backgroundColor: "#131820",
    borderRadius: 4,
    borderColor: "green",
    borderWidth: 1,
  },
});

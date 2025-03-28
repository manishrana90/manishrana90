import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import moment from "moment";
import "moment-timezone";

const TransactionHistoryCard = ({ item, setData }) => {
  let image = require(`../../assets/images/paymentGateways/withdrawIcon.png`);
  // if (item.type === "Deposit") {
  //   image = require(`../../assets/images/paymentGateways/deposit.png`);
  // }

  return (
    <TouchableOpacity style={styles.mainViewCard} onPress={()=> setData()}>
      <LinearGradient
        style={{borderRadius: 5}}
        colors={["#232e46", "#101729"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.gradient} >
          <View style={styles.imageViewHolder}>
            <Image source={image} style={styles.imageStyles} />
          </View>

          <View style={styles.paymentGatewayHolder}>
            <Text style={styles.paymentGatewayTextHead}>{item.type} {item?.type === "Deposit" ? "to" : "from"}{" "}
                  {item?.to}</Text>
            <Text style={[
                styles.paymentGatewayText,
                item.status === "Approved" && { color: "#2CC597" },
                item.status === "Decline" && { color: "#fb364c" },
              ]}
            >
              {item.status}
            </Text>
          </View>

          <View style={styles.paymentTimeAmountHolder}>
            <View style={styles.datetimeHolder}>
              <Text style={styles.dateTimeText}>
                {moment(item.updatedAt).format("D MMM YYYY | hh:mm A")}
              </Text>
            </View>
            <View style={styles.amountHolder}>
              <Text style={[
                  styles.amountText,
                  item.status === "Approved" && { color: "#2CC597" },
                  item.status === "Decline" && { color: "#fb364c" },
                ]}>₹ {item.amount}</Text>
            </View>
          </View>
        </View>
        {
          item.type=='Withdrawal' &&
          <Text style={styles.remarkStyle} >Remark: {item.remarks}</Text>
        }
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainViewCard: {
    marginHorizontal: 15,
    marginTop: 6,
  },
  gradient: {
    flexDirection: "row",
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  imageViewHolder: {
    height: 40,
    width: 40,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    marginRight: 5,
  },
  imageStyles: {
    height: 30,
    width: 30,
    resizeMode: "contain",
  },
  paymentGatewayHolder: {
    marginHorizontal: 5,
    justifyContent: "center",
  },
  paymentGatewayTextHead: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 5,
  },
  paymentGatewayText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#FFF380",
  },
  paymentTimeAmountHolder: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  dateTimeText: {
    fontSize: 12,
    color: "#fff",
  },
  amountText: {
    fontSize: 16,
    color: "#FFF380",
  },
  remarkStyle : {
    marginHorizontal: 10,
    marginBottom: 5,
    fontSize: 10,
    color: '#fff',
  }
});

export default TransactionHistoryCard;

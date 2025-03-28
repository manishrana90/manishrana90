import React from "react";
import { View, Text, StyleSheet, Pressable, Image, TouchableOpacity } from "react-native";
import moment from "moment";
import "moment-timezone";
import { useNavigation } from "@react-navigation/native";

const AccountStatementCard = ({ item }) => {
  const navigation = useNavigation();

  const allBets = () => {
    navigation.navigate("AccountBetShow", { marketId: item.marketId, eventTypeName: item.eventTypeName });
  }

  return (
    <TouchableOpacity disabled={item?.subAction === "BALANCE_DEPOSIT"
    || item?.subAction === "BALANCE_WITHDRAWL"} style={styles.bettingCardView} onPress={()=> { allBets(); }}>
      <View style={styles.bettingCardToggleView}>
        <View style={styles.betStatusStyles}>
          <Text style={[styles.betStatusText, { marginVertical: 2 }]}>
            {item.subAction === "BALANCE_DEPOSIT"
              ? "Deposit"
              : item.subAction === "BALANCE_WITHDRAWL"
              ? "Withdrawal"
              : item.eventTypeName === "Casino"
              ? 'Casino'
              : item.eventName === "Ball By Ball"
              ? item.eventName
              : item.eventTypeName}
          </Text>
        </View>
        <View style={styles.betDateStyles}>
          <Text style={styles.betCardDate}>
            {moment(item.time).format("D MMM YYYY")}
          </Text>
          <Text style={styles.betCardTime}>
            {moment(item.time).format("hh:mm A")}
          </Text>
        </View>
      </View>

      <View style={[styles.innerDetailBetCardView]}>
        <View style={styles.innerDetailBetCardViewUpper}>
          <View style={styles.innerbetNameCardView}>
            <Text style={styles.innerbetNameText}>
              {item.subAction === "BALANCE_DEPOSIT" ||
              item.subAction === "BALANCE_WITHDRAWL"
                ? item.subAction.replace(/_/g, " ")
                : item.eventTypeName === "Casino"
                ? item.gameId
                : item.eventName}
            </Text>
            <Text style={styles.innerBetDesc}>
              {item.subAction === "BALANCE_DEPOSIT" ||
              item.subAction === "BALANCE_WITHDRAWL"
                ? `${item.description}`
                : item.marketName}
            </Text>

            <Text style={[styles.innerBetDesc, { color: "#DAA520" }]}>
              Old Limit: {item.oldLimit.toFixed(2)}, New Limit: {item.newLimit.toFixed(2)}
            </Text>
            {(!!item?.actionBy)&&
              <Text style={[styles.innerBetDesc, { color: "#DAA520" }]}>
                Action By: {item?.actionBy}
              </Text>
            }
          </View>
        </View>
      </View>

      <View style={styles.bettingCardMainView}>
        <View style={styles.bettingCardMainViewUpper}>
          <View style={styles.amountViewStyles}>
            {item.eventTypeId === "550" ? (
              <Text style={[styles.amountTextStyles, { color: item.subAction === "BALANCE_DEPOSIT" ? "#2cc597"  : "#fb364c" }]}>
                ₹{" "}
                {Number(item.amount) % 1 == 0
                  ? item.amount
                  : Number(item.amount).toFixed(2)}
              </Text>
            ) : (
              <Text style={[styles.amountTextStyles, { color: item.amount > 0 ? "#2cc597"  : "#fb364c" }]}>
                ₹{" "}
                {Number(item.amount) % 1 == 0
                  ? item.amount
                  : Number(item.amount).toFixed(2)}
              </Text>
            )}
          </View>
          {item.subAction === "AMOUNT_WON" ||
          item.subAction === "BALANCE_DEPOSIT" ? (
            <Image
              source={require("../../assets/images/iconPNG/win.png")}
              // resizeMode="contain"
              style={styles.iconImg}
              // tintColor={"#2cc597"}
            />
          ) : (
            // <View style={styles.betStatusWinViewStyles}>
            //   <Text style={styles.betStatusTextStyles}>
            //     {item.subAction === "BALANCE_DEPOSIT" ? "DEPOSIT" : "WIN"}
            //   </Text>
            // </View>
            <Image
              source={require("../../assets/images/iconPNG/loss.png")}
              // resizeMode="contain"
              style={styles.iconImg}
              // tintColor={"#2cc597"}
            />
            // <View style={styles.betStatusLossViewStyles}>
            //   <Text style={styles.betStatusTextStyles}>
            //     {item.subAction === "BALANCE_WITHDRAWL" ? "WITHDRAWAL" : "LOSS"}
            //   </Text>
            // </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bettingCardView: {
    marginHorizontal: 15,
    marginBottom: 12,
    backgroundColor: "#364253",
    borderRadius: 4,
    borderWidth: 0.2,
    borderColor: "#fff",
  },

  bettingCardToggleView: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 5,
    borderBottomWidth: 0.5,
    borderColor: "#adadad",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },

  betStatusStyles: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    marginLeft: 5,
    flexWrap: "wrap",
  },

  betStatusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },

  betDateStyles: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 5,
    marginVertical: 5,
  },

  betCardDate: {
    marginHorizontal: 5,
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },

  betCardTime: {
    marginHorizontal: 5,
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },

  betCardIconViewToggle: {
    marginHorizontal: 5,
    justifyContent: "center",
  },

  bettingCardMainView: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  bettingCardMainViewUpper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  amountTextStyles: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },

  betStatusWinViewStyles: {
    backgroundColor: "#2cc597",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },

  betStatusLossViewStyles: {
    backgroundColor: "#fb364c",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },

  betStatusRunningViewStyles: {
    backgroundColor: "#f8a825",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },

  betStatusTextStyles: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "400",
  },

  bettingCardMainViewLowerWin: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  bettingCardMainViewLower: {
    marginTop: 10,
  },

  betOddText: {
    color: "#fff",
  },

  betwinText: {
    color: "#55af95",
    fontWeight: "500",
  },

  innerDetailBetCardView: {
    padding: 5,
    backgroundColor: "#212A37",
    borderBottomWidth: 0.5,
    borderColor: "#adadad",
  },

  innerDetailBetCardViewUpper: {
    flexDirection: "row",
    alignItems: "center",
  },

  innerbetTypeCardView: {
    width: 30,
    height: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },

  inncerbetTypeImage: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },

  innerbetNameCardView: {
    flex: 1,
    marginHorizontal: 10,
  },

  innerbetNameText: {
    fontSize: 16,
    color: "#fff",
  },

  innerBetDesc: {
    fontSize: 12,
    color: "#e6e6e6",
  },

  innerBetResultWinView: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#55af95",
  },

  innerBetResultLossView: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#d45a65",
  },

  innerBetResultRunningView: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#f8a825",
  },

  innerbetResultText: {
    fontSize: 12,
    color: "#fff",
  },

  innerDetailBetCardViewLower: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },

  innerBetSelectionText: {
    color: "#fff",
  },

  innerBetSelectionOddText: {
    color: "#fff",
  },
  iconImg: {
    height: 40,
    width: 50,
  },
});

export default AccountStatementCard;

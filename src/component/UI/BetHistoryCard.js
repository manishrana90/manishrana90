import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import moment from "moment";
import "moment-timezone";

const BetHistoryCard = ({ item }) => {
  return (
    <View style={styles.bettingCardView}>
      <View style={styles.bettingCardToggleView}>
        <View style={styles.betStatusStyles}>
          <Text style={[styles.betStatusText, { marginVertical: 2 }]}>
            {item.eventTypeName === "Casino"
              ? item.eventName.slice(item.eventName.indexOf("/") + 1)
              : item.eventName}
          </Text>
        </View>
        <View style={styles.betDateStyles}>
          <Text style={styles.betCardDate}>
            {moment(item.placedTime).format("D MMM YYYY")}
          </Text>
          <Text style={styles.betCardTime}>
            {moment(item.placedTime).format("hh:mm A")}
          </Text>
        </View>
      </View>
      <View style={[styles.innerDetailBetCardView]}>
        <View style={styles.innerDetailBetCardViewUpper}>
          <View style={styles.innerbetNameCardView}>
            <Text style={styles.innerbetNameText}>
              {item.eventTypeName === "Casino" ? item.eventId : item.eventName}
            </Text>
            <View style={styles.innerBetDescCont}>
              <Text style={styles.innerBetDesc}>Market: </Text>
              <Text style={styles.innerBetDescText}>{item.marketName}</Text>
            </View>
            <View style={styles.innerBetDescCont}>
              <Text style={styles.innerBetDesc}>Market Id: </Text>
              <Text style={styles.innerBetDescText}>{item.marketId}</Text>
            </View>
            <View style={styles.innerBetDescCont}>
              <Text style={styles.innerBetDesc}>Rate: </Text>
              <Text style={styles.innerBetDescText}>
                {item.type}@{item.rate}
              </Text>
            </View>
            <View style={styles.innerBetDescCont}>
              <Text style={styles.innerBetDesc}>Selection: </Text>
              <Text style={styles.innerBetDescText}>{item.selectionName}</Text>
            </View>
            <View style={styles.innerBetDescCont}>
              <Text style={styles.innerBetDesc}>Stake: </Text>
              <Text style={styles.innerBetDescText}>{item.stake}</Text>
            </View>
            <View style={styles.innerBetDescCont}>
              <Text style={styles.innerBetDesc}>Time: </Text>
              <Text style={styles.innerBetDescText}>
                {moment(item.placedTime).format("D MMM YYYY hh:mm:ss A")}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.bettingCardMainView}>
        <View style={styles.bettingCardMainViewUpper}>
          <View style={styles.amountViewStyles}>
            {(item?.eventTypeName==="Casino"?
              <>
                {item?.totalPayout>0?
                  <Text style={[styles.amountTextStyles, { color: "#2cc597" }]}>
                    {Number(item?.totalPayout).toFixed(2)}
                  </Text>
                  :
                  <Text style={[styles.amountTextStyles, { color: "#fb364c" }]}>
                    {Number(item.stake).toFixed(2)}
                  </Text>
                }
              </>
              :
              <>
                {item.result === "WON" ? (
                  <Text style={[styles.amountTextStyles, { color: "#2cc597" }]}>
                    ₹{" "}
                    {item.type === "Back" && item.runnerId != "1"
                      ? Number((item.rate - 1) * item.stake).toFixed(2)
                      : item.type === "Back" && item.runnerId === "1"
                      ? Number(item.rate * item.stake).toFixed(2)
                      : Number(item.stake).toFixed(2)}
                  </Text>
                  ) : (
                  <Text style={[styles.amountTextStyles, { color: "#fb364c" }]}>
                    ₹{" "}
                    {item.type != "Back" && item.runnerId != "1"
                      ? Number((item.rate - 1) * item.stake).toFixed(2)
                      : item.type != "Back" && item.runnerId === "1"
                      ? Number(item.rate * item.stake).toFixed(2)
                      : Number(item.stake).toFixed(2)}
                  </Text>
                )}
              </>
            )}
          </View>
          {(item.eventTypeName==='Casino'? item?.totalPayout>0 : item.result === "WON") ? (
            <Image
              source={require("../../assets/images/iconPNG/win.png")}
              style={styles.iconImg}
            />
          ) : (
            <Image
              source={require("../../assets/images/iconPNG/loss.png")}
              style={styles.iconImg}
            />
          )}
        </View>
      </View>
    </View>
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
  innerBetDescCont: {
    borderTopColor: "#fff",
    borderTopWidth: 0.5,
    marginTop: 5,
    paddingTop: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  innerBetDesc: {
    minWidth: 80,
    fontSize: 12,
    color: "#e6e6e6",
  },

  innerBetDescText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "500",
    color: "#DAA520",
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

export default BetHistoryCard;

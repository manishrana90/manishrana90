import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";

import { useDispatch } from "react-redux";

import { profitCalculate } from "../../util/profitCalculate";
import BackComponrent from "./BackComponent";
import LayComponent from "./LayComponent";
import { Config } from "../../../config";

const BookMakerBetCard = (props) => {
  const dispatch = useDispatch();

  // console.log('id: ', props.userId)

  const betModalonPress = (
    name,
    yesRate,
    noRate,
    betModalType,
    yesPrice,
    noPrice,
    selectionId
  ) => {
    dispatch({
      type: "BETDATATYPEODDS",
      payload: {
        name: name,
        yesRate: yesRate,
        noRate: noRate,
        betModalType: betModalType,
        selectID: selectionId,
      },
    });
    dispatch({
      type: "BETTYPEODDS",
      payload: betModalType,
    });
    // let betData = {
    //   yesPrice: yesPrice,
    //   noPrice: noPrice,
    //   marketId: props.data?.marketId,
    //   eventId: props.data?.eventId,
    //   eventName: props.data?.eventName,
    //   marketType: props.data?.marketType,
    //   eventTypeId: props.data?.eventTypeId,
    // };

    let market = props.marketsData?.find((mItem) => mItem?.marketId == props.data?.marketId);
    let betData = {
      yesPrice: yesPrice,
      noPrice: noPrice,
      marketId: market?.marketId,
      eventId: market?.eventId,
      eventName: market?.eventName,
      marketType: market?.marketType,
      eventTypeId: market?.eventTypeId,
    }


    dispatch({
      type: "BETALLDATAODDS",
      payload: betData,
    });
    dispatch({
      type: "MODALVISIBLEODDS",
      payload: true,
    });
    dispatch({
      type: "ODDSMARKET",
      payload: props,
    });
  };

  return (
    <>
      <View>
        {props.data?.marketBook?.runners.map((a, i) => {
          const teambackRate =
            a?.availableToBack?.size !== undefined
              ? a?.availableToBack?.size
              : props.data?.runners[i]?.availableToBack?.size !== undefined
              ? props.data?.runners[i]?.availableToBack?.size
              : 0;
          const teamlayRate =
            a?.availableToLay?.size !== undefined
              ? a?.availableToLay?.size
              : props.data?.runners[i]?.availableToLay?.size !== undefined
              ? props.data?.runners[i]?.availableToLay?.size
              : 0;

          const teambackPrice =
            a?.availableToBack?.price !== undefined &&
            a?.availableToBack?.price > 0
              ? a?.availableToBack?.price
              : props.data?.runners[i]?.availableToBack?.price !== undefined
              ? props.data?.runners[i]?.availableToBack?.price
              : 0;
          const teamlayPrice =
            a?.availableToLay?.price !== undefined &&
            a?.availableToLay?.price > 0
              ? a?.availableToLay?.price
              : props.data?.runners[i]?.availableToLay?.price !== undefined
              ? props.data?.runners[i]?.availableToLay?.price
              : 0;

          return (
            <View style={styles.horizontalBettingBar}>
              <View style={styles.optionBet}>
                <Text style={[styles.optionText, { flex: 1 }]}>
                  {a?.runnerName !== undefined
                    ? a?.runnerName
                    : props.data?.runners[i]?.runnerName}
                </Text>
                <Text
                  style={[
                    styles.optionText,
                    props.marketLoad && props.data?.marketName === "Bookmaker"
                      ? { color: "#2aa474" }
                      : props.marketLoad
                      ? -(
                          profitCalculate(
                            props.allBetData,
                            a?.selectionId !== undefined
                              ? a?.selectionId
                              : props.data?.runners[i]?.selectionId,
                            props.data?.marketId
                          ) * 37
                        ) < 0
                        ? { color: "#FF0000" }
                        : { color: "#2aa474" }
                      : profitCalculate(
                          props.allBetData,
                          a?.selectionId !== undefined
                            ? a?.selectionId
                            : props.data?.runners[i]?.selectionId,
                          props.data?.marketId
                        ) < 0
                      ? { color: "#FF0000" }
                      : { color: "#2aa474" },
                  ]}
                >
                  {props.marketLoad && props.data?.marketName === "Bookmaker"
                    ? 0
                    : props.marketLoad
                    ? -(
                        profitCalculate(
                          props.allBetData,
                          a?.selectionId !== undefined
                            ? a?.selectionId
                            : props.data?.runners[i]?.selectionId,
                          props.data?.marketId
                        ) * 37
                      ).toFixed(2)
                    : profitCalculate(
                        props.allBetData,
                        a?.selectionId !== undefined
                          ? a?.selectionId
                          : props.data?.runners[i]?.selectionId,
                        props.data?.marketId
                      ).toFixed(2)}
                </Text>
              </View>

              <View style={styles.betSelectView}>
                <BackComponrent
                  backPrice={teambackPrice}
                  backRate={teambackRate}
                  backPress={() => {
                    if (teambackPrice !== 0) {
                      betModalonPress(
                        a?.runnerName !== undefined
                          ? a?.runnerName
                          : props.data?.runners[i]?.runnerName,
                        teambackRate,
                        teamlayRate,
                        "yes",
                        teambackPrice,
                        teamlayPrice,
                        a?.selectionId
                      );
                    }
                  }}
                />
                <LayComponent
                  layPrice={teamlayPrice}
                  layRate={teamlayRate}
                  layPress={() => {
                    if (teamlayPrice !== 0) {
                      betModalonPress(
                        a?.runnerName !== undefined
                          ? a?.runnerName
                          : props.data?.runners[i]?.runnerName,
                        teambackRate,
                        teamlayRate,
                        "no",
                        teambackPrice,
                        teamlayPrice,
                        a?.selectionId
                      );
                    }
                  }}
                />
                {(a?.status != "ACTIVE" ||
                  props.data?.marketBook?.status != "OPEN" ||
                  props.data?.managerBlocks?.includes(Config.ManagerName) || 
                  props.data?.masterBlocks?.includes(Config.ManagerName) || 
                  props.data?.subadminBlocks?.includes(Config.ManagerName) || 
                  props.data?.suspendMarketBlocks?.includes(props.userId) || 

                  props?.marketLoad) && (
                  <View style={styles.suspend}>
                    <View style={styles.suspendInner}>
                      <Text style={styles.suspendText}>SUSPENDED</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          );
        })}
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
    padding: 10,
    justifyContent: "center",
    backgroundColor: "#E8F7FE",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#64B3E2",
  },
  optionText: {
    fontSize: 13,
    fontWeight: "700",
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
    alignItems: "center",
    justifyContent: "center",
  },
  suspendText: {
    color: "#FF0000",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default memo(BookMakerBetCard);

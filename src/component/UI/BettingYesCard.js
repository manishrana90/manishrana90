import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons//Ionicons";

import { useDispatch } from "react-redux";

import { profitCalculate } from "../../util/profitCalculate";
import BackComponrent from "./BackComponent";
import LayComponent from "./LayComponent";

const BettingYesCard = (props) => {
  const dispatch = useDispatch();

  let firstRunner =
    props.data?.runners[0]?.selectionId !== undefined
      ? props.data?.runners[0]?.selectionId
      : props.data?.marketBook?.runners[0]?.selectionId;

  let secondRunner =
    props.data?.runners[1]?.selectionId !== undefined
      ? props.data?.runners[1]?.selectionId
      : props.data?.marketBook?.runners[1]?.selectionId;
  let thirdRunner =
    props.data?.runners[2]?.selectionId !== undefined
      ? props.data?.runners[2]?.selectionId
      : props.data?.marketBook?.runners[2]?.selectionId;

  const team1backRate =
    props.data?.runners[0]?.availableToBack?.size !== undefined
      ? props.data?.runners[0]?.availableToBack?.size
      : props.data?.marketBook?.runners[0]?.availableToBack?.size !== undefined
      ? props.data?.marketBook?.runners[0]?.availableToBack?.size
      : 0;
  const team1layRate =
    props.data?.runners[0]?.availableToLay?.size !== undefined
      ? props.data?.runners[0]?.availableToLay?.size
      : props.data?.marketBook?.runners[0]?.availableToLay?.size !== undefined
      ? props.data?.marketBook?.runners[0]?.availableToLay?.size
      : 0;

  const team1backPrice =
    props.data?.runners[0]?.availableToBack?.price !== undefined &&
    props.data?.runners[0]?.availableToBack?.price > 0
      ? props.data?.runners[0]?.availableToBack?.price
      : props.data?.marketBook?.runners[0]?.availableToBack?.price !== undefined
      ? props.data?.marketBook?.runners[0]?.availableToBack?.price
      : 0;
  const team1layPrice =
    props.data?.runners[0]?.availableToLay?.price !== undefined &&
    props.data?.runners[0]?.availableToLay?.price > 0
      ? props.data?.runners[0]?.availableToLay?.price
      : props.data?.marketBook?.runners[0]?.availableToLay?.price !== undefined
      ? props.data?.marketBook?.runners[0]?.availableToLay?.price
      : 0;

  const team2backRate =
    props.data?.runners[1]?.availableToBack?.size !== undefined
      ? props.data?.runners[1]?.availableToBack?.size
      : props.data?.marketBook?.runners[1]?.availableToBack?.size !== undefined
      ? props.data?.marketBook?.runners[1]?.availableToBack?.size
      : 0;
  const team2layRate =
    props.data?.runners[1]?.availableToLay?.size !== undefined
      ? props.data?.runners[1]?.availableToLay?.size
      : props.data?.marketBook?.runners[1]?.availableToLay?.size !== undefined
      ? props.data?.marketBook?.runners[1]?.availableToLay?.size
      : 0;

  const team2backPrice =
    props.data?.runners[1]?.availableToBack?.price !== undefined &&
    props.data?.runners[1]?.availableToBack?.price > 0
      ? props.data?.runners[1]?.availableToBack?.price
      : props.data?.marketBook?.runners[1]?.availableToBack?.price !== undefined
      ? props.data?.marketBook?.runners[1]?.availableToBack?.price
      : 0;
  const team2layPrice =
    props.data?.runners[1]?.availableToLay?.price !== undefined &&
    props.data?.runners[1]?.availableToLay?.price > 0
      ? props.data?.runners[1]?.availableToLay?.price
      : props.data?.marketBook?.runners[1]?.availableToLay?.price !== undefined
      ? props.data?.marketBook?.runners[1]?.availableToLay?.price
      : 0;

  const drawbackRate =
    props.data?.marketBook?.runners[2]?.runnerName !== undefined
      ? props.data?.runners[2]?.availableToBack?.size !== undefined
        ? props.data?.runners[2]?.availableToBack?.size
        : props.data?.marketBook?.runners[2]?.availableToBack?.size
      : 0;
  const drawlayRate =
    props.data?.marketBook?.runners[2]?.runnerName !== undefined
      ? props.data?.runners[2]?.availableToLay?.size !== undefined
        ? props.data?.runners[2]?.availableToLay?.size
        : props.data?.marketBook?.runners[2]?.availableToLay?.size
      : 0;

  const drawbackPrice =
    props.data?.marketBook?.runners[2]?.runnerName !== undefined
      ? props.data?.runners[2]?.availableToBack?.price !== undefined
        ? props.data?.runners[2]?.availableToBack?.price
        : props.data?.marketBook?.runners[2]?.availableToBack?.size
      : 0;
  const drawlayPrice =
    props.data?.marketBook?.runners[2]?.runnerName !== undefined
      ? props.data?.runners[2]?.availableToLay?.price !== undefined
        ? props.data?.runners[2]?.availableToLay?.price
        : props.data?.marketBook?.runners[2]?.availableToLay?.size
      : 0;

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
    let betData = {
      yesPrice: yesPrice,
      noPrice: noPrice,
      marketId: props.data?.marketId,
      eventId: props.data?.eventId,
      eventName: props.data?.eventName,
      marketType: props.data?.marketType,
      eventTypeId: props.data?.eventTypeId,
    };
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
        <View style={styles.horizontalBettingBar}>
          <View style={styles.optionBet}>
            <Text style={[styles.optionText, { flex: 1 }]}>
              {props.data?.runners[0]?.runnerName !== undefined
                ? props.data?.runners[0]?.runnerName
                : props.data?.marketBook?.runners[0]?.runnerName}
            </Text>
            <Text
              style={[
                styles.optionText,
                profitCalculate(
                  props.allBetData,
                  firstRunner,
                  props.data?.marketId
                ) < 0
                  ? { color: "#FF0000" }
                  : { color: "#2aa474" },
              ]}
            >
              {profitCalculate(
                props.allBetData,
                firstRunner,
                props.data?.marketId
              ).toFixed(2)}
            </Text>
          </View>

          <View style={styles.betSelectView}>
            <BackComponrent
              backPrice={team1backPrice}
              backRate={team1backRate}
              backPress={() => {
                if (team1backPrice !== 0) {
                  betModalonPress(
                    props.data?.runners[0]?.runnerName !== undefined
                      ? props.data?.runners[0]?.runnerName
                      : props.data?.marketBook?.runners[0]?.runnerName,
                    team1backRate,
                    team1layRate,
                    "yes",
                    team1backPrice,
                    team1layPrice,
                    props.data?.marketBook?.runners[0]?.selectionId
                  );
                }
              }}
            />
            <LayComponent
              layPrice={team1layPrice}
              layRate={team1layRate}
              layPress={() => {
                if (team1layPrice !== 0) {
                  betModalonPress(
                    props.data?.runners[0]?.runnerName !== undefined
                      ? props.data?.runners[0]?.runnerName
                      : props.data?.marketBook?.runners[0]?.runnerName,
                    team1backRate,
                    team1layRate,
                    "no",
                    team1backPrice,
                    team1layPrice,
                    props.data?.marketBook?.runners[0]?.selectionId
                  );
                }
              }}
            />
            {props.data?.marketBook?.status != "OPEN" && (
              <View style={styles.suspend}>
                <View style={styles.suspendInner}>
                  <Icon
                    name="tennisball"
                    color="#FF0000"
                    size={20}
                    style={{ marginRight: 2 }}
                  />
                  <Text style={styles.suspendText}>
                    {props.data?.marketBook?.status}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
        <View style={styles.horizontalBettingBar}>
          <View style={styles.optionBet}>
            <Text style={[styles.optionText, { flex: 1 }]}>
              {props.data?.runners[1]?.runnerName !== undefined
                ? props.data?.runners[1]?.runnerName
                : props.data?.marketBook?.runners[1]?.runnerName}
            </Text>
            <Text
              style={[
                styles.optionText,
                profitCalculate(
                  props.allBetData,
                  secondRunner,
                  props.data?.marketId
                ) < 0
                  ? { color: "#FF0000" }
                  : { color: "#2aa474" },
              ]}
            >
              {profitCalculate(
                props.allBetData,
                secondRunner,
                props.data?.marketId
              ).toFixed(2)}
            </Text>
          </View>
          <View style={styles.betSelectView}>
            <BackComponrent
              backPrice={team2backPrice}
              backRate={team2backRate}
              backPress={() => {
                if (team2backPrice !== 0) {
                  betModalonPress(
                    props.data?.runners[1]?.runnerName !== undefined
                      ? props.data?.runners[1]?.runnerName
                      : props.data?.marketBook?.runners[1]?.runnerName,
                    team2backRate,
                    team2layRate,
                    "yes",
                    team2backPrice,
                    team2layPrice,
                    props.data?.marketBook?.runners[1]?.selectionId
                  );
                }
              }}
            />
            <LayComponent
              layPrice={team2layPrice}
              layRate={team2layRate}
              layPress={() => {
                if (team2layPrice !== 0) {
                  betModalonPress(
                    props.data?.runners[1]?.runnerName !== undefined
                      ? props.data?.runners[1]?.runnerName
                      : props.data?.marketBook?.runners[1]?.runnerName,
                    team2backRate,
                    team2layRate,
                    "no",
                    team2backPrice,
                    team2layPrice,
                    props.data?.marketBook?.runners[1]?.selectionId
                  );
                }
              }}
            />
            {props.data?.marketBook?.status != "OPEN" && (
              <View style={styles.suspend}>
                <View style={styles.suspendInner}>
                  <Icon
                    name="tennisball"
                    color="#FF0000"
                    size={20}
                    style={{ marginRight: 2 }}
                  />
                  <Text style={styles.suspendText}>
                    {props.data?.marketBook?.status}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {props.data?.marketBook?.runners[2]?.runnerName !== undefined && (
          <View style={styles.horizontalBettingBar}>
            <View style={styles.optionBet}>
              <Text style={[styles.optionText, { flex: 1 }]}>
                {props.data?.runners[2]?.runnerName !== undefined
                  ? props.data?.runners[2]?.runnerName
                  : props.data?.marketBook?.runners[2]?.runnerName}
              </Text>
              <Text
                style={[
                  styles.optionText,
                  profitCalculate(
                    props.allBetData,
                    thirdRunner,
                    props.data?.marketId
                  ) < 0
                    ? { color: "#FF0000" }
                    : { color: "#2aa474" },
                ]}
              >
                {profitCalculate(
                  props.allBetData,
                  thirdRunner,
                  props.data?.marketId
                ).toFixed(2)}
              </Text>
            </View>
            <View style={styles.betSelectView}>
              <BackComponrent
                backPrice={drawbackPrice === "" ? 0 : drawbackPrice}
                backRate={drawbackRate}
                backPress={() => {
                  if (drawbackPrice !== 0) {
                    betModalonPress(
                      props.data?.runners[2]?.runnerName !== undefined
                        ? props.data?.runners[2]?.runnerName
                        : props.data?.marketBook?.runners[2]?.runnerName,
                      drawbackRate,
                      drawlayRate,
                      "yes",
                      drawbackPrice,
                      drawlayPrice,
                      props.data?.marketBook?.runners[2]?.selectionId
                    );
                  }
                }}
              />
              <LayComponent
                layPrice={drawlayPrice}
                layRate={drawlayRate}
                layPress={() => {
                  if (drawlayPrice !== 0) {
                    betModalonPress(
                      props.data?.runners[2]?.runnerName !== undefined
                        ? props.data?.runners[2]?.runnerName
                        : props.data?.marketBook?.runners[2]?.runnerName,
                      drawbackRate,
                      drawlayRate,
                      "no",
                      drawbackPrice,
                      drawlayPrice,
                      props.data?.marketBook?.runners[2]?.selectionId
                    );
                  }
                }}
              />
              {props.data?.marketBook?.status != "OPEN" && (
                <View style={styles.suspend}>
                  <View style={styles.suspendInner}>
                    <Icon
                      name="tennisball"
                      color="#FF0000"
                      size={20}
                      style={{ marginRight: 2 }}
                    />
                    <Text style={styles.suspendText}>
                      {props.data?.marketBook?.status}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}
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
    flexDirection: "row",
  },
  suspendText: {
    color: "#FF0000",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default memo(BettingYesCard);

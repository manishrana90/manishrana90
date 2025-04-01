import React, { useEffect, useLayoutEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";
import Toast from "react-native-toast-message";

import { batch, useDispatch, useSelector } from "react-redux";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import { AuthContext } from "../../store/auth-context";
import { GetUserDetail, GetUserSetting } from "../../util/http";
import { Socket } from "../../util/socket";
import BettingYesCard from "../../component/UI/BettingYesCard";
import ConfirmBookmakerModal from "../../component/UI/ConfirmBookmakerModal";
import LiveBetModal from "../../component/UI/LiveBetModal";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const LiveBetting = () => {
  const dispatch = useDispatch();
  const {
    allVirData,
    allBetData,
    loading,
    refreshing,
    modalVisible,
    modalVisibleOdds,
    betDataTypeOdds,
    betTypeOdds,
    betAllDataOdds,
    oddsMarket,
    virtualResult,
    count,
    placeType,
  } = useSelector((state) => state.liveBet);

  const authCtx = useContext(AuthContext);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  useEffect(() => {
    if (authCtx.token === null || authCtx.token === undefined) {
      navigation.navigate("Home");
    }
  }, [authCtx.logout]);

  const onRefresh = React.useCallback(() => {
    dispatch({
      type: "REFRESHING",
      payload: true,
    });
    wait(2000).then(() =>
      dispatch({
        type: "REFRESHING",
        payload: false,
      })
    );
    restart();
  }, [authCtx]);

  const getUserBalance = async () => {
    if (authCtx.token != null && authCtx.token != undefined) {
      const token = JSON.parse(authCtx.token);

      let refreshData = {
        user: {
          _id: token._id,
          key: token.key,
          token: token.verifytoken,
          details: {
            username: token.details.username,
            role: token.details.role,
            status: token.details.status,
          },
        },
      };
      Socket.emit("get-user", refreshData);
      Socket.emit("refresh-balance", refreshData);

      const userDetail = await GetUserDetail({ token: token.verifytoken });

      if (userDetail?.logout === true) {
        authCtx.logout();
        navigation.navigate("Home");
        Toast.show({
          type: "error",
          text1: "Someone Login",
          text2: `Your id has been login somewhere else.`,
        });
      }
    }
  };

  useEffect(() => {
    const handleVirtualPulse = (...args) => {
      dispatch({
        type: "ALLVIRDATA",
        payload: args[0],
      });
    };

    const handleVirBetsSuccess = (...args) => {
      let allBets = args[0].filter((item) => {
        return item.eventId == "1234822733";
      });
      dispatch({
        type: "ALLBETDATA",
        payload: allBets,
      });
    };

    const disconnectVirEmit = () => {
      if (authCtx.token != null && authCtx.token != undefined) {
        const token = JSON.parse(authCtx.token);
        let data = {
          token: token.verifytoken,
          eventId: "1234822733",
        };
        Socket.emit("add-to-room-virtual", data);
      }
    };

    const placeBetVirSuccess = (...args) => {
      batch(() => {
        dispatch({
          type: "LOADING",
          payload: false,
        });
        dispatch({
          type: "COUNT",
          payload: 0,
        });
        dispatch({
          type: "PLACETYPE",
          payload: "",
        });
      });
      if (args[0]?.bet?.eventTypeId === "v9") {
        Toast.show({
          type: "success",
          text1: "Bet Success",
          text2: `Your bet has been placed successfully.😊`,
        });
      }
      getUserBalance();
      getBetsAndResult();
    };

    const placeBetVirError = (...args) => {
      batch(() => {
        dispatch({
          type: "LOADING",
          payload: false,
        });
        dispatch({
          type: "COUNT",
          payload: 0,
        });
        dispatch({
          type: "PLACETYPE",
          payload: "",
        });
      });
      Toast.show({
        type: "error",
        text1: "Trade Placed Error",
        text2: `😔${args[0].message}😔`,
      });
    };

    const editVirStake = (...args) => {
      Toast.show({
        type: "success",
        text1: "Stake Updated Successfully",
      });
    };

    const logoutVirListen = (...args) => {
      authCtx.logout();
    };

    const handleVirResultSuccess = (...args) => {
      dispatch({
        type: "VIRTUALRESULT",
        payload: args[0],
      });
    };

    if (isFocused) {
      Socket.on("logout", logoutVirListen);

      Socket.on("get-bets-success", handleVirBetsSuccess);

      Socket.on("place-bet-success", placeBetVirSuccess);

      Socket.on("place-bet-error", placeBetVirError);

      Socket.on("disconnect", disconnectVirEmit);

      Socket.on(`virtual-pulse-1234822733`, handleVirtualPulse);

      Socket.on("edit-stake-success", editVirStake);

      Socket.on(`get-virtual-result-success`, handleVirResultSuccess);
    }
    return () => {
      Socket.off(`virtual-pulse-1234822733`, handleVirtualPulse);
      Socket.off("get-bets-success", handleVirBetsSuccess);
      Socket.off("logout", logoutVirListen);
      Socket.off("place-bet-success", placeBetVirSuccess);
      Socket.off("place-bet-error", placeBetVirError);
      Socket.off("edit-stake-success", editVirStake);
      Socket.off("disconnect", disconnectVirEmit);
      Socket.off(`get-virtual-result-success`, handleVirResultSuccess);
    };
  }, [isFocused, Socket, authCtx, Toast]);

  useLayoutEffect(() => {
    if (isFocused) {
      batch(() => {
        dispatch({
          type: "ALLDATA",
          payload: null,
        });
        dispatch({
          type: "ALLBETDATA",
          payload: [],
        });
        dispatch({
          type: "MODALVISIBLEODDS",
          payload: false,
        });
        dispatch({
          type: "MODALVISIBLE",
          payload: false,
        });
      });

      if (authCtx.token != null && authCtx.token != undefined) {
        const token = JSON.parse(authCtx.token);
        let data = {
          user: {
            _id: token._id,
            key: token.key,
            details: {
              username: token.details.username,
              role: token.details.role,
              status: token.details.status,
            },
          },
          eventId: "1234822733",
        };
        Socket.emit("add-to-room-virtual", data);

        let betData = {
          user: {
            _id: token._id,
            key: token.key,
            details: {
              username: token.details.username,
              role: token.details.role,
              status: token.details.status,
            },
          },
          filter: {
            eventId: "1234822733",
            username: token.details.username,
            deleted: false,
            result: "ACTIVE",
          },
          sort: { placedTime: -1 },
        };
        Socket.emit("get-bets", betData);
        Socket.emit("get-virtual-result", betData);
      }
    }
  }, [isFocused, Socket]);

  const getBetsAndResult = () => {
    if(authCtx.token != null && authCtx.token != undefined) {
      const userData = JSON.parse(authCtx.token);
      let betData = {
        user: {
          _id: userData._id,
          key: userData.key,
          details: {
            username: userData.details.username,
            role: userData.details.role,
            status: userData.details.status,
          },
        },
        filter: {
          eventId: "1234822733",
          username: userData.details.username,
          deleted: false,
          result: "ACTIVE",
        },
        sort: { placedTime: -1 },
      };
      Socket.emit("get-bets", betData);
      Socket.emit("get-virtual-result", betData);
    }
  }

  const restart = async () => {
    if (authCtx.token != null && authCtx.token != undefined) {
      const userData = JSON.parse(authCtx.token);
      getUserBalance();

      let data = {
        user: {
          _id: userData._id,
          key: userData.key,
          details: {
            username: userData.details.username,
            role: userData.details.role,
            status: userData.details.status,
          },
        },
        eventId: "1234822733",
      };
      Socket.emit("add-to-room-virtual", data);
      
      getBetsAndResult();
    }
  };

  useEffect(() => {
    if(isFocused && authCtx.token) {
      const FetchUserSetting = async() => {
        const token = JSON.parse(authCtx.token);
        const data = {
          eventTypeId: "v9",
          user_id: token?.details?._id,
        }

        const response = await GetUserSetting(data);
        if(response?.success == true) {
          dispatch({
            type: "VIRTUALTIME",
            payload: parseInt(response?.response?.data?.betDelay),
          });
        }
      }

      FetchUserSetting();
    }
  }, [authCtx, isFocused])

  let run1 = 0;
  let wkt1 = 0;
  for (let i = 0; i < allVirData?.scoreHomeVirtual?.length; i++) {
    run1 = JSON.parse(allVirData?.scoreHomeVirtual[i].Run) + run1;
    wkt1 = JSON.parse(allVirData?.scoreHomeVirtual[i].Wkt) + wkt1;
  }

  let run2 = 0;
  let wkt2 = 0;
  for (let i = 0; i < allVirData?.scoreAwayVirtual?.length; i++) {
    run2 = JSON.parse(allVirData?.scoreAwayVirtual[i].Run) + run2;
    wkt2 = JSON.parse(allVirData?.scoreAwayVirtual[i].Wkt) + wkt2;
  }

  let timer;
  if (allVirData?.timers) {
    if (JSON.parse(allVirData?.timers) <= 180) {
      timer = 0;
    } else {
      timer = JSON.parse(allVirData?.timers) - 180;
    }
  }

  let image2;
  if (allVirData?.Team2id == 1) {
    image2 = require(`../../assets/images/team/1.png`);
  } else if (allVirData?.Team2id == 2) {
    image2 = require(`../../assets/images/team/2.png`);
  } else if (allVirData?.Team2id == 3) {
    image2 = require(`../../assets/images/team/3.png`);
  } else if (allVirData?.Team2id == 4) {
    image2 = require(`../../assets/images/team/4.png`);
  } else if (allVirData?.Team2id == 5) {
    image2 = require(`../../assets/images/team/5.png`);
  } else if (allVirData?.Team2id == 6) {
    image2 = require(`../../assets/images/team/6.png`);
  } else if (allVirData?.Team2id == 7) {
    image2 = require(`../../assets/images/team/7.png`);
  } else if (allVirData?.Team2id == 8) {
    image2 = require(`../../assets/images/team/8.png`);
  }

  let image1;
  if (allVirData?.Team1id == 1) {
    image1 = require(`../../assets/images/team/1.png`);
  } else if (allVirData?.Team1id == 2) {
    image1 = require(`../../assets/images/team/2.png`);
  } else if (allVirData?.Team1id == 3) {
    image1 = require(`../../assets/images/team/3.png`);
  } else if (allVirData?.Team1id == 4) {
    image1 = require(`../../assets/images/team/4.png`);
  } else if (allVirData?.Team1id == 5) {
    image1 = require(`../../assets/images/team/5.png`);
  } else if (allVirData?.Team1id == 6) {
    image1 = require(`../../assets/images/team/6.png`);
  } else if (allVirData?.Team1id == 7) {
    image1 = require(`../../assets/images/team/7.png`);
  } else if (allVirData?.Team1id == 8) {
    image1 = require(`../../assets/images/team/8.png`);
  }

  function setCounting() {
    let all = count - 1;
    if (all > 0) {
      dispatch({
        type: "COUNT",
        payload: all,
      });
    }
  }

  if (loading && placeType === "bet") {
    setTimeout(() => {
      setCounting();
    }, 1000);
  }

  return (
    <View style={styles.mainView}>
      {isFocused && (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.mainScrollView}
          keyboardShouldPersistTaps="always"
        >
          <View style={styles.bettingBoardView}>
            <View style={styles.iframeScoreCardView}>
              <WebView
                source={{
                  uri: "https://kushubmedia.com/cricket/cricket.html",
                }}
                nestedScrollEnabled
                androidHardwareAccelerationDisabled={true}
                automaticallyAdjustContentInsets={true}
                scrollEnabled={false}
                startInLoadingState={true}
                style={{
                  height: 210,
                  backgroundColor: "#151C26",
                  opacity: 0.99,
                }}
              />
            </View>

            {allVirData != null && (
              <View style={styles.displayScoreView}>
                <View style={styles.displayTeamScoreView}>
                  <View style={styles.displayteamLogoView}>
                    <Image
                      style={styles.image}
                      source={image1}
                      resizeMode="contain"
                    />
                    <Text style={styles.displayteamNameText}>
                      {allVirData?.runners[0].runnerName}
                    </Text>
                  </View>
                  <View style={styles.displayteamTotalScoreView}>
                    <View style={styles.displayTeam1TotalScoreView}>
                      <Text style={styles.displayteam1TotalScoreText}>
                        {run1}/{wkt1}
                      </Text>
                    </View>
                  </View>

                  {allVirData?.scoreHomeVirtual?.length > 0 ? (
                    <View style={styles.displayScoreBoardView}>
                      {allVirData?.scoreHomeVirtual.map((item) => {
                        return (
                          <View
                            style={
                              item.Wkt != 1
                                ? styles.displayScoreBoardRunView
                                : styles.displayScoreBoardWicketView
                            }
                            key={item.id}
                          >
                            <Text style={styles.displayScoreBoardRunText}>
                              {item.Wkt != 1 ? item.Run : "W"}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  ) : null}
                </View>

                {timer > 0 && (
                  <View style={styles.displayTimerView}>
                    <View style={styles.displayTimerInnerView}>
                      <Text style={styles.displaytimerText}>{timer}</Text>
                    </View>
                  </View>
                )}

                <View style={styles.displayTeamScoreView}>
                  <View style={styles.displayteamLogoView}>
                    <Image
                      style={styles.image}
                      source={image2}
                      // resizeMode="contain"
                    />
                    <Text style={styles.displayteamNameText}>
                      {allVirData?.runners[1].runnerName}
                    </Text>
                  </View>
                  <View style={styles.displayteamTotalScoreView}>
                    <View style={styles.displayTeam2TotalScoreView}>
                      <Text style={styles.displayteam2TotalScoreText}>
                        {run2}/{wkt2}
                      </Text>
                    </View>
                  </View>

                  {allVirData?.scoreAwayVirtual.length > 0 ? (
                    <View style={styles.displayScoreBoardView}>
                      {allVirData?.scoreAwayVirtual.map((item) => {
                        return (
                          <View
                            style={
                              item.Wkt != 1
                                ? styles.displayScoreBoardRunView
                                : styles.displayScoreBoardWicketView
                            }
                            key={item.id}
                          >
                            <Text style={styles.displayScoreBoardRunText}>
                              {item.Wkt != 1 ? item.Run : "W"}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  ) : null}
                </View>
              </View>
            )}
          </View>

          <View style={styles.scoreCardButtonView}>
            <TouchableOpacity
              style={[
                styles.scoreCardInvestButton,
                { backgroundColor: "#DAA520" },
              ]}
            >
              <Text style={[styles.investButtonText, { color: "#212A37" }]}>
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.scoreCardInvestButton,
                { backgroundColor: "#212A37" },
              ]}
              onPress={() => {
                dispatch({
                  type: "MODALVISIBLE",
                  payload: true,
                });
                dispatch({
                  type: "MODALTYPE",
                  payload: "allbet",
                });
              }}
            >
              <Text style={[styles.investButtonText, { color: "#fff" }]}>
                Active {allBetData.length > 1 ? "Bets" : "Bet"}{" "}
                {`(${allBetData.length})`}
              </Text>
            </TouchableOpacity>
          </View>

          {allVirData?.marketBook?.runners.length > 0 && (
            <View style={styles.bettingCardView}>
              <View style={{ marginBottom: 3 }}>
                <Text style={styles.bettingCardText}>
                  Who will win the Match?
                </Text>
              </View>

              <BettingYesCard data={allVirData} allBetData={allBetData} />
            </View>
          )}

          <View style={styles.lastResultCont}>
            <Text style={styles.lastResultHead}>Last Result</Text>
            <View style={styles.lastResultMainBox}>
              {virtualResult.map((a) => {
                return (
                  <View style={styles.lastResultBox} key={a._id}>
                    <Text style={styles.lastResultText}>{a.Result}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {modalVisibleOdds && !loading && (
            <ConfirmBookmakerModal
              modalVisible={modalVisibleOdds}
              betDataType={betDataTypeOdds}
              betType={betTypeOdds}
              betAllData={betAllDataOdds}
              allData={oddsMarket}
            />
          )}

          {modalVisible && (
            <LiveBetModal
              modalVisible={modalVisible}
              setModalVisible={() =>
                dispatch({
                  type: "MODALVISIBLE",
                  payload: false,
                })
              }
              allBetData={allBetData}
              eventId={"1234822733"}
            />
          )}
        </ScrollView>
      )}

      {(loading || allVirData === null) && (
        <View style={styles.loadingStyles}>
          {placeType === "bet" ? (
            <Text
              style={{ fontSize: 50, fontWeight: "bold", color: "#DAA520" }}
            >
              {count}
            </Text>
          ) : (
            <ActivityIndicator size={"large"} color={"#DAA520"} />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },

  mainScrollView: {},

  bettingBoardView: {
    marginBottom: 5,
  },

  matchCountryHolder: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#000",
  },

  matchCountryText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },

  // Score Board Style..
  displayScoreView: {
    flexDirection: "row",
    paddingVertical: 10,
    backgroundColor: "#000",
  },

  displayTeamScoreView: {
    flex: 1,
  },

  displayTimerView: {
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  displayTimerInnerView: {
    backgroundColor: "#fff",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 40 / 2,
    borderLeftColor: "#1da1f2",
    borderTopColor: "#1da1f2",
    borderBottomColor: "#fd455f",
    borderRightColor: "#fd455f",
  },

  displaytimerText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#000",
  },

  displayteamLogoView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },

  image: {
    height: 30,
    width: 30,
  },

  displayteamNameText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
    marginLeft: 10,
  },

  displayteamTotalScoreView: {
    marginVertical: 5,
    alignItems: "center",
  },

  displayTeam2TotalScoreView: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#fd455f",
    backgroundColor: "#ffecef",
  },

  displayTeam1TotalScoreView: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#1da1f2",
    backgroundColor: "#e8f6fe",
  },

  displayteam2TotalScoreText: {
    color: "#fd455f",
    fontSize: 16,
  },

  displayteam1TotalScoreText: {
    color: "#1da1f2",
    fontSize: 16,
  },

  displayScoreBoardView: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 5,
  },

  displayScoreBoardRunView: {
    marginHorizontal: 2,
    width: 15,
    height: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15 / 2,
    backgroundColor: "#b4fa73",
  },

  displayScoreBoardWicketView: {
    marginHorizontal: 2,
    width: 15,
    height: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15 / 2,
    backgroundColor: "#e3142d",
  },

  displayScoreBoardRunText: {
    fontSize: 10,
    color: "#000",
  },

  displayScoreBoardWicketText: {
    fontSize: 10,
    color: "#fff",
  },
  bettingCardView: {
    marginHorizontal: 7,
    marginBottom: 7,
    backgroundColor: "#1e252e",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 11,
    borderWidth: 0.2,
    borderColor: "#fff",
  },
  bettingCardText: {
    color: "#DAA520",
    fontSize: 14,
    fontWeight: "500",
  },
  scoreCardButtonView: {
    flexDirection: "row",
    marginVertical: 8,
    marginHorizontal: 5,
  },
  scoreCardInvestButton: {
    flex: 1,
    height: 35,
    marginHorizontal: 4,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  investButtonText: {
    color: "#212A37",
    fontSize: 12,
    fontWeight: "400",
  },
  lastResultCont: {
    flex: 1,
    margin: 5,
  },
  lastResultHead: {
    backgroundColor: "#DAA520",
    marginHorizontal: 5,
    borderRadius: 5,
    borderColor: "#DAA520",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: 8,
    fontWeight: "500",
    fontSize: 16,
    color: "#fff",
  },
  lastResultMainBox: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  lastResultBox: {
    width: "33%",
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  lastResultText: {
    fontSize: 13,
    color: "#fff",
  },
  loadingStyles: {
    flex: 1,
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LiveBetting;

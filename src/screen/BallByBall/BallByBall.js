import React, { useEffect, useLayoutEffect, useContext, useRef } from "react";
import {View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, RefreshControl, TouchableOpacity, ImageBackground, Dimensions, Animated,} from "react-native";
import { WebView } from "react-native-webview";
import Toast from "react-native-toast-message";
import { batch, useDispatch, useSelector } from "react-redux";
import { AuthContext } from "../../store/auth-context";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Socket } from "../../util/socket";
import BallByBallCard from "../../component/UI/BallByBallCard";
import ConfirmBookmakerModal from "../../component/UI/ConfirmBookmakerModal";
import LiveBetModal from "../../component/UI/LiveBetModal";
import { GetUserDetail, GetUserSetting } from "../../util/http";
import BallByBallResultModal from "../../component/UI/BallByBallResultModal";
const {width: windowWidth} = Dimensions.get("window");

const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};

const BallByBall = () => {
    const dispatch = useDispatch();
    const authCtx = useContext(AuthContext);
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const ballByBallEventId = '1122334455';
    let mTimer = 0;
    const {
        allbbbData,
        allBetData,
        loading,
        refreshing,
        modalVisible,
        modalVisibleOdds,
        betDataTypeOdds,
        betTypeOdds,
        betAllDataOdds,
        oddsMarket,
        bbbResult,
        bbbResultModal,
        count,
        placeType,
    } = useSelector((state) => state.liveBet);
    

    useEffect(() => {
        if (authCtx.token === null || authCtx.token === undefined) {
            navigation.navigate("Home");
        }
    }, [authCtx]);

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

    const logoutListen = (...args) => {
        authCtx.logout();
    };

    const handleBetsSuccess = (...args) => {
        let allBets = args[0].filter((item) => {
          return item.eventId == ballByBallEventId;
        });
        dispatch({
          type: "ALLBETDATA",
          payload: allBets,
        });
    };

    const placeBetSuccess = (...args) => {
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
        if (args[0]?.bet?.eventTypeId === "b9") {
          Toast.show({
            type: "success",
            text1: "Bet Success",
            text2: `Your bet has been placed successfully.😊`,
          });
        }
        getUserBalance();
        getBetsAndResult();
        
    };

    const placeBetError = (...args) => {
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

    const disconnectEmit = () => {
        if (authCtx.token != null && authCtx.token != undefined) {
            const token = JSON.parse(authCtx.token);
            let data = {
                token: token.verifytoken,
                eventId: ballByBallEventId,
            };
            Socket.emit("add-to-room-ballbyball", data);
        }
    };

    const handleBBBPulse = (...args) => {
        dispatch({
            type: "ALLBBBDATA",
            payload: args[0],
        });
    };

    const editStakeSuccess = (...args) => {
        Toast.show({
          type: "success",
          text1: "Stake Updated Successfully",
        });
    };

    const handleResultSuccess = (...args) => {
        dispatch({
            type: "BBBRESULT",
            payload: args[0],
        });
    };

    useEffect(() => {
        if(isFocused) {
            Socket.on("logout", logoutListen);
            Socket.on("get-bets-success", handleBetsSuccess);
            Socket.on("place-bet-success", placeBetSuccess);
            Socket.on("place-bet-error", placeBetError);
            Socket.on("disconnect", disconnectEmit);
            Socket.on(`ballbyball-pulse-${ballByBallEventId}`, handleBBBPulse);
            Socket.on("edit-stake-success", editStakeSuccess);
            Socket.on(`get-ballbyball-result-success`, handleResultSuccess);
        }

        return () => {
            removeFromRoom();
            Socket.off(`ballbyball-pulse-${ballByBallEventId}`, handleBBBPulse);
            Socket.off("get-bets-success", handleBetsSuccess);
            Socket.off("logout", logoutListen);
            Socket.off("place-bet-success", placeBetSuccess);
            Socket.off("place-bet-error", placeBetError);
            Socket.off("edit-stake-success", editStakeSuccess);
            Socket.off("disconnect", disconnectEmit);
            Socket.off(`get-ballbyball-result-success`, handleResultSuccess);
        }
    }, [isFocused, Socket]);


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
                    eventId: ballByBallEventId,
                };
                Socket.emit("add-to-room-ballbyball", data);
        
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
                        eventId: ballByBallEventId,
                        username: token.details.username,
                        deleted: false,
                        result: "ACTIVE",
                    },
                    sort: { placedTime: -1 },
                };
                Socket.emit("get-bets", betData);
                Socket.emit("get-ballbyball-result", betData);
            }
        }
    }, [isFocused]);

    const removeFromRoom = () => {
        if(authCtx.token != null && authCtx.token != undefined) {
            const token = JSON.parse(authCtx.token);
            const data = {
                user: {
                    _id: token._id,
                    key: token.key,
                    details: {
                        username: token.details.username,
                        role: token.details.role,
                        status: token.details.status,
                    },
                },
                eventId: ballByBallEventId,
            };
            Socket.emit("remove-from-room-ballbyball", data)
        }
    }

    const addToRoom = () => {
        if(authCtx.token != null && authCtx.token != undefined){
            const userData = JSON.parse(authCtx.token);
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
                eventId: ballByBallEventId,
            };
            Socket.emit("add-to-room-ballbyball", data);
        }
    };

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
                    eventId: ballByBallEventId,
                    username: userData.details.username,
                    deleted: false,
                    result: "ACTIVE",
                },
                sort: { placedTime: -1 },
            };
            Socket.emit("get-bets", betData);
            Socket.emit("get-ballbyball-result", betData);
        }
    }

    const restart = async () => {
        getUserBalance();
        addToRoom();
        getBetsAndResult();
    };

    useEffect(() => {
        if(isFocused && authCtx.token) {
          const FetchUserSetting = async() => {
            const token = JSON.parse(authCtx.token);
            const data = {
              eventTypeId: "b9",
              user_id: token?.details?._id,
            }
    
            const response = await GetUserSetting(data);
            if(response?.success == true) {
              dispatch({
                type: "BBBTIME",
                payload: parseInt(response?.response?.data?.betDelay),
              });
            }
          }
    
          FetchUserSetting();
        }
    }, [authCtx, isFocused])


    const scaleAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;
    useEffect(() => {
        if (allbbbData?.ballrun) {
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 750,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 750,
                    useNativeDriver: true,
                }),
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                // Reset the animation after it completes
                scaleAnim.setValue(0);
                opacityAnim.setValue(0);
            });
        }
    }, [allbbbData?.ballrun]);

    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '30deg'], // Change as needed
    });

    function isValidUrl(videoUrl) {
        try {
            const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
            return urlRegex.test(videoUrl);
        }catch (_) {
            return false;
        }
    }

    if (allbbbData?.timers <= 25) {
        mTimer = 0;
    } else {
        mTimer = allbbbData?.timers - 25;
    }

    const showResultModal = (data) => {
        dispatch({
            type: "BBBRESULTMODAL",
            payload: true,
        });
        dispatch({
            type: "BBBSINGLERESULT",
            payload: data,
        })
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
        <>
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
                                {isValidUrl(allbbbData?.ballvideo)?
                                    <WebView
                                        source={{uri: allbbbData?.ballvideo}}
                                        nestedScrollEnabled
                                        androidHardwareAccelerationDisabled={true}
                                        automaticallyAdjustContentInsets={true}
                                        scrollEnabled={false}
                                        startInLoadingState={true}
                                        style={styles.webViewStyles}
                                    />
                                    :
                                    <ImageBackground
                                        source={require('../../assets/images/sports/ball_by_ball_banner.jpg')}
                                        style={styles.webViewStyles}
                                    >
                                        <Text style={styles.timerText}>{mTimer>0? `00:${mTimer}` : null}</Text>
                                        <View style={styles.animationContainer}>
                                            <Animated.View
                                                style={[ styles.animatedView,
                                                {
                                                    transform: [
                                                    { scale: scaleAnim },
                                                    { rotate: rotateInterpolate },
                                                    ],
                                                    opacity: opacityAnim,
                                                },
                                                ]}
                                            >
                                                <Text style={styles.animatedText}>{allbbbData?.ballrun}</Text>
                                            </Animated.View>
                                        </View>
                                    </ImageBackground>
                                }
                            </View>
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
                                style={[styles.scoreCardInvestButton, { backgroundColor: "#212A37" },]}
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

                        {(allbbbData?.marketBook?.runners.length > 0 || allbbbData?.runners.length > 0)&&
                            <View style={styles.bettingCardView}>
                                <View style={{ marginBottom: 3 }}>
                                    <Text style={styles.bettingCardText}>
                                        What will happen on the next Ball?
                                    </Text>
                                </View>
                                <BallByBallCard data={allbbbData} allBetData={allBetData} />
                        </View>
                        }

                        <View style={styles.lastResultCont}>
                            <Text style={styles.lastResultHead}>Last Result</Text>
                            <View style={styles.lastResultMainBox}>
                                {bbbResult.map((a) => {
                                    return (
                                        <TouchableOpacity 
                                            key={a._id}
                                            style={styles.lastResultBox}
                                            onPress={()=>{showResultModal(a);}}
                                        >
                                            <Text style={styles.lastResultText}>{a.Result}</Text>
                                        </TouchableOpacity>
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
                                eventId={ballByBallEventId}
                            />
                        )}

                        {bbbResultModal && (
                            <BallByBallResultModal />
                        )}
                    </ScrollView>
                )}
            </View>

            {(loading || allbbbData === null) && (
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
        </>
    )
}

export default BallByBall;

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
    },
    mainScrollView: {},
    bettingBoardView: {
        marginBottom: 5,
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
        justifyContent: 'center'
    },
    lastResultBox: {
        width: 35,
        height: 35,
        margin: 5,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    lastResultText: {
        fontSize: 13,
        color: "#000",
    },
    webViewStyles: {
        height: windowWidth *0.60,
        backgroundColor: "#151C26",
        opacity: 0.99,
    },
    timerText: {
        textAlign: 'center',
        fontSize: 28,
        fontWeight: "600",
        color: '#fff',
        marginTop: 10,
    },
    animationContainer: {
        position: 'absolute',
        top: '0%',
        left: '0%',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    animatedView: {
        backgroundColor: '#4caf50',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 75,
        width: 75,
    },
    animatedText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        textTransform: 'capitalize',
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
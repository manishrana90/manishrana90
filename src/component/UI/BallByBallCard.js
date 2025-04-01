import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Icon from "react-native-vector-icons//Ionicons";
import { useDispatch } from 'react-redux';
import { profitCalculate } from '../../util/profitCalculate';
import BackComponent from './BackComponent';
import LayComponent from './LayComponent';


const BallByBallCard = (props) => {
    const dispatch = useDispatch();
    const betModalonPress = (
        name, yesRate,
        noRate, betModalType,
        yesPrice, noPrice, selectionId
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
        <View>
            <FlatList
                keyExtractor={(item) => item.selectionId}
                data={props.data?.runners?.length>0? 
                    (props.data?.runners) : 
                    props.data?.marketBook?.runners?.length>0? (props.data?.marketBook?.runners) :
                    []
                }
                renderItem={({item, index}) => {
                    return(
                        <View style={styles.horizontalBettingBar}>
                            <View style={styles.optionBet}>
                                <Text style={[styles.optionText, { flex: 1 }]}>
                                    {item?.runnerName || ''}
                                </Text>
                                <Text
                                    style={[
                                        styles.optionText,
                                        profitCalculate(
                                            props.allBetData,
                                            item?.selectionId,
                                            props.data?.marketId
                                            ) < 0
                                            ? { color: "#FF0000" }
                                            : { color: "#2aa474" },
                                    ]}
                                >
                                    {profitCalculate(
                                        props.allBetData,
                                        item?.selectionId,
                                        props.data?.marketId
                                    ).toFixed(2)}
                                </Text>
                            </View>

                            <View style={[styles.betSelectView, index&1? {marginLeft: 2} : {marginRight: 2}]}>
                                <BackComponent
                                    backPrice={item?.availableToBack?.price}
                                    backRate={item?.availableToBack?.size}
                                    backPress={() => {
                                        if (item?.availableToBack?.price !== 0) {
                                            betModalonPress(
                                                item?.runnerName,
                                                item?.availableToBack?.size,
                                                item?.availableToLay?.size,
                                                "yes",
                                                item?.availableToBack?.price,
                                                item?.availableToLay?.price,
                                                item?.selectionId
                                            );
                                        }
                                    }}
                                />
                            </View>
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
                    );
                }}
                numColumns={2}
            />
        </View>
    )
}

export default BallByBallCard;

const styles = StyleSheet.create({
    horizontalBettingBar: {
        flexDirection: "row",
        marginTop: 5,
        flex: 1,
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
        width: "35%",
        flexDirection: "row",
        // marginLeft: 5,
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
})
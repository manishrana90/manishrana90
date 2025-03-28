import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import Icon from "react-native-vector-icons/FontAwesome";
import { AuthContext } from "../../store/auth-context";
import { Socket } from "../../util/socket";
import { getIpAddress, getDeviceName } from "react-native-device-info";
import { profitCalculate } from "../../util/profitCalculate";
import { calculateBetTotal } from "../../util/calculateBetTotal";

const AmountButton = ({
  item,
  investAmount,
  editStake,
  setInvestAmount,
  setEditStake,
  setStakeValue,
  updateStakeValue,
}) => {
  return (
    <TouchableOpacity
      disabled={item.indexAt != "edit" && editStake}
      style={[
        styles.valueFileButton,

        item.indexAt === "edit" && {
          backgroundColor: editStake ? "#83b9ea" : "#DAA520",
          borderColor: editStake ? "#83b9ea" : "#DAA520",
        },
      ]}
      onPress={() => {
        item.indexAt != "edit"
          ? setInvestAmount(item.amount)
          : editStake
          ? updateStakeValue()
          : setEditStake(!editStake);
      }}
    >
      {item.indexAt != "edit" && editStake ? (
        <TextInput
          style={styles.stakeTextInput}
          placeholder="Enter Value"
          placeholderTextColor="#959CA7"
          value={`${item.amount}`}
          onChangeText={(value) => {
            const numericValue = parseInt(value);
            if (!isNaN(numericValue)) {
              setStakeValue(numericValue);
            } else {
              setStakeValue(0);
            }
          }}
          keyboardType="numeric"
        />
      ) : (
        <Text
          style={[
            styles.valueFillText,
            item.indexAt === "edit" && { color: "#fff" },
          ]}
        >
          {item.indexAt != "edit"
            ? `₹ ${item.amount}`
            : editStake
            ? "Update"
            : "Edit"}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const CashoutModal = ({ modalVisible, allData }) => {
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext);

  const { allStakes, anyOdds } = useSelector((state) => state.liveBet);
  const betType = "No";

  const [betDataType, setBetDataType] = useState();
  const [betAllData, setBetAllData] = useState(null);
  const [investCount, setInvestCount] = useState([]);
  const [investAmount, setInvestAmount] = useState(0);
  const [editStake, setEditStake] = useState(false);

  const [betsProfit, setBetsProfit] = useState({
    first: 0,
    second: 0,
    third: 0,
  });

  if (investCount.length === 0) {
    setInvestCount(allStakes);
  }

  const updateStake = (indexAt, newValue) => {
    const index = investCount.findIndex((item) => item.indexAt === indexAt);

    if (index !== -1) {
      const updatedInvestCount = [...investCount];

      updatedInvestCount[index] = {
        ...updatedInvestCount[index],
        amount: newValue,
      };

      setInvestCount(updatedInvestCount);
    }
  };

  const updateStakeValue = () => {
    dispatch({
      type: "ALLSTAKES",
      payload: investCount,
    });
    const amountsArray = [];

    for (let i = 0; i < investCount.length && amountsArray.length < 9; i++) {
      const item = investCount[i];
      amountsArray.push(item.amount);
    }
    const token = JSON.parse(authCtx.token);
    let stakedata = {
      user: {
        _id: token._id,
        key: token.key,
        details: {
          username: token.details.username,
          role: token.details.role,
          status: token.details.status,
        },
      },
      stake_array: amountsArray,
    };
    Socket.emit("edit-stake", stakedata);

    setEditStake(false);
  };

  useEffect(() => {
    let newBets = [...allData.allBetData];
    let betValue = {};
    let amount = investAmount;

    if (allData.data?.marketBook != undefined) {
      let back1 = newBets.filter((item) => {
        let a = allData.data?.marketBook.runners[0];
        if (a.selectionId != undefined) {
          return item.runnerId == a.selectionId;
        } else {
          return item.runnerId == allData.data?.runners[0].selectionId;
        }
      });
      let back2 = newBets.filter((item) => {
        let a = allData.data?.marketBook.runners[1];
        if (a.selectionId != undefined) {
          return item.runnerId == a.selectionId;
        } else {
          return item.runnerId == allData.data?.runners[1].selectionId;
        }
      });
      let back3 =
        allData.data?.marketBook.runners.length < 3
          ? []
          : newBets.filter((item) => {
              let a = allData.data?.marketBook?.runners[2];
              if (a.selectionId != undefined) {
                return item.runnerId == a.selectionId;
              } else {
                return item.runnerId == allData?.data?.runners[2]?.selectionId;
              }
            });
      let lay1 = newBets.filter((item) => {
        let a = allData.data?.marketBook.runners[0];
        if (a.selectionId != undefined) {
          return item.runnerId != a.selectionId;
        } else {
          return item.runnerId != allData.data?.runners[0].selectionId;
        }
      });
      let lay2 = newBets.filter((item) => {
        let a = allData.data?.marketBook.runners[1];
        if (a.selectionId != undefined) {
          return item.runnerId != a.selectionId;
        } else {
          return item.runnerId != allData.data?.runners[1].selectionId;
        }
      });
      let lay3 =
        allData.data?.marketBook.runners.length < 3
          ? []
          : newBets.filter((item) => {
              let a = allData.data?.marketBook?.runners[2];
              if (a.selectionId != undefined) {
                return item.runnerId != a.selectionId;
              } else {
                return item.runnerId != allData?.data?.runners[2].selectionId;
              }
            });

      betValue =
        allData.data.marketBook.runners[0].availableToLay === undefined
          ? allData.data.runners[0]
          : allData.data.marketBook.runners[0];

      if (
        Math.floor(calculateBetTotal(back1, lay1)) >
          Math.floor(calculateBetTotal(back2, lay2)) &&
        Math.floor(calculateBetTotal(back1, lay1)) >
          Math.floor(calculateBetTotal(back3, lay3))
      ) {
        let value =
          allData.data.marketBook.runners[0].availableToLay === undefined
            ? allData.data.runners[0]
            : allData.data.marketBook.runners[0];
        let layStake =
          (
            calculateBetTotal(back1, lay1) -
            (calculateBetTotal(back2, lay2) > calculateBetTotal(back3, lay3)
              ? calculateBetTotal(back3, lay3)
              : calculateBetTotal(back2, lay2))
          ).toFixed(2) / value?.availableToLay?.price;
        betValue = value;
        amount = Number(layStake).toFixed(0);
      } else if (
        Math.floor(calculateBetTotal(back1, lay1)) <
          Math.floor(calculateBetTotal(back2, lay2)) &&
        Math.floor(calculateBetTotal(back2, lay2)) >
          Math.floor(calculateBetTotal(back3, lay3))
      ) {
        let value =
          allData.data.marketBook.runners[1].availableToLay === undefined
            ? allData.data.runners[1]
            : allData.data.marketBook.runners[1];
        let layStake =
          (
            calculateBetTotal(back2, lay2) -
            (calculateBetTotal(back1, lay1) > calculateBetTotal(back3, lay3)
              ? calculateBetTotal(back3, lay3)
              : calculateBetTotal(back1, lay1))
          ).toFixed(2) / value?.availableToLay?.price;
        betValue = value;
        amount = Number(layStake).toFixed(0);
      } else if (
        Math.floor(calculateBetTotal(back1, lay1)) <
          Math.floor(calculateBetTotal(back3, lay3)) &&
        Math.floor(calculateBetTotal(back2, lay2)) <
          Math.floor(calculateBetTotal(back3, lay3)) &&
        allData.data?.marketBook.runners.length > 2
      ) {
        let value =
          allData.data.marketBook.runners[2].availableToLay === undefined
            ? allData.data.runners[2]
            : allData.data.marketBook.runners[2];
        let layStake =
          (
            calculateBetTotal(back3, lay3) -
            (calculateBetTotal(back2, lay2) > calculateBetTotal(back1, lay1)
              ? calculateBetTotal(back1, lay1)
              : calculateBetTotal(back2, lay2))
          ).toFixed(2) / value?.availableToLay?.price;

        betValue = value;
        amount = Number(layStake).toFixed(0);
      }
    }
    setInvestAmount(investAmount > 0 ? investAmount : parseFloat(amount));
    setBetAllData({
      yesPrice: betValue?.availableToBack?.price,
      noPrice: betValue?.availableToLay?.price,
      marketId: allData.data?.marketId,
      eventId: allData.data?.eventId,
      eventName: allData.data?.eventName,
      marketType: allData.data?.marketType,
    });
    setBetDataType(betValue);

    let currentBet = {
      currentBetId: 18643,
      runnerId: betValue?.selectionId,
      type: betType === "yes" ? "Back" : "Lay",
      marketId: allData.data?.marketId,
      stake: investAmount > 0 ? investAmount : amount,
      rate:
        betType === "yes"
          ? betValue?.availableToBack?.price
          : betValue?.availableToLay?.price,
    };

    const existingBetIndex = newBets.findIndex(
      (bet) => bet.currentBetId === currentBet.currentBetId
    );

    if (existingBetIndex !== -1) {
      newBets[existingBetIndex] = currentBet;
    } else {
      newBets.push(currentBet);
    }

    const marketId = allData.data?.marketId;
    let firstRunner =
      allData.data?.runners[0]?.selectionId !== undefined
        ? allData.data?.runners[0]?.selectionId
        : allData.data?.marketBook?.runners[0]?.selectionId;
    let secondRunner =
      allData.data?.runners[1]?.selectionId !== undefined
        ? allData.data?.runners[1]?.selectionId
        : allData.data?.marketBook?.runners[1]?.selectionId;
    let thirdRunner =
      allData.data?.runners[2]?.selectionId !== undefined
        ? allData.data?.runners[2]?.selectionId
        : allData.data?.marketBook?.runners[2]?.selectionId;

    let bets = {
      first: profitCalculate(newBets, firstRunner, marketId),
      second: profitCalculate(newBets, secondRunner, marketId),
      third: profitCalculate(newBets, thirdRunner, marketId),
    };

    setBetsProfit(bets);
  }, [investAmount]);

  const placeBet = async () => {
    dispatch({
      type: "LOADING",
      payload: true,
    });
    setTimeout(() => {
      dispatch({
        type: "LOADING",
        payload: false,
      });
    }, 5000);

    const deviceName = await getDeviceName();
    const deviceIpAddress = await getIpAddress();

    const token = JSON.parse(authCtx.token);

    let betdata = {
      user: {
        _id: token._id,
        key: token.key,
        details: {
          username: token.details.username,
          role: token.details.role,
          status: token.details.status,
          manager: token.details.manager,
          master: token.details.master,
          subadmin: token.details.subadmin,
          image: token.details.image,
          admin: token.details.admin,
          balance: token.details.balance,
          exposure: token.details.exposure,
        },
      },
      bet: {
        runnerId: betDataType?.selectionId,
        selectionName: betDataType?.runnerName,
        rate: betType === "yes" ? betAllData?.yesPrice : betAllData?.noPrice,
        stake: investAmount,
        marketId: betAllData?.marketId,
        marketName: betAllData?.marketType,
        eventId: betAllData?.eventId,
        eventName: betAllData?.eventName,
        type: betType === "yes" ? "Back" : "Lay",
      },
      device: {
        brand: "brand",
        model: deviceName,
        version: "",
        ip: deviceIpAddress,
      },
    };

    if (anyOdds) {
      betdata.bet.acceptany = 1;
    }

    Socket.emit("create-bet", betdata);
    dispatch({
      type: "MODALCASHOUT",
      payload: false,
    });
  };

  return (
    <Modal
      onRequestClose={() => {
        dispatch({
          type: "MODALCASHOUT",
          payload: false,
        });
      }}
      visible={modalVisible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView1}>
          <View style={styles.modalView}>
            <View style={[styles.modalBox]}>
              <Icon
                name="close"
                color="#fff"
                size={30}
                style={styles.Icon}
                onPress={() => {
                  dispatch({
                    type: "MODALCASHOUT",
                    payload: false,
                  });
                }}
              />
            </View>
          </View>

          <View
            style={[
              styles.textMessageHolder,
              { backgroundColor: betType === "yes" ? "#83b9ea" : "#eeadba" },
            ]}
          >
            <Text style={styles.textMessage}>{betDataType?.runnerName}</Text>
            {betType === "yes" ? (
              <Text style={[styles.textMessage, { color: "#fff" }]}>
                {Number(betAllData?.yesPrice).toFixed(2)}
              </Text>
            ) : (
              <Text style={[styles.textMessage, { color: "#fff" }]}>
                {Number(betAllData?.noPrice).toFixed(2)}
              </Text>
            )}
          </View>

          <View style={styles.investBetHolder}>
            <View style={styles.investView}>
              <View style={styles.totalInvestView}>
                <View style={styles.inputCont}>
                  <Icon name="rupee" color="#000" size={18} />
                  <TextInput
                    style={styles.investTextInput}
                    placeholder="Enter Amount"
                    placeholderTextColor="#959CA7"
                    value={investAmount > 0 ? investAmount.toString() : ""}
                    onChangeText={(value) => {
                      const numericValue = parseFloat(value);
                      if (!isNaN(numericValue)) {
                        setInvestAmount(numericValue);
                      } else {
                        setInvestAmount(0);
                      }
                    }}
                    keyboardType="numeric"
                  />
                </View>
                <TouchableOpacity
                  style={[styles.clearButton]}
                  onPress={() => {
                    setInvestAmount(0);
                  }}
                >
                  <Text style={[styles.valueFillText, { color: "#fff" }]}>
                    Clear
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <FlatList
              data={investCount}
              contentContainerStyle={styles.valueFillContainer}
              renderItem={({ item }) => {
                return (
                  <AmountButton
                    item={item}
                    investAmount={investAmount}
                    editStake={editStake}
                    setInvestAmount={(val) =>
                      setInvestAmount(investAmount + val)
                    }
                    setEditStake={(val) => setEditStake(val)}
                    setStakeValue={(val) => updateStake(item.indexAt, val)}
                    updateStakeValue={() => updateStakeValue()}
                  />
                );
              }}
              keyExtractor={(item) => item.indexAt}
              numColumns={5}
              removeClippedSubviews={true}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={100000}
              windowSize={10}
              persistentScrollbar={true}
            />
          </View>

          <View style={styles.swipeButtonHolder}>
            <TouchableOpacity
              style={[
                styles.pleceBet,
                betType != "yes" && { backgroundColor: "#eeadba" },
              ]}
              onPress={() => placeBet()}
            >
              <Text style={styles.placeBetText}>PLACE BET</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.showBetCont}>
            <View style={styles.showBetView}>
              <Text style={styles.showBetHeading}>
                {allData.data?.runners[0]?.runnerName !== undefined
                  ? allData.data?.runners[0]?.runnerName
                  : allData.data?.marketBook?.runners[0]?.runnerName}
              </Text>
              <Text
                style={[
                  styles.showBetProfit,
                  betsProfit.first < 0 && { color: "#FF0000" },
                ]}
              >
                {Math.round(betsProfit.first)}
              </Text>
            </View>

            <View
              style={[
                styles.showBetView,
                allData.data?.marketBook?.runners.length < 3 &&
                  styles.showLastBetView,
              ]}
            >
              <Text style={styles.showBetHeading}>
                {allData.data?.runners[1]?.runnerName !== undefined
                  ? allData.data?.runners[1]?.runnerName
                  : allData.data?.marketBook?.runners[1]?.runnerName}
              </Text>
              <Text
                style={[
                  styles.showBetProfit,
                  betsProfit.second < 0 && { color: "#FF0000" },
                ]}
              >
                {Math.round(betsProfit.second)}
              </Text>
            </View>

            {allData.data?.marketBook?.runners.length > 2 && (
              <View style={[styles.showBetView, styles.showLastBetView]}>
                <Text style={styles.showBetHeading}>
                  {allData.data?.runners[2]?.runnerName !== undefined
                    ? allData.data?.runners[2]?.runnerName
                    : allData.data?.marketBook?.runners[2]?.runnerName}
                </Text>
                <Text
                  style={[
                    styles.showBetProfit,
                    betsProfit.third < 0 && { color: "#FF0000" },
                  ]}
                >
                  {Math.round(betsProfit.third)}
                </Text>
              </View>
            )}
          </View>

          <View style={{ marginBottom: 50 }}>
            {allData?.data?.marketName === "Match Odds" && (
              <TouchableOpacity
                style={styles.anyOddCont}
                onPress={() => {
                  dispatch({
                    type: "ANYODDS",
                    payload: !anyOdds,
                  });
                }}
              >
                <View style={styles.anyOddView}>
                  <View style={styles.anyOddIcon}>
                    {anyOdds && <Icon name="check" color="#2cc597" size={18} />}
                  </View>
                  <Text style={styles.showBetHeading}>Accept Any Odds</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.balanceVisibleHolder}>
            <Text style={styles.availableBalanceText}>
              Available Balance: ₹ {authCtx.balance.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CashoutModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalView1: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalView: {
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalBox: {
    flexDirection: "row",
    justifyContent: "center",
  },
  Icon: {
    flex: 1,
    marginVertical: 5,
    marginHorizontal: 5,
    position: "absolute",
    top: -50,
    right: 10,
  },
  textMessageHolder: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  textMessage: {
    color: "#121212",
    textAlign: "justify",
    fontSize: 16,
    fontWeight: "600",
  },
  swipeButtonHolder: {
    marginBottom: 8,
    marginHorizontal: 30,
  },
  pleceBet: {
    backgroundColor: "#83b9ea",
    borderRadius: 40,
    paddingVertical: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  placeBetText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  balanceVisibleHolder: {
    width: "100%",
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    backgroundColor: "rgba(240,240,240,255)",
    paddingBottom: 5,
  },
  availableBalanceText: {
    color: "#000",
  },
  investBetHolder: {
    // marginBottom: 5,
  },
  investView: {
    marginHorizontal: 25,
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#a1a1a1",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalInvestView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  inputCont: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // height: 26,
  },
  investText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2aa474",
  },
  investTextInput: {
    // paddingTop: 10,
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    flex: 1,
  },
  valueFillContainer: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
  valueFileButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#959CA7",
    justifyContent: "center",
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginVertical: 5,
    backgroundColor: "#ededed",
    alignItems: "center",
  },
  valueFillText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },

  showBetCont: {
    backgroundColor: "#212A37",
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
    marginHorizontal: 15,
  },
  showBetView: {
    flexDirection: "row",
    paddingBottom: 5,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
  },
  showLastBetView: {
    marginBottom: 0,
    borderBottomWidth: 0,
  },
  showBetHeading: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  showBetProfit: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2aa474",
  },
  stakeTextInput: {
    padding: 0,
    height: 16,
    fontSize: 13,
    fontWeight: "600",
    color: "#000",
  },

  clearButton: {
    marginLeft: 15,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#959CA7",
    justifyContent: "center",
    paddingVertical: 3,
    paddingHorizontal: 12,
    backgroundColor: "#FF0000",
    alignItems: "center",
  },

  anyOddCont: {
    backgroundColor: "#212A37",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 5,
    marginHorizontal: 15,
  },
  anyOddView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  anyOddIcon: {
    backgroundColor: "#fff",
    borderRadius: 3,
    height: 20,
    width: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
});

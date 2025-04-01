import React, { useState, useContext, useLayoutEffect, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  FlatList,
  TextInput,
  Platform,
} from "react-native";
import { batch, useDispatch, useSelector } from "react-redux";

import Icon from "react-native-vector-icons/FontAwesome";
import { AuthContext } from "../../store/auth-context";
import { Socket } from "../../util/socket";
import { getIpAddress, getDeviceName } from "react-native-device-info";

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

const ConfirmVirtualModal = ({
  modalVisible,
  setModalVisible,
  betDataType,
  betAllData,
  setLoading,
}) => {
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext);

  const { allStakes } = useSelector((state) => state.liveBet);

  const [investCount, setInvestCount] = useState([]);
  const [investAmount, setInvestAmount] = useState(0);
  const [editStake, setEditStake] = useState(false);


  useEffect(() => {
    if (modalVisible) {
      const timer = setTimeout(() => {
        setModalVisible(!modalVisible);
      }, 20000);

      return () => clearTimeout(timer);
    }
  }, [modalVisible]);


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

  const placeBet = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
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
        runnerId: betDataType?.noRate,
        selectionName: betDataType?.name,
        rate: betAllData.yesPrice,
        stake: investAmount,
        marketId: betAllData.marketId,
        marketName: betDataType?.name,
        marketType: betAllData.marketType,
        eventId: betAllData.eventId,
        eventName: betAllData.eventName,
        type: "Back",
      },
      device: {
        brand: "brand",
        model: deviceName,
        version: "version",
        ip: deviceIpAddress,
      },
    };

    Socket.emit("create-bet", betdata);
    setModalVisible(!modalVisible);
  };

  return (
    <Modal
      onRequestClose={() => {
        setModalVisible(!modalVisible);
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
                  setModalVisible(!modalVisible);
                }}
              />
            </View>
          </View>

          <View
            style={[styles.textMessageHolder, { backgroundColor: "#83b9ea" }]}
          >
            {betDataType?.name === "DRAW" ? (
              <>
                <Text style={styles.textMessage}>MATCH WILL BE DRAWN?</Text>
                <Text style={[styles.textMessage, { color: "#fff" }]}>
                  11.00
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.textMessage}>
                  {betDataType?.name} WILL WIN?
                </Text>
                <Text style={[styles.textMessage, { color: "#fff" }]}>
                  1.90
                </Text>
              </>
            )}
          </View>

          <View style={styles.investBetHolder}>
            <View style={styles.investView}>
              <View style={styles.totalInvestView}>
                <View style={styles.inputCont}>
                  <Icon
                    name="rupee"
                    color="#000"
                    size={18}
                    // style={styles.Icon}
                  />
                  {/* <Text ellipsizeMode="tail" style={[styles.investText, { fontSize: 14, color: "#000" }]}>₹</Text> */}
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
                {/* <Text style={[styles.investText, { color: "#000" }]}>
                  ₹ {investAmount}
                </Text> */}
              </View>
              <View style={styles.totalInvestView}>
                <Text style={styles.investText}>
                  ₹ {(betDataType?.yesRate * investAmount).toFixed(0)}
                </Text>
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
              persistentScrollbar={true}
            />
          </View>

          <View style={styles.swipeButtonHolder}>
            <TouchableOpacity
              style={styles.pleceBet}
              onPress={() => placeBet()}
            >
              <Text style={styles.placeBetText}>PLACE BET</Text>
            </TouchableOpacity>
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  textMessage: {
    color: "#121212",
    textAlign: "justify",
    fontSize: 15,
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
    // position: "absolute",
    // bottom: 0,
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
    // marginHorizontal: 25,
  },
  inputCont: {
    flexDirection: "row",
    // flex: 1,
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
    paddingVertical: Platform.OS === "android" ? 0 : 10,
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    // flex: 1,
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
    marginBottom: 50,
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
});

export default ConfirmVirtualModal;

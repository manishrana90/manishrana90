// Need to Send

import React, { useContext, useState } from "react";
import {
  View,
  Modal,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-toast-message";
import { Config } from "../../util/config";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../store/auth-context";
import { WithdrawalPayment } from "../../util/http";

const WithdrawalModal = ({
  modalVisible,
  setModalVisible,
  withdrawalMethod,
  setGatewayFilter,
}) => {
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();
  const [isListVisible, setListVisible] = useState(false);
  const [withdrawalItem, setWithdrawalItem] = useState("");
  const [selectUPI, setSelectUPI] = useState("");
  const [withAmount, setWithAmount] = useState("");
  const [withdrawalType, setWithdrawalType] = useState(null);
  const [error, setError] = useState(false);

  const listShowHandler = (value) => {
    if(withAmount<500){
      setError(true);
      return;
    }
    setListVisible(true);
    setWithdrawalItem(value);
    setSelectUPI("");
    // setWithAmount("");
  };

  const onSubmit = async () => {
    const userData = JSON.parse(authCtx.token);
    let data = {
      amount: withAmount,
      managerId: Config.ManagerId,
      managertype: "Subadmin",
      paymentId: selectUPI,
      type: "Wallet",
    };
    const WithdrawalSubmit = await WithdrawalPayment(
      data,
      userData.verifytoken
    );
    // console.log(WithdrawalSubmit);
    if (WithdrawalSubmit.success == true) {
      Toast.show({
        type: "success",
        text1: "Withdrawal Payment",
        text2: `😁Your request to withdrawal of ₹ ${withAmount} has been registered successfully. 😁`,
      });
      setModalVisible(!modalVisible);
      setListVisible(false);
    } else {
      Toast.show({
        type: "error",
        text1: "Withdrawal Payment",
        text2: `${WithdrawalSubmit.message} 😔`,
      });
    }
  };

  const renderWithdrawalItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={[
          styles.methodView,
          withdrawalType === item && { borderWidth: 4 },
        ]}
        onPress={() => {
          setWithdrawalType(item);
        }}
      >
        <Image
          source={{ uri: `${Config.ImageUrl}${item.image}` }}
          style={styles.methodImage}
        />
        <Text style={styles.methodText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderSelectList = ({ item, index }) => {
    return (
      <Pressable
        style={[
          styles.cardListStyle,
          selectUPI === item._id && styles.cardListSelectedStyles,
        ]}
        onPress={() => {
          setSelectUPI(item._id);
        }}
        key={item._id}
      >
        <Text
          style={[
            styles.cardTextStyle,
            selectUPI === item._id && styles.cardTextSelectedStyles,
          ]}
        >
          {item.name} - {item.type === "bank" ? item.bankName : item.upi}
        </Text>
        {selectUPI === item._id && (
          <Icon name="check" size={16} color="#1da1f2" />
        )}
      </Pressable>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
        setListVisible(false);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalBox}>
            <Icon
              name="close"
              color="#fff"
              size={30}
              style={styles.Icon}
              onPress={() => {
                setModalVisible(!modalVisible);
                setListVisible(false);
              }}
            />

            <View style={styles.container}>
              
              <View style={styles.balanceCont}>
                
                <View style={{ flexDirection:'row', justifyContent: 'center', alignItems: 'center'}}>
                  <Icon name="rupee" color="#000" size={18} style={{marginRight: 5,}} />
                  <TextInput
                    style={styles.balanceText}
                    placeholder="Enter Amount"
                    placeholderTextColor={"grey"}
                    keyboardType="numeric"
                    value={withAmount}
                    onChangeText={(value)=>{setError(false); setWithAmount(value)}} /> 
                </View>
                {error && 
                  <Text style={styles.minimumAmountText}>
                    *Minimum Withdrawal Amount is 500
                  </Text>
                }
              </View>
              <View style={styles.header}>
                <Image
                  style={styles.headerIcon}
                  resizeMode="cover"
                  source={require("../../assets/images/deposit/India.png")}
                />
                <View>
                  <Text style={[styles.headtext, { color: "#c2c6d1" }]}>
                    Payment methods for the region
                  </Text>
                  <Text style={styles.headtext}>India (भारत)</Text>
                </View>
              </View>

              {isListVisible ? (
                <>
                  <Pressable
                    style={styles.imageHolderView}
                    onPress={() => {
                      setListVisible(false);
                    }}
                  >
                    <Image
                      source={{
                        uri: `${Config.ImageUrl}${withdrawalItem.image}`,
                      }}
                      style={styles.imagePaymentTypeStyles}
                    />
                  </Pressable>



                  <View style={[styles.methodCont, styles.scrollViewHolder]}>
                    <View style={styles.listShowHolder}>

                      {withdrawalItem?.withdrawns.length > 0 ? (
                        <>
                         <Text style={[styles.minimumAmountText, {color: '#26a1ff', textAlign: 'center'}]}>
                            *Please Select Any Withdrawal Options
                          </Text>
                        <FlatList
                          data={withdrawalItem?.withdrawns}
                          renderItem={renderSelectList}
                          keyExtractor={(item) => item._id}
                        />
                        </>
                      ) : (
                        <>
                          <TouchableOpacity
                            style={styles.pressableSubmitButton}
                            onPress={() => {
                              setModalVisible(!modalVisible);
                              setListVisible(false);
                              setGatewayFilter(withdrawalItem.type);
                            }}
                          >
                            <Text style={styles.pressableText}>
                              Add Withdrawal Method
                            </Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  </View>

                  {withAmount >= 100 && selectUPI.length > 0 && (
                    <TouchableOpacity
                      style={styles.pressableSubmitButton}
                      onPress={() => {
                        onSubmit();
                      }}
                    >
                      <Text style={styles.pressableText}>SUBMIT</Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <>
                  <View style={styles.methodCont}>
                    <Text style={styles.methodHeading}>Select withdrawal methods</Text>
                    <View style={styles.methodInnerCont}>
                      <FlatList
                        data={withdrawalMethod}
                        renderItem={renderWithdrawalItem}
                        keyExtractor={(item) => item._id}
                        numColumns={3}
                      />
                    </View>
                    {withdrawalType != null && (
                      <TouchableOpacity
                        style={styles.pressableSubmitButton}
                        onPress={() => {
                          listShowHandler(withdrawalType);
                        }}
                      >
                        <Text style={styles.pressableText}>SUBMIT</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default WithdrawalModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
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
  container: {
    marginTop: 20,
    width: "100%",
  },
  balanceCont: {
    margin: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    elevation: 20,
  },
  balanceText: {
    color: "#000",
    fontSize: 21,
  },
  header: {
    justifyContent: "flex-start",
    alignItems: "center",
    margin: 10,
    flexDirection: "row",
  },
  headerIcon: {
    height: 30,
    width: 30,
    marginRight: 10,
  },
  headtext: {
    color: "#000",
    fontSize: 13,
    fontWeight: "bold",
  },
  methodCont: {
    margin: 10,
    // backgroundColor: 'orange'
  },
  methodHeading: {
    fontSize: 12,
    color: "#c2c6d1",
    marginLeft: 5,
  },
  methodInnerCont: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  methodView: {
    width: "30%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#c2c6d1",
    // backgroundColor: "#c2c6d1",
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  methodImage: {
    marginVertical: 10,
    height: 50,
    width: 60,
    resizeMode: "contain",
  },
  methodText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },

  // Conditional Rendering..

  scrollViewHolder: {
    maxHeight: 150,
  },

  imageHolderView: {
    // backgroundColor: 'red',
    alignItems: "center",
  },

  imagePaymentTypeStyles: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },

  listShowHolder: {
    // backgroundColor: 'red',
  },

  cardListStyle: {
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e8f6fe",
    borderRadius: 10,
    flexDirection: "row",
  },

  cardListSelectedStyles: {
    backgroundColor: "#e8f6fe",
  },

  cardTextStyle: {
    color: "#000",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },

  cardTextSelectedStyles: {
    color: "#1da1f2",
  },

  withdrawAmountViewHolder: {
    // marginHorizontal: 20,
    // marginVertical: 20,

    marginHorizontal: 20,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: "#e8e8e8",
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
  },

  withAmountInputStyles: {
    // backgroundColor: "#eaedf5",
    // color: "#000",
    // padding: 10,
    // borderRadius: 5,

    flex: 7,
    padding: 0,
    fontSize: 12,
    color: "#2CC597",
    fontWeight: "400",
  },

  minimumAmountText: {
    marginHorizontal: 20,
    color: "red",
    fontSize: 12,
    // marginTop: 5,
  },

  pressableSubmitButton: {
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#62bef6",
    alignItems: "center",
    justifyContent: "center",
  },

  pressableText: {
    fontWeight: "bold",
    color: "#fff",
  },
});

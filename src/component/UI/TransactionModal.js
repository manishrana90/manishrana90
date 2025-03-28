import React, { useContext, useState } from "react";
import {
  View,
  Modal,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Image,
  TextInput,
} from "react-native";
import moment from "moment";
import "moment-timezone";
import { Config } from "../../../config";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const TransactionModal = ({ modalVisible, data, setModalVisible, onCancelWithdraw=()=>{} }) => {
  const [openremarkInput, setOpenremarkInput] = useState(false);
  const [inputs, setInputs] = useState({
    reason: {
      value: '',
      isValid: false,
    }
  })

  const inputHandler = (value) => {
    setInputs({
      reason: {
        value,
        isValid: true,
      }
    });
  }


  const handleWithdrawToggle = () => {
    setOpenremarkInput(!openremarkInput);
    setInputs({
      reason: {
        value: '',
        isValid: true,
      }
    })
  }

  const CancelWithdraw = () => {
    const isReasonValid = inputs.reason.value.trim().length>0;
    if(!isReasonValid) {
      setInputs(curInput => {
        return{
          reason: {
            value: curInput.reason.value,
            isValid: false,
          }
        }
      });
      return;
    }

    const requiredData = {
      remarks: inputs.reason.value,
      id: data._id,
    }

    onCancelWithdraw(requiredData);
    handleWithdrawToggle();
    setModalVisible(false);
  }

  console.log("Data: ", data);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalBox}>
            <View style={styles.container}>
              <View style={styles.hideIconView}>
                <Pressable
                  style={styles.hideIconPress}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Image
                    source={require("../../assets/images/iconPNG/closeIcon.png")}
                    resizeMode="contain"
                    style={styles.hideIconImg}
                    tintColor={"#DAA520"}
                  />
                </Pressable>
              </View>
              <View style={styles.header}>
                <View style={styles.headerImgHolder}>
                  <Image
                    source={Config.logoUrl}
                    resizeMode="contain"
                    style={styles.headerImg}
                  />
                </View>
              </View>
              <View style={styles.dataHead}>
                <Text style={styles.dataHeadText}>
                  {data?.type} {data?.type === "Deposit" ? "to" : "from"}{" "}
                  {data?.to}
                </Text>
                <Text
                  style={[
                    styles.dataHeadTextRight,
                    data?.status === "Approved" && { color: "green" },
                    data?.status === "Decline" && { color: "red" },
                  ]}
                >
                  {data?.status}
                </Text>
              </View>
              <View style={styles.dataCont}>
                <View style={styles.dataContHead}>
                  <Text style={styles.dataContHeadText}>Details</Text>
                </View>
                <View style={styles.dataView}>
                  <Text style={styles.dataText}>Username</Text>
                  <Text style={styles.dataText}>{data?.username}</Text>
                </View>
                <View style={styles.dataView}>
                  <Text style={styles.dataText}>Name</Text>
                  <Text style={styles.dataText}>{data?.name}</Text>
                </View>
                <View style={styles.dataView}>
                  <Text style={styles.dataText}>Coins</Text>
                  <Text style={styles.dataText}>{data?.amount}</Text>
                </View>
                <View style={styles.dataView}>
                  <Text style={styles.dataText}>Payment Type</Text>
                  <Text style={styles.dataText}>{data?.depositId?.paymenttype}</Text>
                </View>
                <View style={styles.dataView}>
                  <Text style={styles.dataText}>Remark</Text>
                  <Text style={styles.dataText}>{data?.remarks}</Text>
                </View>
                {data?.type != "Deposit" && data?.paymentType === "bank" && (
                  <>
                    <View style={styles.dataView}>
                      <Text style={styles.dataText}>Acc Name</Text>
                      <Text style={styles.dataText}>
                        {data?.paymentId?.name}
                      </Text>
                    </View>

                    <View style={styles.dataView}>
                      <Text style={styles.dataText}>Acc No.</Text>
                      <Text style={styles.dataText}>
                        {data?.paymentId?.accnumber}
                      </Text>
                    </View>
                    <View style={styles.dataView}>
                      <Text style={styles.dataText}>IFSC</Text>
                      <Text style={styles.dataText}>
                        {data?.paymentId?.ifsc}
                      </Text>
                    </View>
                  </>
                )}
                {data?.type != "Deposit" && data?.paymentType != "bank" && (
                  <>
                    <View style={styles.dataView}>
                      <Text style={styles.dataText}>Upi</Text>
                      <Text style={styles.dataText}>
                        {data?.paymentId?.upi}
                      </Text>
                    </View>
                  </>
                )}
                <View style={styles.dataView}>
                  <Text style={styles.dataText}>Reference No.</Text>
                  <Text style={styles.dataText}>{data?.refrenceNo}</Text>
                </View>
                <View style={styles.dataView}>
                  <Text style={styles.dataText}>Request Date</Text>
                  <Text style={styles.dataText}>
                    {moment(data?.createdAt).format("D MMM YYYY | hh:mm A")}
                  </Text>
                </View>
                <View style={styles.dataView}>
                  <Text style={styles.dataText}>{data?.status != "Decline" ? "Approved" : "Decline"} Date</Text>
                  <Text style={styles.dataText}>
                    {moment(data?.updatedAt).format("D MMM YYYY | hh:mm A")}
                  </Text>
                </View>
                <View style={styles.dataView}>
                  <Text style={styles.dataText}>{data?.status != "Decline" ? "Approved" : "Decline"} By</Text>
                  <Text style={styles.dataText}>{data?.approvedBy}</Text>
                </View>

                {(data?.type !== "Deposit" && data?.status === 'Pending' && !data?.isCancelled)&&
                  <View style={{marginTop: 10}} >
                    <View style={[styles.dataView, {alignItems: 'center'}]}>
                      <Text style={styles.dataText}>Do you want to cancel Withdraw?</Text>
                      <Pressable 
                        style={styles.cancelBtn}
                        onPress={() => {handleWithdrawToggle();}}
                      >
                        {openremarkInput?  
                          <Icon name="close-circle-outline" size={16} color={'white'} />
                          :
                          <Text style={styles.cancelTxt}>Cancel</Text>
                        }
                      </Pressable>
                    </View>

                    {(openremarkInput)&&
                      <>
                        <View style={styles.inputCont}>
                          <View
                            style={[styles.inputView, { flexDirection: "row" }]}
                          >
                            <TextInput
                              style={[styles.inputText, { flex: 1 }]}
                              placeholder="Reason for Cancellation"
                              placeholderTextColor="#959CA7"
                              value={inputs.reason.value}
                              onChangeText={(value) => {inputHandler(value);}}
                            />
                          </View>
                          {!inputs.reason.isValid && (
                            <Text style={styles.errorText}>
                              Please give reason for Cancel Withdrawal!
                            </Text>
                          )}
                        </View>
                        <Pressable 
                          style={styles.cancelBtn}
                          onPress={() => {CancelWithdraw();}}
                        >
                          <Text style={[styles.cancelTxt, {paddingVertical: 5}]}>Cancel</Text>
                        </Pressable>
                      </>
                    }
                  </View>
                }

              </View>
              {data?.image?.length > 0 && (
                <>
                  <Image
                    source={{
                      uri: `${Config.transactionUrl}${data?.image[0]}`,
                    }}
                    style={{
                      height: 380,
                      width: 270,
                      marginBottom: 20,
                      alignSelf: "center",
                    }}
                    resizeMode="stretch"
                  />
                </>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TransactionModal;

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
    borderRadius: 5,
    overflow: "hidden",
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
    width: "100%",
    backgroundColor: "#151C26",
  },
  hideIconView: {
    alignItems: "flex-end",
    paddingTop: 10,
    paddingRight: 10,
  },
  hideIconPress: {
    width: 30,
    height: 30,
  },
  hideIconImg: {
    width: "100%",
    height: "100%",
    tintColor: "#DAA520"
  },
  header: {
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  headerImgHolder: {
    width: 100,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  headerImg: {
    width: "100%",
    height: "100%",
  },
  dataHead: {
    marginTop: 10,
    marginHorizontal: 20,
    flexDirection: "row",
  },
  dataHeadText: {
    flex: 1,
    color: "#fff",
    fontWeight: "500",
    fontSize: 15,
  },
  dataHeadTextRight: {
    color: "#DAA520",
    fontWeight: "500",
    fontSize: 15,
  },
  dataCont: {
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  dataContHead: {
    borderBottomColor: "#DAA520",
    borderBottomWidth: 2,
    paddingBottom: 4,
    marginBottom: 3,
  },
  dataContHeadText: {
    color: "#000",
    fontWeight: "500",
    fontSize: 14,
  },
  dataView: {
    flexDirection: "row",
    marginTop: 2,
  },
  dataText: {
    flex: 1,
    color: "#000",
    fontWeight: "500",
    fontSize: 13,
  },
  cancelBtn: {
    backgroundColor: '#ff0000',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
  },
  cancelTxt: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 13,
    textAlign: 'center'
  },
  inputCont: {
    marginVertical: 10,
  },
  inputView: {
    backgroundColor: "#F7F7F7",
    borderRadius: 5,
    paddingVertical: Platform.OS === "ios" ? 10 : 0,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  inputText: {
    fontSize: 14,
    padding: 0,
    fontWeight: "600",
    color: "#000",
  },
  errorText: {
    color: "red",
    fontSize: 10,
    fontWeight: "500",
    margin: 4,
  },
});

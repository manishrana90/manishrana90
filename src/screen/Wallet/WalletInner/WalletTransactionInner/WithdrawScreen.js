import React, { useLayoutEffect, useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  Pressable,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import BackIcon from "react-native-vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import WithdrawAccCard from "../../../../component/UI/WithdrawAccCard";
import { Config } from "../../../../../config";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../../../store/auth-context";
import { WithdrawalPayment, WithdrawalMethod } from "../../../../util/http";

import { SwiperFlatList } from "react-native-swiper-flatlist";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const WithdrawScreen = (props) => {
  const { methods } = props.route.params;
  const authCtx = useContext(AuthContext);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const [withdrawalItem, setWithdrawalItem] = useState({});
  const [selectUPI, setSelectUPI] = useState("");
  const [selectType, setSelectType] = useState("");
  const [withAmount, setWithAmount] = useState("");
  const [withdrawalMethod, setWithdrawalMethod] = useState(methods);
  const [withdrawalType, setWithdrawalType] = useState(null);
  const [gatewayData, setGatewayData] = useState(null);
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingAdd, setAddLoading] = useState(false);

  const [error, setError] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);

  const [inputs, setInputs] = useState({
    bankSelect: {
      value: { value: "" },
      isValid: true,
    },
    ifscCode: {
      value: "",
      isValid: true,
    },
    accNumber: {
      value: "",
      isValid: true,
    },
    holderName: {
      value: "",
      isValid: true,
    },
    upiNumber: {
      value: "",
      isValid: true,
    },
    otp: {
      value: "",
      isValid: true,
    },
  });

  useEffect(() => {
    if (authCtx.token === null || authCtx.token === undefined) {
      navigation.navigate("Home");
    }
  }, [authCtx.logout]);

  useLayoutEffect(() => {
    async function PaymentMethodFetch() {
      // console.log('ctx: ', authCtx.token);
      if (isFocused && authCtx.token != null) {
        setLoading(withdrawalMethod.length <= 0 ? true : false);
        // const dataToken = authCtx.walletToken;
        // const token = dataToken.token;

        const userData = JSON.parse(authCtx.token);

        const data = {
          user_id: userData?.details?._id,
        };

        const getwithdrawalMethod = await WithdrawalMethod(data);
        setLoading(false);
        if (getwithdrawalMethod.success == true) {
          setWithdrawalMethod(getwithdrawalMethod.data);
        }
      }
    }
    PaymentMethodFetch();

    const userData = JSON.parse(authCtx.token);
    setMobile(userData?.details.mobile);
  }, [authCtx, isFocused]);

  const listShowHandler = (value) => {
    // if (withAmount < Config.MinWithdrawal) {
    if (withAmount < value?.minLimit || withAmount > value?.maxLimit) {
      setError(true);
      return;
    }

    setWithdrawalItem(value);
    setSelectUPI("");
    setSelectType("");
    setPageIndex(1);
    goToSecondIndex();
  };

  const cancelExecution = () => {
    setPageIndex(0);
    goToFirstIndex();
    setWithAmount("");
    navigation.goBack();
  };

  const setGatewayFilter = (gateway) => {
    setGatewayData(withdrawalMethod.filter((item) => item.type == gateway));
  };

  const onAddWithdrawal = async () => {
    if (authCtx.token != null && authCtx.token != undefined) {
      setLoading(true);
      // const dataToken = authCtx.walletToken;
      // const token = dataToken.token;
      const userData = JSON.parse(authCtx.token);
      const data = {
        user_id: userData?.details?._id,
      };
      const getwithdrawalMethod = await WithdrawalMethod(data);
      setLoading(false);
      if (getwithdrawalMethod.success == true) {
        setWithdrawalMethod(getwithdrawalMethod.data);
      }
    }
  };

  const scrollRef = React.useRef(null);
  const goToLastIndex = () => {
    scrollRef.current.goToLastIndex();
  };
  const goToFirstIndex = () => {
    scrollRef.current.goToFirstIndex();
  };
  const goToSecondIndex = () => {
    scrollRef.current.scrollToIndex({ index: 1 });
  };

  const onSubmit = async () => {
    setAddLoading(true);
    // const userData = authCtx.walletToken;
    const userData = JSON.parse(authCtx.token);
    let data = {
      // managerId: userData.doc.typeId,
      // managertype: userData.doc.type,
      // type: selectType,
      user_id: userData?.details?._id,
      amount: withAmount,
      paymentId: selectUPI,
    };

    const WithdrawalSubmit = await WithdrawalPayment(data);
    setAddLoading(false);
    if (WithdrawalSubmit.success == true) {
      Toast.show({
        type: "success",
        text1: "Withdrawal Payment",
        text2: `😁Your request to withdrawal of ₹ ${withAmount} has been registered successfully. 😁`,
      });

      cancelExecution();
    } else {
      Toast.show({
        type: "error",
        text1: "Withdrawal Payment",
        text2: `${WithdrawalSubmit.message} 😔`,
      });
    }
  };

  const setBalance = (amount) => {
    const userBalance = authCtx.balance;
    if (amount > userBalance) {
      Toast.show({
        type: "error",
        text1: "Withfrawal Payment",
        text2: `You cannot withdrawal amount greater then your balance. 😔`,
      });
      return;
    }
    setError(false);
    setWithAmount(amount);
  };

  const renderWithdrawalItem = ({ item, index }) => {
    return (
      <View style={{flex: 1}}>
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
            // source={{ uri: `${Config.ImageUrl}${item.image}` }}
            source={item.type=='Bank'?
              require('../../../../assets/images/iconPNG/bank.png') :
              item.name=='Gpay'? 
              require('../../../../assets/images/iconPNG/googlePay.png') :
              item.name=='Phonepay'? 
              require('../../../../assets/images/iconPNG/phonePe.png') :
              require('../../../../assets/images/iconPNG/upi.png')
            }
            style={styles.methodImage}
          />
          <Text style={styles.methodText}>{item.name}</Text>
        </TouchableOpacity>

        <View style={styles.minMaxStyles}>
          <View style={styles.innerMinMax}>
            <Text style={[styles.minMaxText, {fontWeight: '600'}]}>Min:  </Text>
            <Text style={styles.minMaxText}>₹ {item?.minLimit}</Text>
          </View>
          <View style={styles.innerMinMax}>
            <Text style={[styles.minMaxText, {fontWeight: '600', textAlign: 'right'}]}>Max:  </Text>
            <Text style={styles.minMaxText}>₹ {item?.maxLimit}</Text>
          </View>
        </View>
      </View>
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
          setSelectType(item.type);
        }}
        key={item._id}
      >
        <Text
          style={[
            styles.cardTextStyle,
            selectUPI === item._id && styles.cardTextSelectedStyles,
          ]}
        >
          {item.name} - {item.type === "Bank" ? item.bankName : item.upi}
        </Text>
        {selectUPI === item._id && (
          <Icon name="check" size={16} color="#1da1f2" />
        )}
      </Pressable>
    );
  };

  const DisplayError = () => {
    return(
      <Text style={styles.minimumAmountText}>
        {withdrawalItem == {} && !withdrawalType ? (
          '*Select Withdrawal Method'
        ) : withAmount > (withdrawalItem?.maxLimit || withdrawalType?.maxLimit) ? (
          `*Maximum Withdrawal Amount is ${withdrawalItem?.maxLimit || withdrawalType?.maxLimit || '500'}`
        ) : withAmount < (withdrawalItem?.minLimit || withdrawalType?.minLimit) ? (
          `*Minimum Withdrawal Amount is ${withdrawalItem?.minLimit || withdrawalType?.minLimit || '500'}`
        ) : (
          `*Minimum Withdrawal Amount is ${withdrawalItem?.minLimit || withdrawalType?.minLimit || '500'}`
        )}
      </Text>
    );
  }

  return (
    <>
      <SwiperFlatList
        autoplay={false}
        autoplayLoop={false}
        ref={scrollRef}
        index={0}
        showPagination={false}
        disableGesture={true}
      >
        <View style={styles.mainView}>
          <View style={styles.modalView}>
            <View style={styles.modalBox}>
              <Icon
                name="close"
                color="#fff"
                size={30}
                style={styles.Icon}
                onPress={() => {
                  cancelExecution();
                }}
              />

              <View style={styles.container}>
                <View style={styles.balanceCont}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Icon
                      name="rupee"
                      color="#000"
                      size={18}
                      style={{ marginRight: 5 }}
                    />
                    <TextInput
                      style={styles.balanceText}
                      placeholder="Enter Amount"
                      placeholderTextColor={"grey"}
                      keyboardType="numeric"
                      value={withAmount}
                      onChangeText={(value) => {
                        setBalance(value);
                      }}
                    />
                  </View>
                  {error && (<DisplayError /> )}
                </View>

                <View style={styles.header}>
                  <Image
                    style={styles.headerIcon}
                    resizeMode="cover"
                    source={require("../../../../assets/images/deposit/India.png")}
                  />
                  <View>
                    <Text style={[styles.headtext, { color: "#c2c6d1" }]}>
                      Payment methods for the region
                    </Text>
                    <Text style={styles.headtext}>India (भारत)</Text>
                  </View>
                </View>

                <View style={styles.methodCont}>
                  <Text style={styles.methodHeading}>
                    Select withdrawal methods
                  </Text>
                  <View style={styles.methodInnerCont}>
                    <FlatList
                      data={withdrawalMethod}
                      renderItem={renderWithdrawalItem}
                      keyExtractor={(item) => item._id}
                      numColumns={2}
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
              </View>
            </View>
          </View>
        </View>

        <View style={styles.mainView}>
          <View style={styles.modalView}>
            <View style={styles.modalBox}>
              <Icon
                name="close"
                color="#fff"
                size={30}
                style={styles.Icon}
                onPress={() => {
                  cancelExecution();
                }}
              />

              <View style={styles.container}>
                <View
                  style={{
                    alignItems: "flex-start",
                    paddingLeft: 20,
                    paddingBottom: 5,
                  }}
                >
                  <BackIcon
                    name="arrow-back"
                    size={20}
                    color="#000"
                    onPress={() => {
                      setPageIndex(0);
                      goToFirstIndex();
                    }}
                  />
                </View>
                <View style={styles.balanceCont}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Icon
                      name="rupee"
                      color="#000"
                      size={18}
                      style={{ marginRight: 5 }}
                    />
                    <TextInput
                      style={styles.balanceText}
                      placeholder="Enter Amount"
                      placeholderTextColor={"grey"}
                      keyboardType="numeric"
                      value={withAmount}
                      onChangeText={(value) => {
                        setBalance(value);
                      }}
                    />
                  </View>
                  {error && (<DisplayError />)}
                </View>

                <View style={styles.header}>
                  <Image
                    style={styles.headerIcon}
                    resizeMode="cover"
                    source={require("../../../../assets/images/deposit/India.png")}
                  />
                  <View>
                    <Text style={[styles.headtext, { color: "#c2c6d1" }]}>
                      Payment methods for the region
                    </Text>
                    <Text style={styles.headtext}>India (भारत)</Text>
                  </View>
                </View>

                <View style={styles.imageHolderView}>
                  <Image
                    source={{
                      uri: `${Config.ImageUrl}${withdrawalItem.image}`,
                    }}
                    style={styles.imagePaymentTypeStyles}
                  />
                </View>

                <View style={[styles.methodCont, styles.scrollViewHolder]}>
                  <View>
                    {pageIndex > 0 && withdrawalItem?.withdrawns.length > 0 ? (
                      <>
                        <Text
                          style={[
                            styles.minimumAmountText,
                            { color: "#26a1ff", textAlign: "center" },
                          ]}
                        >
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
                            setGatewayFilter(withdrawalItem.type);
                            goToLastIndex();
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

                {/* {withAmount >= Config.MinWithdrawal && selectUPI.length > 0 && ( */}
                {withAmount >= withdrawalItem?.minLimit && withAmount <= withdrawalItem?.maxLimit && selectUPI.length > 0 && (
                  <TouchableOpacity
                    style={styles.pressableSubmitButton}
                    onPress={() => {
                      !loadingAdd && onSubmit();
                    }}
                  >
                    {!loadingAdd ? (
                      <Text style={styles.pressableText}>SUBMIT</Text>
                    ) : (
                      <ActivityIndicator size={"small"} color={"#fff"} />
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.mainView}>
          <View style={styles.modalView}>
            <View style={styles.modalBox}>
              <Icon
                name="close"
                color="#fff"
                size={30}
                style={styles.Icon}
                onPress={() => {
                  cancelExecution();
                  setInputs({
                    bankSelect: {
                      value: { value: "" },
                      isValid: true,
                    },
                    ifscCode: {
                      value: "",
                      isValid: true,
                    },
                    accNumber: {
                      value: "",
                      isValid: true,
                    },
                    holderName: {
                      value: "",
                      isValid: true,
                    },
                    upiNumber: {
                      value: "",
                      isValid: true,
                    },
                    otp: {
                      value: "",
                      isValid: true,
                    },
                  });
                }}
              />

              <View style={styles.container}>
                <View
                  style={{
                    alignItems: "flex-start",
                    paddingLeft: 20,
                    paddingBottom: 5,
                  }}
                >
                  <BackIcon
                    name="arrow-back"
                    size={20}
                    color="#000"
                    onPress={() => {
                      setPageIndex(2);
                      goToSecondIndex();
                      setInputs({
                        bankSelect: {
                          value: { value: "" },
                          isValid: true,
                        },
                        ifscCode: {
                          value: "",
                          isValid: true,
                        },
                        accNumber: {
                          value: "",
                          isValid: true,
                        },
                        holderName: {
                          value: "",
                          isValid: true,
                        },
                        upiNumber: {
                          value: "",
                          isValid: true,
                        },
                        otp: {
                          value: "",
                          isValid: true,
                        },
                      });
                    }}
                  />
                </View>
                <View style={styles.balanceCont}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Icon
                      name="rupee"
                      color="#000"
                      size={18}
                      style={{ marginRight: 5 }}
                    />
                    <TextInput
                      style={styles.balanceText}
                      placeholder="Enter Amount"
                      placeholderTextColor={"grey"}
                      keyboardType="numeric"
                      value={withAmount}
                      onChangeText={(value) => {
                        setBalance(value);
                      }}
                    />
                  </View>
                  {error && (<DisplayError />)}
                </View>

                <View style={styles.header}>
                  <Image
                    style={styles.headerIcon}
                    resizeMode="cover"
                    source={require("../../../../assets/images/deposit/India.png")}
                  />
                  <View>
                    <Text style={[styles.headtext, { color: "#c2c6d1" }]}>
                      Payment methods for the region
                    </Text>
                    <Text style={styles.headtext}>India (भारत)</Text>
                  </View>
                </View>

                <>
                  <WithdrawAccCard
                    inputs={inputs}
                    setInputs={setInputs}
                    onAddWithdrawal={() => onAddWithdrawal()}
                    gatewayData={gatewayData != null && gatewayData[0]}
                    cancelExecution={() => cancelExecution()}
                    setPageIndex={(value) => setPageIndex(value)}
                    goToFirstIndex={() => goToFirstIndex()}
                    mobile={mobile}
                  />
                </>
              </View>
            </View>
          </View>
        </View>
      </SwiperFlatList>
      {loading && (
        <View
          style={{
            flex: 1,
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size={"large"} color={"#DAA520"} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  mainView: {
    width: windowWidth,
    height: windowHeight,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalView: {
    width: "90%",
    minHeight: "70%",
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
    marginTop: 15,
    width: "100%",
  },
  balanceCont: {
    marginHorizontal: 20,
    marginBottom: 10,
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
    // width: "30%",
    // flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#c2c6d1",
    marginTop: 10,
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
    marginBottom: 5,
  },
  scrollViewHolder: {
    maxHeight: 150,
  },
  imageHolderView: {
    alignItems: "center",
  },
  imagePaymentTypeStyles: {
    width: 70,
    height: 70,
    resizeMode: "contain",
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
  minimumAmountText: {
    marginHorizontal: 20,
    color: "red",
    fontSize: 12,
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
  minMaxStyles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 2,
    paddingHorizontal: 12,
    flexWrap: 'wrap',
  },
  innerMinMax: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  minMaxText: {
    fontSize: 10,
    color: '#5e5e5e',
  }
});

export default WithdrawScreen;

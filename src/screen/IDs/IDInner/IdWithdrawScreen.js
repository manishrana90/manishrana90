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
import { SwiperFlatList } from "react-native-swiper-flatlist";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import WithdrawAccCard from "../../../component/UI/WithdrawAccCard";
import { Config } from "../../../../config";
import { AuthContext } from "../../../store/auth-context";
import { WithdrawalMethod, WithdrawInsite } from "../../../util/http";
const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const IdWithdrawScreen = (props) => {
  const { withdrawalAmount, methods, mysiteId } = props.route.params;
  const authCtx = useContext(AuthContext);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const [withdrawalItem, setWithdrawalItem] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
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
      if (isFocused && authCtx.token != null && authCtx.walletToken != null) {
        setLoading(withdrawalMethod.length <= 0 ? true : false);
        const dataToken = authCtx.walletToken;
        const token = dataToken.token;

        const getwithdrawalMethod = await WithdrawalMethod(token);
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
    if (withdrawalAmount < Config.MinWithdrawal) {
      setError(true);
      return;
    }

    setWithdrawalItem(value);
    setPageIndex(1);
    goToSecondIndex();
  };

  const cancelExecution = () => {
    setPageIndex(0);
    goToFirstIndex();
    setSelectedOption(null);
    navigation.goBack();
  };

  const setGatewayFilter = (gateway) => {
    setGatewayData(withdrawalMethod.filter((item) => item.type == gateway));
  };

  const onAddWithdrawal = async () => {
    if (authCtx.token != null || authCtx.walletToken != null) {
      setLoading(true);
      const dataToken = authCtx.walletToken;
      const token = dataToken.token;
      const getwithdrawalMethod = await WithdrawalMethod(token);
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
    const userData = authCtx.walletToken;

    const token = userData.token;
    const data = new FormData();
    data.append("managertype", userData.doc.type);
    data.append("managerId", userData.doc.typeId);
    data.append("mysiteId", mysiteId);
    data.append("amount", withdrawalAmount);
    data.append("type", selectedOption.type);
    data.append("paymentId", selectedOption._id);

    const WithdrawalSubmit = await WithdrawInsite(data, token);
    setAddLoading(false);
    if (WithdrawalSubmit.success == true) {
      Toast.show({
        type: "success",
        text1: "Withdrawal Payment",
        text2: `😁Your request to withdrawal of ₹ ${withdrawalAmount} has been registered successfully. 😁`,
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
          selectedOption &&
            selectedOption._id === item._id &&
            styles.cardListSelectedStyles,
        ]}
        onPress={() => {
          setSelectedOption(item);
        }}
        key={item._id}
      >
        <Text
          style={[
            styles.cardTextStyle,
            selectedOption &&
              selectedOption._id === item._id &&
              styles.cardTextSelectedStyles,
          ]}
        >
          {item.name} - {item.type === "bank" ? item.bankName : item.upi}
        </Text>
        {selectedOption && selectedOption._id === item._id && (
          <Icon name="check" size={16} color="#1da1f2" />
        )}
      </Pressable>
    );
  };

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
                      value={withdrawalAmount}
                      editable={false}
                    />
                  </View>
                  {error && (
                    <Text style={styles.minimumAmountText}>
                      *Minimum Withdrawal Amount is {Config.MinWithdrawal}
                    </Text>
                  )}
                </View>

                <View style={styles.header}>
                  <Image
                    style={styles.headerIcon}
                    resizeMode="cover"
                    source={require("../../../assets/images/deposit/India.png")}
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
                  setSelectedOption(null);
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
                      setSelectedOption(null);
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
                      value={withdrawalAmount}
                      editable={false}
                    />
                  </View>
                  {error && (
                    <Text style={styles.minimumAmountText}>
                      *Minimum Withdrawal Amount is {Config.MinWithdrawal}
                    </Text>
                  )}
                </View>

                <View style={styles.header}>
                  <Image
                    style={styles.headerIcon}
                    resizeMode="cover"
                    source={require("../../../assets/images/deposit/India.png")}
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

                {withdrawalAmount >= Config.MinWithdrawal && selectedOption && (
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
                  setSelectedOption(null);
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
                      value={withdrawalAmount}
                      editable={false}
                    />
                  </View>
                  {error && (
                    <Text style={styles.minimumAmountText}>
                      *Minimum Withdrawal Amount is {Config.MinWithdrawal}
                    </Text>
                  )}
                </View>

                <View style={styles.header}>
                  <Image
                    style={styles.headerIcon}
                    resizeMode="cover"
                    source={require("../../../assets/images/deposit/India.png")}
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
    width: "30%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#c2c6d1",
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
});

export default IdWithdrawScreen;

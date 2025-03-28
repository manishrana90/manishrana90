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
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { Config } from "../../../../config.js";
import { AuthContext } from "../../../store/auth-context";
import {
  PaymentMethod,
  DepositPayment,
  CreatesIdAPI,
  DespositInsite,
  WalletToken,
} from "../../../util/http.js";
import PaymentTypeCardUPI, {
  PaymentMethodCardBarCode,
  PaymentMethodCardBank,
  TransactionScreenShotCard,
} from "../../../component/UI/PayMethodCard";
const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const BalanceContainCard = ({
  depAmount,
  setdepAmount,
  error,
  setError,
  minDeposit,
  editable,
}) => {
  return (
    <>
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
            value={depAmount}
            // onChangeText={(value) => {
            //   setdepAmount(value);
            //   setError(false);
            // }}
            editable={editable}
          />
        </View>
        {error && (
          <Text style={styles.minimumAmountText}>
            *Minimum Deposit Amount is {minDeposit}
          </Text>
        )}
      </View>

      <View style={styles.header}>
        <View style={styles.headerInner}>
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
      </View>
    </>
  );
};

const PaymentMethodBox = ({ item, listShowHandler, amount, minDeposit }) => {
  if (item.paymenttype === "razorpay") {
    return;
  }
  return (
    <Pressable
      style={styles.methodView}
      onPress={() => {
        if (amount < minDeposit) {
          Toast.show({
            type: "error",
            text1: "Deposit Payment",
            text2: `Amount cannot be less than ₹ ${minDeposit}. 😔`,
          });
          return;
        }
        listShowHandler(item);
      }}
    >
      <Image
        source={{ uri: `${Config.paymentsImageUrl}${item.image}` }}
        style={styles.methodImage}
      />
      {item.paymenttype == "bank" || item.paymenttype == "barcode" ? (
        <Text style={styles.methodText}>{item.paymenttype.toUpperCase()}</Text>
      ) : (
        <Text style={styles.methodText}>{item.name.toUpperCase()}</Text>
      )}
    </Pressable>
  );
};

const IdDepositScreen = () => {
  const authCtx = useContext(AuthContext);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const route = useRoute();
  const { minDeposit, isCreatingID, depositData } = route.params;

  const [payMethodList, setPayMethodList] = useState([]);
  const [defaultMethodList, setDefaultMethodList] = useState([]);
  const [paymentItem, setPaymentItem] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [depAmount, setdepAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [loadingData, setDataLoading] = useState(false);
  const dummyImage =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Picture_icon_BLACK.svg/1200px-Picture_icon_BLACK.svg.png";
  const [imageFilePath, setImageFilePath] = useState({ uri: dummyImage });

  useEffect(() => {
    if (authCtx.token === null || authCtx.token === undefined) {
      navigation.navigate("Home");
    }
  }, [authCtx.logout]);

  useLayoutEffect(() => {
    async function PaymentMethodFetch() {
      if ((isFocused && authCtx.token != null) || authCtx.walletToken != null) {
        setDataLoading(payMethodList.length <= 0 ? true : false);
        const dataToken = authCtx.walletToken;
        const token = dataToken.token;
        let datatype = {
          type: dataToken.doc.type,
          typeId: dataToken.doc.typeId,
        };

        const getPaymentMethod = await PaymentMethod(datatype, token);
        setDataLoading(false);
        if (getPaymentMethod.success === true) {
          setPayMethodList(getPaymentMethod.doc);
          setDefaultMethodList(getPaymentMethod.doc);
        }
      }
    }

    PaymentMethodFetch();
  }, [authCtx, isFocused, PaymentMethod]);

  const setDepoitAmount = (amount, array) => {
    setdepAmount(amount);
    let dataArray = array != undefined ? array : defaultMethodList;
    function filterPaymentTypeArray(paymentType, amount, name) {
      const anyTrueObjects =
        paymentType === "upi"
          ? dataArray.filter(
              (item) =>
                item.paymenttype === paymentType &&
                item.any === true &&
                item.name === name
            )
          : dataArray.filter(
              (item) => item.paymenttype === paymentType && item.any === true
            );

      if (anyTrueObjects.length > 0) {
        // If there are objects with any true, include all of them
        return anyTrueObjects;
      } else {
        if (paymentType === "bank" || paymentType === "barcode") {
          // For "bank" and "barcode," include objects with any false and amount between minLimit and maxLimit
          return dataArray.filter(
            (item) =>
              item.paymenttype === paymentType &&
              item.any === false &&
              amount >= item.minLimit &&
              amount <= item.maxLimit
          );
        } else if (paymentType === "upi") {
          // For "upi," include objects with any false, matching name, and amount between minLimit and maxLimit
          return dataArray.filter(
            (item) =>
              item.paymenttype === "upi" &&
              item.any === false &&
              item.name === name &&
              amount >= item.minLimit &&
              amount <= item.maxLimit
          );
        } else {
          return []; // Default to an empty array for other payment types
        }
      }
    }

    const array1 = filterPaymentTypeArray("upi", amount, "Google Pay");
    const array2 = filterPaymentTypeArray("upi", amount, "Paytm");
    const array3 = filterPaymentTypeArray("upi", amount, "Phone Pay");
    const array4 = filterPaymentTypeArray("upi", amount, "UPI");
    const array5 = filterPaymentTypeArray("bank", amount);
    const array6 = filterPaymentTypeArray("barcode", amount);

    const mergedArray = [
      ...array1,
      ...array2,
      ...array3,
      ...array4,
      ...array5,
      ...array6,
    ];
    setPayMethodList(mergedArray);
  };

  const listShowHandler = (value) => {
    setPaymentItem(value);
    setPageIndex(1);
    goToSecondIndex();
  };

  const cancelExecution = () => {
    setPageIndex(0);
    goToFirstIndex();
    setdepAmount("");
    setTransactionId("");
    setLoading(false);
    setImageFilePath({ uri: dummyImage });
    setError(false);
    navigation.goBack();
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

  const CreateId = async () => {
    setLoading(true);
    const userData = JSON.parse(authCtx.token);
    const WalletDetail = await WalletToken(userData.details.username);

    if (WalletDetail.success === true) {
      const token = WalletDetail.data?.token;
      const data = new FormData();
      data.append("type", WalletDetail.data.doc.type);
      data.append("typeId", WalletDetail.data.doc.typeId);
      data.append("amount", depositData?.amount);
      data.append("sites", depositData?.mySiteId);
      data.append("username", depositData?.username);
      data.append("paymentType", paymentItem.paymenttype);
      data.append("image", imageFilePath.base64);
      data.append("imagetype", imageFilePath.type);

      const depositRes = await CreatesIdAPI(data, token);
      setLoading(false);
      return depositRes;
    } else {
      return WalletDetail;
    }
  };

  const DepositToId = async () => {
    setLoading(true);
    const userData = JSON.parse(authCtx.token);
    const WalletDetail = await WalletToken(userData.details.username);

    if (WalletDetail.success === true) {
      const token = WalletDetail.data?.token;
      const data = new FormData();
      data.append("type", WalletDetail.data.doc.type);
      data.append("typeId", WalletDetail.data.doc.typeId);
      data.append("amount", depositData?.amount);
      data.append("mysiteId", depositData?.mySiteId);
      data.append("paymentType", paymentItem.paymenttype);
      data.append("image", imageFilePath.base64);
      data.append("imagetype", imageFilePath.type);
      data.append("depositId", paymentItem._id);

      const depositRes = await DespositInsite(data, token);
      setLoading(false);
      return depositRes;
    } else {
      return WalletDetail;
    }
  };

  const onSubmit = async () => {
    const userData = authCtx.walletToken;

    const depositRes = isCreatingID ? await CreateId() : await DepositToId();
    if (depositRes.success === true) {
      Toast.show({
        type: "success",
        text1: "Deposit Payment",
        text2: `😁Your request of deposit ₹ ${depositData?.amount} has been created successfully. 😁`,
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Deposit Payment",
        text2: `${depositRes.message} 😔`,
      });
    }
    cancelExecution();
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
                <BalanceContainCard
                  depAmount={depositData?.amount}
                  setdepAmount={(value) => setDepoitAmount(value)}
                  error={error}
                  setError={setError}
                  minDeposit={minDeposit}
                  editable={false}
                />

                {payMethodList.length > 0 && (
                  <FlatList
                    data={payMethodList}
                    style={styles.methodCont}
                    keyExtractor={(item) => item._id}
                    numColumns={3}
                    renderItem={({ item }) => {
                      return (
                        <PaymentMethodBox
                          item={item}
                          listShowHandler={(value) => listShowHandler(value)}
                          amount={depositData?.amount}
                          minDeposit={minDeposit}
                        />
                      );
                    }}
                  />
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
                <BalanceContainCard
                  depAmount={depositData?.amount}
                  setdepAmount={setdepAmount}
                  error={error}
                  setError={setError}
                  minDeposit={minDeposit}
                  editable={false}
                />
                {paymentItem.paymenttype === "upi" ? (
                  <PaymentTypeCardUPI
                    paymentMethodData={paymentItem}
                    depAmount={depositData?.amount}
                    setError={setError}
                    setPageIndex={(value) => setPageIndex(value)}
                    goToLastIndex={() => goToLastIndex()}
                    minDeposit={minDeposit}
                  />
                ) : paymentItem.paymenttype === "barcode" ? (
                  <PaymentMethodCardBarCode
                    paymentMethodData={paymentItem}
                    depAmount={depositData?.amount}
                    setError={setError}
                    setPageIndex={(value) => setPageIndex(value)}
                    goToLastIndex={() => goToLastIndex()}
                    minDeposit={minDeposit}
                  />
                ) : paymentItem.paymenttype === "bank" ? (
                  <PaymentMethodCardBank
                    paymentMethodData={paymentItem}
                    depAmount={depositData?.amount}
                    setError={setError}
                    setPageIndex={(value) => setPageIndex(value)}
                    goToLastIndex={() => goToLastIndex()}
                    minDeposit={minDeposit}
                  />
                ) : null}
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
                      setPageIndex(1);
                      goToSecondIndex();
                      setImageFilePath({ uri: dummyImage });
                      setLoading(false);
                      setTransactionId("");
                    }}
                  />
                </View>

                <View style={[styles.balanceSection, { flexDirection: "row" }]}>
                  <Text style={styles.totalDepo}>Total Deposit:</Text>
                  <Text
                    style={[
                      styles.totalDepo,
                      { fontSize: 26, fontWeight: "bold", marginLeft: 10 },
                    ]}
                  >
                    ₹ {depositData?.amount}
                  </Text>
                </View>

                <View style={styles.transactionView}>
                  <TextInput
                    style={styles.inputStyles}
                    placeholder="*Transaction ID"
                    autoCapitalize="none"
                    value={transactionId}
                    placeholderTextColor="#616060"
                    onChangeText={(value) => {
                      setTransactionId(value);
                    }}
                  />
                  {transactionId.length <= 0 && (
                    <>
                      <Text style={styles.minimumAmountText}>
                        *Please enter Transaction ID
                      </Text>
                    </>
                  )}
                </View>

                <TransactionScreenShotCard
                  depAmount={depositData?.amount}
                  setdepAmount={setdepAmount}
                  imageFilePath={imageFilePath}
                  setImageFilePath={setImageFilePath}
                  transactionId={transactionId}
                  onSubmit={() => onSubmit()}
                  loading={loading}
                  minDeposit={minDeposit}
                />
              </View>
            </View>
          </View>
        </View>
      </SwiperFlatList>
      {loadingData && (
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
  minimumAmountText: {
    marginHorizontal: 20,
    color: "red",
    fontSize: 12,
  },
  header: {
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 10,
    flexDirection: "row",
  },
  headerInner: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  headerIcon: {
    height: 30,
    width: 30,
    marginRight: 10,
  },
  backIconStyle: {
    marginRight: 10,
  },
  headtext: {
    color: "#000",
    fontSize: 13,
    fontWeight: "bold",
  },
  methodCont: {
    margin: 5,
    height: 350,
    flexGrow: 0,
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
    height: 40,
    width: 40,
    resizeMode: "contain",
    marginVertical: 10,
  },
  methodText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  balanceSection: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  totalDepo: {
    color: "#000",
    fontSize: 14,
    fontWeight: "400",
  },
  inputStyles: {
    marginHorizontal: 10,
    marginVertical: 5,
    backgroundColor: "#e8f6fe",
    borderRadius: 5,
    color: "#000",
    paddingHorizontal: 10,
    fontSize: 16,
  },
  loading: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    opacity: 0.8,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});

export default IdDepositScreen;

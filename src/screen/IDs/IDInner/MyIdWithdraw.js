import React, {
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Ionicon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Config } from "../../../../config";
import { AuthContext } from "../../../store/auth-context";
import {
  WalletToken,
  WithdrawInsite,
  WithdrawalMethod,
} from "../../../util/http";

const MyIdWithdraw = () => {
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();
  const { params } = useRoute();
  const item = params.item;
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [withdrawalMethod, setWithdrawalMethod] = useState([]);
  const [selectedWithdrawtype, setSelectedWithdrawType] = useState("account");
  const [inputs, setinputs] = useState({
    coins: {
      value: "",
      isValid: true,
    },
  });

  useLayoutEffect(() => {
    FetchWithdrawalMethod();
  }, []);

  const FetchWithdrawalMethod = async () => {
    if (!authCtx.token) return;

    const userData = JSON.parse(authCtx.token);
    const WalletDetail = await WalletToken(userData.details.username);
    if (WalletDetail.success === true) {
      const getwithdrawalMethod = await WithdrawalMethod(
        WalletDetail.data.token
      );
      if (getwithdrawalMethod.success == true) {
        setWithdrawalMethod(getwithdrawalMethod.data);
      }
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    FetchWithdrawalMethod();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const onRadioBtnClick = (value) => {
    if (value === "wallet") setSelectedWithdrawType("wallet");
    else if (value === "account") setSelectedWithdrawType("account");
  };

  function inputChangeHandler(inputIdentifier, enteredValue) {
    setinputs((currentInputs) => {
      return {
        ...currentInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true },
      };
    });
  }

  async function WithdrawToWallet(amount) {
    setLoading(true);

    const userData = JSON.parse(authCtx.token);
    const WalletDetail = await WalletToken(userData.details.username);
    if (WalletDetail.success === false) {
      Toast.show({
        type: "error",
        text1: "Failed to Withdraw!",
        text2: WalletDetail.message,
      });
      setLoading(false);
      return;
    }

    const token = WalletDetail.data.token;
    const data = new FormData();
    data.append("managertype", WalletDetail.data.doc.type);
    data.append("managerId", WalletDetail.data.doc.typeId);
    data.append("mysiteId", item._id);
    data.append("amount", amount);
    data.append("type", "wallet");

    const withdrawRes = await WithdrawInsite(data, token);
    if (withdrawRes.success === true) {
      setLoading(false);
      Toast.show({
        type: "success",
        text1: "Withdraw Registered",
        text2: withdrawRes.message,
      });
    } else {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Withdraw Failed",
        text2: withdrawRes.message,
      });
    }
    navigation.goBack();
  }

  function submitHandler() {
    const expenseData = { coins: inputs.coins.value };
    const coinsIsValid = expenseData.coins.trim().length > 0;
    if (!coinsIsValid) {
      setinputs((curInputs) => {
        return {
          coins: {
            value: curInputs.coins.value,
            isValid: coinsIsValid,
          },
        };
      });
      return;
    }

    if (expenseData.coins < Config.MinWithdrawal) {
      Toast.show({
        type: "error",
        text1: "Low Coins!",
        text2: `Minimum Withdraw Coins: ${Config.MinWithdrawal}.`,
      });
      return;
    }

    if (selectedWithdrawtype === "wallet") {
      WithdrawToWallet(expenseData?.coins);
    } else {
      navigation.navigate("IdWithdrawScreen", {
        withdrawalAmount: expenseData.coins,
        methods: withdrawalMethod,
        mysiteId: item._id,
      });
    }
  }

  return (
    <View>
      <View style={styles.headingContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.backButton}
        >
          <Ionicon size={24} color={"#fff"} name={"arrow-back"} />
        </TouchableOpacity>
        <Text style={styles.headingText}>My ID Withdraw</Text>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View>
          <View style={styles.upperboxContainer}>
            <View style={styles.imgContainer}>
              <Image
                source={{ uri: Config.idImageUrl + item.sites.image }}
                resizeMode="cover"
                style={styles.img}
              />
              <View>
                <Text style={styles.idText}>{item.sites.name}</Text>
                <View style={{ paddingVertical: 3 }} />
                <Text style={styles.idTextSmall}>{item.sites.url}</Text>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.iconView}>
                <Image
                  source={require("../../../assets/images/iconPNG/coin-icon.png")}
                  resizeMode="contain"
                  style={styles.iconImg}
                  tintColor={"#DAA520"}
                />
              </View>
              <TextInput
                style={styles.input}
                onChangeText={inputChangeHandler.bind(this, "coins")}
                value={inputs.coins.value}
                placeholder="Withdraw Coin*"
                keyboardType="numeric"
                placeholderTextColor="#A0A0A0"
              />
            </View>
            {!inputs.coins.isValid && (
              <View>
                <Text style={styles.errorText}>Coin Field is required</Text>
              </View>
            )}

            <Text style={[styles.errorText]}>
              Minimum Withdraw Coins {Config.MinWithdrawal}
            </Text>

            {loading === true ? (
              <View style={styles.dropdown}>
                <ActivityIndicator size={30} color="#fbb845" />
              </View>
            ) : (
              <View>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={submitHandler}
                >
                  <Text style={styles.submitText}>Submit</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MyIdWithdraw;

const styles = StyleSheet.create({
  headingContainer: {
    marginVertical: 14,
    alignItems: "center",
  },
  headingText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
  imgContainer: {
    flexDirection: "row",
    margin: 8,
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#f2b71a",
    alignItems: "center",
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#fff",
  },
  idText: {
    fontSize: 14,
    marginLeft: 10,
    fontWeight: "bold",
    color: "#fff",
  },
  idTextSmall: {
    fontSize: 11,
    marginLeft: 10,
    fontWeight: "500",
    color: "#FFF380",
  },
  input: {
    flex: 1,
    padding: 0,
    marginLeft: 5,
    borderRadius: 10,
    color: "#151C26",
    fontSize: 14,
    fontWeight: "500",
  },
  errorText: {
    paddingHorizontal: 16,
    color: "red",
    marginBottom: 8,
    fontSize: 11,
  },
  submitButton: {
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 5,
    paddingVertical: 10,
    backgroundColor: "#DAA520",
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  upperboxContainer: {
    backgroundColor: "#2a2d3c",
    borderRadius: 8,
    marginHorizontal: 6,
    paddingVertical: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 6,
    backgroundColor: "#fff",
    marginHorizontal: 15,
    borderRadius: 5,
    padding: 9,
  },
  iconView: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconImg: {
    width: 16,
    height: 16,
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

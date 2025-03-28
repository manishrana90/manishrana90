import React, {
  useContext,
  useLayoutEffect,
  useState,
  useCallback,
} from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  RefreshControl,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import Ionicon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from "@react-navigation/native";
import CheckBox from "../../../component/UI/CustomCheckbox";
import { WalletToken, DespositInsite } from "../../../util/http";
import { AuthContext } from "../../../store/auth-context";
import { Config } from "../../../../config";

const MyIdDeposit = () => {
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();
  const { params } = useRoute();
  const { item } = params;
  const [refreshing, setRefreshing] = useState(false);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputs, setinputs] = useState({
    coins: { value: "", isValid: true },
  });

  useLayoutEffect(() => {
    FetchWalletToken();
  }, []);

  const FetchWalletToken = async () => {
    if (authCtx.token != null && authCtx.token != undefined) {
      const walletData = JSON.parse(authCtx.token);
      const WalletDetail = await WalletToken(walletData.details.username);
      if (WalletDetail.success === true) {
        authCtx.setWalletToken(WalletDetail.data);
      }
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    FetchWalletToken();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  function inputChangeHandler(inputIdentifier, enteredValue) {
    setinputs((currentInputs) => {
      return {
        ...currentInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true },
      };
    });
  }

  async function PayfromWallet(amount) {
    setLoading(true);

    let userData = JSON.parse(authCtx.token);
    const WalletDetail = await WalletToken(userData.details.username);
    if (WalletDetail.success === false) {
      Toast.show({
        type: "error",
        text1: "Failed to Deposit!",
        text2: WalletDetail.message,
      });
      setLoading(false);
      return;
    }

    const token = WalletDetail.data.token;
    const data = new FormData();
    data.append("type", WalletDetail.data.doc.type);
    data.append("typeId", WalletDetail.data.doc.typeId);
    data.append("mysiteId", item._id);
    data.append("amount", amount);
    data.append("paymentType", "wallet");
    data.append("image", "");
    data.append("imagetype", "");

    const depositRes = await DespositInsite(data, token);
    // console.log("Deposit Res: ", depositRes)
    if (depositRes.success === true) {
      setLoading(false);
      Toast.show({
        type: "success",
        text1: "Deposit Registered",
        text2: depositRes.message,
      });
    } else {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Deposit Failed",
        text2: depositRes.message,
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

    if (expenseData.coins < Config.MinDeposit) {
      Toast.show({
        type: "error",
        text1: "Low Coins!",
        text2: `Minimum Deposit Coins: ${Config.MinDeposit}.`,
      });
      return;
    }

    if (checked) {
      PayfromWallet(expenseData.coins);
    } else {
      const depositData = {
        mySiteId: item._id,
        username: "",
        amount: expenseData.coins,
      };

      navigation.navigate("IdDepositScreen", {
        minDeposit: Config.MinDeposit,
        isCreatingID: false,
        depositData: depositData,
      });
    }
  }

  return (
    <View>
      <View style={styles.headingContainer}>
      <TouchableOpacity
                    onPress={() => {navigation.goBack();}}
                    style={styles.backButton}
                >
                    <Ionicon size={24} color={'#fff'} name={'arrow-back'} />
                </TouchableOpacity>
        <Text style={styles.headingText}>My ID Deposit</Text>
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

            <View>
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
                  placeholder="Deposit Coin*"
                  placeholderTextColor="#A0A0A0"
                  keyboardType="numeric"
                />
              </View>
              {!inputs.coins.isValid && (
                <Text style={styles.errorText}>Coin Field is required</Text>
              )}
            </View>

            <Text style={[styles.errorText, { marginBottom: 0 }]}>
              Minimum Deposit Coins {Config.MinDeposit}
            </Text>
            <View style={{ padding: 12 }}>
              <CheckBox
                onPress={() => setChecked(!checked)}
                title={"Pay From Wallet"}
                isChecked={checked}
              />
            </View>

            {loading ? (
              <View style={styles.dropdown}>
                <ActivityIndicator size={30} color="#fbb845" />
              </View>
            ) : (
              <TouchableOpacity
                onPress={submitHandler}
                style={styles.submitButton}
              >
                <Text style={styles.submitText}>Submit</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MyIdDeposit;

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
  containers: {
    flex: 1,
    flexDirection: "row",
    overflow: "hidden",
    padding: 16,
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#fff",
  },
  idText: {
    color: "#fff",
    marginHorizontal: 8,
    textAlign: "center",
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
  deposit: {
    padding: 16,
    color: "#fff",
  },
  checkbox: {
    alignSelf: "center",
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
    position: 'absolute',
    left: 10,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
}
});

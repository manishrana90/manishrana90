import React, {
  useContext,
  useState,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  RefreshControl,
} from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";
import { Config } from "../../../../config";
import CheckBox from "../../../component/UI/CustomCheckbox";
import { AuthContext } from "../../../store/auth-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { CreatesIdAPI, WalletToken } from "../../../util/http";
import Toast from "react-native-toast-message";

const CreateWalletID = () => {
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();
  const { params } = useRoute();
  const item = params?.item;
  const [refreshing, setRefreshing] = useState(false);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputs, setinputs] = useState({
    username: { value: "", isValid: true },
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

  const submitHandler = async () => {
    const expenseData = {
      username: inputs.username.value,
      coins: inputs.coins.value,
    };
    const usernameIsValid = expenseData.username.trim().length > 0;
    const coinsIsValid = expenseData.coins.trim().length > 0;

    if (!usernameIsValid || !coinsIsValid) {
      setinputs((curInputs) => {
        return {
          username: {
            value: curInputs.username.value,
            isValid: usernameIsValid,
          },
          coins: { value: curInputs.coins.value, isValid: coinsIsValid },
        };
      });
      return;
    }

    setLoading(true);
    const userData = JSON.parse(authCtx.token);
    const WalletDetail = await WalletToken(userData.details.username);
    // console.log("Wallet Detail: ", WalletDetail);
    if (WalletDetail.success === false) {
      Toast.show({
        type: "error",
        text1: "Failed to Create!",
        text2: WalletDetail.message,
      });
      return;
    }

    if (checked === true) {
      if (expenseData.coins >= Config.MinDeposit) {
        const token = WalletDetail.data.token;
        const data = new FormData();
        data.append("type", WalletDetail.data.doc.type);
        data.append("typeId", WalletDetail.data.doc.typeId);
        data.append("amount", expenseData.coins);
        data.append("sites", item._id);
        data.append("username", expenseData.username);
        data.append("paymentType", "wallet");
        data.append("image", "");

        // console.log("Data: ", data)

        const createdata = await CreatesIdAPI(data, token);
        // console.log(createdata);
        if (createdata.success === true) {
          setLoading(false);
          Toast.show({
            type: "success",
            text1: "Created Successfully",
            text2: createdata.message,
          });
        } else {
          setLoading(false);
          Toast.show({
            type: "error",
            text1: "Failed to Create!",
            text2: createdata.message,
          });
        }
        navigation.goBack();
      } else {
        setLoading(false);
        Toast.show({
          type: "error",
          text1: "Low Coins!",
          text2: `Minimum Deposit Coins ${Config.MinDeposit}`,
        });
      }
    }
    if (checked === false) {
      if (expenseData.coins >= Config.MinDeposit) {
        const depositData = {
          mySiteId: item._id,
          username: expenseData.username,
          amount: expenseData.coins,
        };
        // console.log("Deposit Data: ", depositData);

        setLoading(false);
        navigation.navigate("IdDepositScreen", {
          minDeposit: Config.MinDeposit,
          isCreatingID: true,
          depositData: depositData,
        });
      } else {
        setLoading(false);
        Toast.show({
          type: "error",
          text1: "Low Coins!",
          text2: `Minimum Deposit Coins ${Config.MinDeposit}`,
        });
      }
    }
  };

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
        <Text style={styles.headingText}>Create ID</Text>
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
                source={{ uri: Config.idImageUrl + item.image }}
                resizeMode="cover"
                style={styles.img}
              />
              <View>
                <Text style={styles.idText}>{item.name}</Text>
                <View style={{ paddingVertical: 3 }} />
                <Text style={styles.idTextSmall}>{item.url}</Text>
              </View>
            </View>

            <View style={styles.containers}>
              <View style={{ flex: 1 }}>
                <Text style={styles.Textd}>Min Refil</Text>
                <View style={{ marginBottom: 8 }} />
                <Text style={styles.Textd}>Min Withdrawal</Text>
                <View style={{ marginBottom: 8 }} />
                <Text style={styles.Textd}>Min Maintaining Balance</Text>
                <View style={{ marginBottom: 8 }} />
                <Text style={styles.Textd}>Max Withdrawal</Text>
                <View style={{ marginBottom: 8 }} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.Textsm}>{item.refill}</Text>
                <View style={{ marginBottom: 8 }} />
                <Text style={styles.Textsm}>{item.minwithdrawn}</Text>
                <View style={{ marginBottom: 8 }} />
                <Text style={styles.Textsm}>{item.balance}</Text>
                <View style={{ marginBottom: 8 }} />
                <Text style={styles.Textsm}>{item.maxwithdrawn}</Text>
                <View style={{ marginBottom: 8 }} />
              </View>
            </View>
          </View>

          <View style={styles.lowerboxContainer}>
            <View style={{ marginTop: 8 }}>
              <View style={styles.inputContainer}>
                <View style={styles.iconView}>
                  <Image
                    source={require("../../../assets/images/navigationIcon/userIcon3x.png")}
                    resizeMode="contain"
                    style={styles.iconImg}
                    tintColor={"#DAA520"}
                  />
                </View>
                <TextInput
                  style={styles.input}
                  onChangeText={inputChangeHandler.bind(this, "username")}
                  value={inputs.username.value}
                  placeholder="Username*"
                  placeholderTextColor="#A0A0A0"
                />
              </View>
              {!inputs.username.isValid && (
                <View>
                  <Text style={styles.errorText}>Username is required</Text>
                </View>
              )}
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
                  inputProps={{ min: 500 }}
                />
              </View>
              {!inputs.coins.isValid && (
                <View>
                  <Text style={styles.errorText}>Coin Field is required</Text>
                </View>
              )}
            </View>

            <Text style={{ paddingHorizontal: 16, color: "red", fontSize: 11 }}>
              *Minimum Deposit Coins {Config.MinDeposit}
            </Text>
            <View style={{ padding: 12 }}>
              <CheckBox
                onPress={() => setChecked(!checked)}
                title={<Text style={{ color: "#fff" }}>Pay From Wallet</Text>}
                isChecked={checked}
                style={{ fontSize: 14 }}
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

export default CreateWalletID;

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
  containers: {
    flex: 1,
    flexDirection: "row",
    overflow: "hidden",
    padding: 14,
  },
  Textd: {
    fontSize: 12,
    fontWeight: "300",
    color: "#fff",
  },

  Textsm: {
    fontSize: 12,
    fontWeight: "500",
    color: "#fff",
    textAlign: "right",
  },
  upperboxContainer: {
    backgroundColor: "#2a2d3c",
    borderRadius: 8,
    marginHorizontal: 6,
    marginBottom: 8,
  },
  lowerboxContainer: {
    backgroundColor: "#2a2d3c",
    borderRadius: 8,
    margin: 8,
    paddingBottom: 8,
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

  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
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
  errorText: {
    marginHorizontal: 15,
    color: "red",
    marginBottom: 8,
    fontSize: 11,
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

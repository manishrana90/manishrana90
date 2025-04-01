import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import SumIcon from "react-native-vector-icons/Octicons";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

import { AuthContext } from "../../store/auth-context";
import { Socket } from "../../util/socket";

function InvestMentInner({ data }) {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const [depositVisible, setDepositVisible] = useState(false);
  const [selalert, setalertselect] = useState("");
  const [inputs, setinputs] = useState({
    amount: { value: "", isValid: true },
  });

  function deposit() {
    setDepositVisible(true);
  }

  function inputChangeHandler(inputIdentifier, enteredValue) {
    setinputs((currentInputs) => {
      return {
        ...currentInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true },
      };
    });
  }

  function fill() {
    setalertselect("*This field is required");
  }
  function closedeposit() {
    setinputs({ amount: { value: "", isValid: true } });
    setDepositVisible(!depositVisible);
    setalertselect("");
  }

  useEffect(() => {
    if (authCtx.token === null || authCtx.token === undefined) {
      navigation.navigate("Home");
    }

    const joinInvestment = (...args) => {
      if (args[0].success === true) {
        Toast.show({
          type: "success",
          text1: "Investment Success",
          text2: `${args[0].message}.😊`,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Investment Error",
          text2: `${args[0].message}.😔`,
        });
      }
    };
    Socket.on("join-fixed-deposit-success", joinInvestment);

    return () => {
      Socket.off("join-fixed-deposit-success", joinInvestment);
    };
  }, [Socket, authCtx]);

  function submitHandler() {
    fill();
    const expenseData = {
      amount: inputs.amount.value,
    };
    const amountIsValid = expenseData.amount.trim().length > 0;
    if (!amountIsValid) {
      setinputs((curInputs) => {
        return {
          amount: {
            value: curInputs.amount.value,
            isValid: amountIsValid,
          },
        };
      });
      return;
    }
    let tokendata = JSON.parse(authCtx.token);
    let newdata = {
      _id: data._id,
      amount: expenseData.amount,
      fixed_depsoit_id: data._id,
      user: {
        _id: tokendata._id,
        key: tokendata.key,
        token: tokendata.verifytoken,
        details: {
          manager: tokendata.details.manager,
          username: tokendata.details.username,
          role: tokendata.details.role,
          status: tokendata.details.status,
        },
      },
    };

    Socket.emit("join-fixed-depsoit", newdata);
    setDepositVisible(false);
    setinputs({ amount: { value: "", isValid: true } });
    setalertselect("");
  }

  return (
    <View style={styles.listcontail}>
      <View style={styles.container}>
        <View style={{ paddingVertical: 8, width: "70%" }}>
          <Text style={styles.Textd}>{data.name}</Text>
          <Text style={styles.Textsm}>
            Time Period Month: {data.period} || Interest: {data.percentage}%
          </Text>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => {
                deposit();
              }}
            >
              <View style={styles.procedbutton}>
                <Text
                  style={{ fontWeight: "bold", color: "#fff", fontSize: 14 }}
                >
                  Proceed
                </Text>
              </View>
            </TouchableOpacity>
            <View style={{ marginLeft: 50 }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("InvestMentSummary", { id: data._id });
                }}
              >
                <SumIcon
                  name="checklist"
                  style={{ padding: 10 }}
                  size={25}
                  color="#f2b71a"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ width: "30%", paddingVertical: 8 }}>
          <Image
            source={{ uri: data.logo }}
            resizeMode="contain"
            style={styles.img}
          />
        </View>
      </View>
      <View style={styles.notlist}>
        <Text style={styles.note}>
          Note:{" "}
          <Text style={styles.Textsmnote}>
            if you procced your amount hold for {data.period} month and you
            getting percentage amount daily basic anycase you withdraw amount
            then return {data.percentage}% of amount.
          </Text>
        </Text>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={depositVisible}
        onRequestClose={() => {
          setDepositVisible(!depositVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.Addbank}>
              <View style={styles.textadd}>
                <Text style={styles.textmarket}>
                  Thanks ! , You are giving interest our fixed deposit.{" "}
                </Text>
              </View>
              <View style={styles.iconView}>
                <Icon
                  name="close"
                  color="red"
                  size={30}
                  style={styles.Icon}
                  onPress={() => closedeposit()}
                />
              </View>
            </View>
            <ScrollView>
              <View style={styles.depocontainer}>
                <View
                  style={{
                    backgroundColor: "#2a2d3c",
                    borderRadius: 8,
                    margin: 8,
                  }}
                >
                  <View>
                    <Text style={styles.Textsmonth}>Name: {data.name}</Text>
                    <Text style={styles.Textsmonth}>Period: {data.period}</Text>
                    <Text style={styles.Textsmonth}>
                      Percentage: {data.percentage}%
                    </Text>
                  </View>

                  <TextInput
                    style={styles.input}
                    onChangeText={inputChangeHandler.bind(this, "amount")}
                    value={inputs.amount.value}
                    placeholder="Amount*"
                    keyboardType="numeric"
                    placeholderTextColor="#ffc21d"
                  />

                  {inputs.amount.value == "" && selalert != "" && (
                    <View style={{ flexDirection: "row", paddingLeft: 8 }}>
                      <View style={{ width: "80%" }}>
                        <Text style={[styles.textalert, { color: "red" }]}>
                          {selalert}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
                <TouchableOpacity onPress={submitHandler}>
                  <View style={styles.submitButton}>
                    <Text
                      style={{
                        color: "#000",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Join Now
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default InvestMentInner;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    overflow: "hidden",
  },
  Textd: {
    fontSize: 14,
    paddingLeft: 8,
    fontWeight: "400",
    color: "#fff",
  },
  Textsm: {
    fontSize: 11,
    padding: 8,
    color: "#fff",
  },
  Textsmonth: {
    fontSize: 13,
    padding: 8,
    color: "#fff",
  },
  Textsmnote: {
    fontSize: 11,
    paddingLeft: 4,
    color: "#fff",
    fontStyle: "italic",
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 4,
  },
  procedbutton: {
    padding: 4,
    marginTop: 8,
    marginLeft: 8,
    backgroundColor: "#f2b71a",
    borderRadius: 4,
    width: 80,
    alignItems: "center",
  },
  note: {
    color: "red",
    fontSize: 11,
  },
  listcontail: {
    backgroundColor: "#2a2d3c",
    borderRadius: 8,
    marginHorizontal: 8,
    marginBottom: 8,
    flex: 1,
  },
  notlist: {
    flex: 1,
    flexDirection: "row",
    marginHorizontal: 4,
    padding: 8,
    paddingTop: 0,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  modalView: {
    width: "98%",
    backgroundColor: "#000",
    borderRadius: 5,
    borderColor: "#f2b71a",
    borderWidth: 2,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingBottom: 20,
  },
  iconView: {
    alignItems: "flex-end",
    fontWeight: "bold",
    marginRight: 10,
    width: "10%",
  },
  textmarket: {
    color: "#f2b71a",
    fontSize: 13,
    fontWeight: "400",
    paddingLeft: 8,
  },
  Addbank: {
    flexDirection: "row",
  },
  textadd: {
    width: "90%",
    padding: 4,
  },
  containhieght: {
    height: "100%",
  },
  submitButton: {
    padding: 8,
    margin: 8,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#f2b71a",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 0.2,
    borderColor: "#fff",
    borderRadius: 6,
    padding: 10,
    color: "#fff",
  },
  textalert: {
    paddingHorizontal: 8,
    paddingTop: 0,
    marginBottom: 16,
    fontSize: 11,
    color: "red",
  },
});

// Need To Change

import React, { useState } from "react";
import {
  View,
  Modal,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import BackIcon from "react-native-vector-icons/Ionicons";
import { Config } from "../../../config";
import Clipboard from "@react-native-clipboard/clipboard";
import ImagePicker from "react-native-image-picker";
import { PermissionsAndroid } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import PaymentTypeCardUPI, {
  PaymentMethodCardBarCode,
  PaymentMethodCardBank,
} from "../UI/PayMethodCard";

const PaymentMethodBox = ({
  item,
  setBarCode,
  setBank,
  setUpi,
  setPaymentMethodData,
}) => {
  const paymentBoxCondition = () => {
    setBank(false);
    setBarCode(false);
    setUpi(false);

    if (item.paymenttype === "bank") {
      setBank(true);
      setPaymentMethodData(item);
    }
    if (item.paymenttype === "upi") {
      setUpi(true);
      setPaymentMethodData(item);
    }
    if (item.paymenttype === "barcode") {
      setBarCode(true);
      setPaymentMethodData(item);
    }
  };

  return (
    <Pressable
      style={styles.methodView}
      onPress={() => {
        paymentBoxCondition();
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

const DepositModal = ({ modalVisible, setModalVisible, payMethodList }) => {
  const [barCode, setBarCode] = useState(false);
  const [depAmount, setdepAmount] = useState("");
  const [bank, setBank] = useState(false);
  const [upi, setUpi] = useState(false);
  const dummyImage =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Picture_icon_BLACK.svg/1200px-Picture_icon_BLACK.svg.png";
  const [imageFilePath, setImageFilePath] = useState({ uri: dummyImage });
  const [paymentMethodData, setPaymentMethodData] = useState({});

  const paymentBoxCondition = () => {
    setBarCode(false);
    setBank(false);
    setUpi(false);
    setdepAmount("");
    setImageFilePath({ uri: dummyImage });
  };

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
            <Icon
              name="close"
              color="#fff"
              size={30}
              style={styles.Icon}
              onPress={() => {
                setModalVisible(!modalVisible);
                setBarCode(false);
                setBank(false);
                setUpi(false);
                setImageFilePath({ uri: dummyImage });
                setdepAmount("");
              }}
            />
            <View style={styles.container}>
              {barCode || bank || upi ? (
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
                      paymentBoxCondition();
                    }}
                  />
                </View>
              ) : null}

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
                    onChangeText={(value) => {
                      setdepAmount(value);
                    }}
                  />
                </View>
              </View>
              <Text style={styles.minimumAmountText}>
                *Minimum Deposit Amount is 100
              </Text>

              <View style={styles.header}>
                <View style={styles.headerInner}>
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
              </View>

              {upi ? (
                <PaymentTypeCardUPI
                  paymentMethodData={paymentMethodData}
                  depAmount={depAmount}
                  setdepAmount={setdepAmount}
                  imageFilePath={imageFilePath}
                  setImageFilePath={setImageFilePath}
                  setBarCode={setBarCode}
                  setBank={setBank}
                  setUpi={setUpi}
                />
              ) : barCode ? (
                <PaymentMethodCardBarCode
                  paymentMethodData={paymentMethodData}
                  depAmount={depAmount}
                  setdepAmount={setdepAmount}
                  imageFilePath={imageFilePath}
                  setImageFilePath={setImageFilePath}
                  setBarCode={setBarCode}
                  setBank={setBank}
                />
              ) : bank ? (
                <PaymentMethodCardBank
                  paymentMethodData={paymentMethodData}
                  depAmount={depAmount}
                  setdepAmount={setdepAmount}
                  imageFilePath={imageFilePath}
                  setImageFilePath={setImageFilePath}
                  setBarCode={setBarCode}
                  setBank={setBank}
                />
              ) : (
                <FlatList
                  data={payMethodList}
                  style={styles.methodCont}
                  keyExtractor={(item) => item._id}
                  numColumns={3}
                  renderItem={({ item }) => {
                    return (
                      <PaymentMethodBox
                        item={item}
                        setBarCode={setBarCode}
                        setBank={setBank}
                        setUpi={setUpi}
                        setPaymentMethodData={setPaymentMethodData}
                      />
                    );
                  }}
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DepositModal;

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
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    // paddingBottom: 20,
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
    // marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 5,
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
    // marginTop: 5,
  },

  header: {
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
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
    margin: 10,
  },

  methodView: {
    width: "30%",
    borderRadius: 10,
    backgroundColor: "#c2c6d1",
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
});

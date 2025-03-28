import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicon from "react-native-vector-icons/Ionicons";
import WithdrawAccModal from "../../../../component/UI/WithdrawAccModal";
import WithdrawOptionProceed from "../../../../component/UI/WithdrawOptionProceed";
import { WithdrawOptionProceedBank } from "../../../../component/UI/WithdrawOptionProceed";
import { WithdrawalMethod } from "../../../../util/http";
import { AuthContext } from "../../../../store/auth-context";
import { Config } from "../../../../../config";
import { useIsFocused, useNavigation } from "@react-navigation/native";

const WithdrawalOptions = (props) => {
  const { methods } = props.route.params;
  const authCtx = useContext(AuthContext);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const [selected, setSelected] = useState("");
  const [gatewayData, setGatewayData] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [withdrawalMethod, setWithdrawalMethod] = useState(methods);
  const [mobile, setMobile] = useState("");
  const [displayStep, setDisplayStep] = useState(0);
  const [showData, setShowData] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authCtx.token === null || authCtx.token === undefined) {
      navigation.navigate("Home");
    }
  }, [authCtx.logout]);

  useLayoutEffect(() => {
    async function PaymentMethodFetch() {
      if (isFocused) {
        setDisplayStep(0);
      }
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
  }, [authCtx, isFocused]);

  const setGatewayFilter = (gateway) => {
    setSelected(gateway);
    setGatewayData(withdrawalMethod.filter((item) => item.type == gateway));
    // console.log(gatewayData);

    const userData = JSON.parse(authCtx.token);
    setMobile(userData.details.mobile);
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
      setModalVisible(false);
    }
  };

  const renderWithdrawal = ({ item, index }) => {
    // console.log("Payment Types", item)
    return (
      <>
        {item.type != "Bank" && (
          <View style={styles.pressableGateway}>
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <View style={styles.gatewayImgHolder}>
                <Image
                  // source={{ uri: `${Config.ImageUrl}${item.image}` }}
                  source={item.name=='Gpay'? 
                    require('../../../../assets/images/iconPNG/googlePay.png') :
                    item.name=='Phonepay'? 
                    require('../../../../assets/images/iconPNG/phonePe.png') :
                    require('../../../../assets/images/iconPNG/upi.png')
                  }
                  resizeMode="contain"
                  style={styles.gatewayImgStyle}
                />
              </View>
              <Text style={[styles.gatewayText, { marginLeft: 8 }]}>
                {item.name}
              </Text>
            </View>

            {withdrawalMethod[index].withdrawns.length > 0 && (
              <TouchableOpacity
                style={{ marginRight: 15 }}
                onPress={() => {
                  setGatewayFilter(item.type);
                  setDisplayStep(1);
                  setShowData(0);
                }}
              >
                <Icon name="check-square-o" size={22} color="#DDA520" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={{ marginRight: 5 }}
              onPress={() => {
                setGatewayFilter(item.type);
                setDisplayStep(1);
                setShowData(1);
              }}
            >
              <Icon name="plus-circle" size={22} color="#DDA520" />
            </TouchableOpacity>
          </View>
        )}
        <View
          style={
            item.name != "Bank"
              ? { height: 1, backgroundColor: "#1E2836" }
              : { display: "none" }
          }
        />
      </>
    );
  };

  const renderBankWithdrawal = ({ item, index }) => {
    return (
      <>
        {item.type == "Bank" && (
          <View
            style={styles.pressableGateway}
            onPress={() => {
              setGatewayFilter(item.type);
              // console.log(withdrawalMethod);
              if (withdrawalMethod[index].withdrawns.length > 0) {
                setDisplayStep(1);
              } else {
                setModalVisible(!isModalVisible);
              }
            }}
          >
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <View style={styles.gatewayImgHolder}>
                <Image
                  // source={{ uri: `${Config.ImageUrl}${item.image}` }}
                  source={require('../../../../assets/images/iconPNG/bank.png')}
                  resizeMode="contain"
                  style={styles.gatewayImgStyle}
                />
              </View>
              <Text style={[styles.gatewayText, { marginLeft: 8 }]}>
                {item.name}
              </Text>
            </View>

            {withdrawalMethod[index].withdrawns.length > 0 && (
              <TouchableOpacity
                style={{ marginRight: 15 }}
                onPress={() => {
                  setGatewayFilter(item.type);
                  setDisplayStep(1);
                }}
              >
                <Icon name="check-square-o" size={22} color="#DDA520" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={{ marginRight: 5 }}
              onPress={() => {
                setGatewayFilter(item.type);
                setModalVisible(true);
              }}
            >
              <Icon name="plus-circle" size={22} color="#DDA520" />
            </TouchableOpacity>
          </View>
        )}
        <View
          style={
            item.name != "Bank"
              ? { height: 1, backgroundColor: "#1E2836" }
              : { display: "none" }
          }
        />
      </>
    );
  };

  return (
    <View style={styles.mainView}>
      {displayStep == 0 ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
          <View style={styles.withdrawalTextViewHolder}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={styles.backButton}
            >
              <Ionicon size={24} color={"#fff"} name={"arrow-back"} />
            </TouchableOpacity>
            <Text style={styles.withdrawalText}>Withdrawal Options</Text>
          </View>

          <View style={styles.gatewayHolder}>
            <View style={styles.paymentTypeView}>
              <Text style={{ fontSize: 14, color: "#fff", fontWeight: "500" }}>
                Preferred Payment
              </Text>
            </View>

            <FlatList
              data={withdrawalMethod}
              renderItem={renderWithdrawal}
              keyExtractor={(item) => item._id}
              // horizontal={true}
            />

            <View style={[styles.paymentTypeView, { marginTop: 30 }]}>
              <Text style={{ fontSize: 14, color: "#fff", fontWeight: "500" }}>
                Other Option
              </Text>
            </View>

            <FlatList
              data={withdrawalMethod}
              renderItem={renderBankWithdrawal}
              keyExtractor={(item) => item._id}
              // horizontal={true}
            />
          </View>
        </ScrollView>
      ) : selected != "Bank" ? (
        <>
          <WithdrawOptionProceed
            gatewayData={gatewayData != null && gatewayData[0]}
            setDisplayStep={setDisplayStep}
            onAddWithdrawal={() => onAddWithdrawal()}
            showData={showData}
          />
        </>
      ) : (
        <>
          <WithdrawOptionProceedBank
            gatewayData={gatewayData != null && gatewayData[0]}
            setDisplayStep={setDisplayStep}
            onAddWithdrawal={() => onAddWithdrawal()}
          />
        </>
      )}

      <WithdrawAccModal
        modalVisible={isModalVisible}
        setModalVisible={() => setModalVisible(!isModalVisible)}
        onAddWithdrawal={() => onAddWithdrawal()}
        gatewayData={gatewayData != null && gatewayData[0]}
      />

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
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  withdrawalTextViewHolder: {
    marginVertical: 14,
    alignItems: "center",
  },
  withdrawalText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
  gatewayHolder: {},
  pressableGateway: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 10,
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  gatewayImgHolder: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F7F7",
    marginHorizontal: 4,
    borderRadius: 4,
  },
  gatewayImgStyle: {
    width: 30,
    height: 30,
  },
  gatewayText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#fff",
  },
  paymentTypeView: {
    backgroundColor: "#212A37",
    paddingVertical: 9,
    paddingHorizontal: 10,
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

export default WithdrawalOptions;

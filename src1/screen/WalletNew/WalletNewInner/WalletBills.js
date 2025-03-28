import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import LottieView from "lottie-react-native";

const WalletBills = (props) => {
  const navigation = useNavigation();

  return (
    <>
      <View style={styles.signupButtonCont}>
        <Text style={styles.heading}>Recharges</Text>
        <View style={styles.rechargeCont}>
          <TouchableOpacity
            style={styles.rechargeView}
            onPress={() => {
              navigation.navigate("Recharge");
            }}
          >
            <View style={styles.rechargeIconCont}>
              <LottieView
                source={require("../../../assets/images/animation/prepaid.json")}
                autoPlay={true}
                style={styles.warningAnimation}
              />
            </View>
            <Text style={styles.rechargeText}>Prepaid</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rechargeView} onPress={() => {}}>
            <View style={styles.rechargeIconCont}>
              <Image
                source={require(`../../../assets/images/recharge/postpaid.png`)}
                style={{ height: 30, width: 30, tintColor: "#2CC597" }}
              />
            </View>
            <Text style={styles.rechargeText}>Postpaid</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rechargeView} onPress={() => {}}>
            <View style={styles.rechargeIconCont}>
              <LottieView
                source={require("../../../assets/images/animation/dth.json")}
                autoPlay={true}
                style={styles.lessHeight}
              />
            </View>
            <Text style={styles.rechargeText}>DTH</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rechargeView} onPress={() => {}}>
            <View style={styles.rechargeIconCont}>
              <Image
                source={require(`../../../assets/images/recharge/fastag.png`)}
                style={{ height: 30, width: 30, tintColor: "#2CC597" }}
              />
            </View>
            <Text style={styles.rechargeText}>FASTag</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.signupButtonCont}>
        <Text style={[styles.heading, { color: "#000" }]}>
          Pay Your Home Bills
        </Text>
        <View style={styles.signupButtonView}>
          <TouchableOpacity style={styles.signupButton} onPress={() => {}}>
            <View style={styles.signupIconCont}>
              <LottieView
                source={require("../../../assets/images/animation/electricity.json")}
                autoPlay={true}
                style={styles.warningAnimation}
              />
            </View>
            <Text style={styles.signupText}>Electricity</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signupButton} onPress={() => {}}>
            <View style={styles.signupIconCont}>
              <LottieView
                source={require("../../../assets/images/animation/broadband.json")}
                autoPlay={true}
                style={styles.lessHeight}
              />
            </View>
            <Text style={styles.signupText}>Broadband</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signupButton} onPress={() => {}}>
            <View style={styles.signupIconCont}>
              <Image
                source={require(`../../../assets/images/recharge/gas.png`)}
                style={{ height: 25, width: 25, tintColor: "#2CC597" }}
              />
            </View>
            <Text style={styles.signupText}>Book Gas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signupButton} onPress={() => {}}>
            <View style={styles.signupIconCont}>
              <LottieView
                source={require("../../../assets/images/animation/insurance.json")}
                autoPlay={true}
                style={styles.warningAnimation}
              />
            </View>
            <Text style={styles.signupText}>Insurance</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.signupButtonView}>
          <TouchableOpacity style={styles.signupButton} onPress={() => {}}>
            <View style={styles.signupIconCont}>
              <LottieView
                source={require("../../../assets/images/animation/water.json")}
                autoPlay={true}
                style={styles.lessHeight}
              />
            </View>
            <Text style={styles.signupText}>Water</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signupButton} onPress={() => {}}>
            <View style={styles.signupIconCont}>
              <LottieView
                source={require("../../../assets/images/animation/landline.json")}
                autoPlay={true}
                style={styles.lessHeight}
              />
            </View>
            <Text style={styles.signupText}>Landline</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signupButton} onPress={() => {}}>
            <View style={styles.signupIconCont}>
              <Image
                source={require(`../../../assets/images/recharge/pipedGas.png`)}
                style={{ height: 30, width: 30, tintColor: "#2CC597" }}
              />
            </View>
            <Text style={styles.signupText}>Piped Gas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signupButton} onPress={() => {}}>
            <View style={styles.signupIconCont}>
              <LottieView
                source={require("../../../assets/images/animation/education.json")}
                autoPlay={true}
                style={styles.warningAnimation}
              />
            </View>
            <Text style={styles.signupText}>Education</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.signupButtonCont}>
        <Text style={styles.heading}>OTT Subscriptions</Text>
        <View style={styles.rechargeCont}>
          <TouchableOpacity style={styles.rechargeView} onPress={() => {}}>
            <View style={styles.rechargeIconCont}>
              <Image
                source={require(`../../../assets/images/recharge/disney.jpeg`)}
                style={{ height: 40, width: 40, borderRadius: 40 }}
              />
            </View>
            <Text style={styles.rechargeText}>Disney+ Hotstar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rechargeView} onPress={() => {}}>
            <View style={styles.rechargeIconCont}>
              <Image
                source={require(`../../../assets/images/recharge/zee5.png`)}
                style={{ height: 40, width: 40, borderRadius: 40 }}
              />
            </View>
            <Text style={styles.rechargeText}>ZEE5 Premium</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rechargeView} onPress={() => {}}>
            <View style={styles.rechargeIconCont}>
              <Image
                source={require(`../../../assets/images/recharge/hoichoi.jpeg`)}
                style={{ height: 40, width: 40, borderRadius: 40 }}
              />
            </View>
            <Text style={styles.rechargeText}>Hoichoi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rechargeView} onPress={() => {}}>
            <View style={styles.rechargeIconCont}>
              <Image
                source={require(`../../../assets/images/recharge/sony.jpeg`)}
                style={{ height: 40, width: 40, borderRadius: 40 }}
              />
            </View>
            <Text style={styles.rechargeText}>SonyLIV</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.signupButtonCont}>
        <Text style={styles.heading}>Transit</Text>
        <View style={styles.rechargeCont}>
          <TouchableOpacity style={styles.rechargeView} onPress={() => {}}>
            <View style={styles.rechargeIconCont}>
              <Image
                source={require(`../../../assets/images/recharge/fastag.png`)}
                style={{ height: 30, width: 30, tintColor: "#2CC597" }}
              />
            </View>
            <Text style={styles.rechargeText}>FASTag</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rechargeView} onPress={() => {}}>
            <View style={styles.rechargeIconCont}>
              <LottieView
                source={require("../../../assets/images/animation/traffic.json")}
                autoPlay={true}
                style={styles.warningAnimation}
              />
            </View>
            <Text style={styles.rechargeText}>Challan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rechargeView} onPress={() => {}}>
            <View style={styles.rechargeIconCont}>
              <LottieView
                source={require("../../../assets/images/animation/metro.json")}
                autoPlay={true}
                style={styles.warningAnimation}
              />
            </View>
            <Text style={styles.rechargeText}>Metro Recharge</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rechargeView} onPress={() => {}}>
            <View style={styles.rechargeIconCont}>
              <LottieView
                source={require("../../../assets/images/animation/bike.json")}
                autoPlay={true}
                style={styles.warningAnimation}
              />
            </View>
            <Text style={styles.rechargeText}>Toll - Two Wheeler</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default WalletBills;

const styles = StyleSheet.create({
  heading: {
    marginHorizontal: 16,
    marginBottom: 5,
    color: "#000",
    fontSize: 15,
    fontWeight: "600",
  },

  signupButtonCont: {
    marginTop: 7,
    marginBottom: 16,
    marginHorizontal: 16,
    paddingVertical: 10,
    // backgroundColor: "#fff",
    // borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  signupButtonView: {
    flexDirection: "row",
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  signupButton: {
    flex: 1,
    marginHorizontal: 9,
    // justifyContent: "center",
    alignItems: "center",

    paddingBottom: 10,
  },
  signupIconCont: {
    // borderRadius: 50,
    paddingVertical: 5,
    height: 40,
    // width: 50,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#1E2836",
  },
  signupText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 5,
    textAlign: "center",
  },
  bonusCont: {
    flex: 1,
  },
  rechargeCont: {
    flexDirection: "row",
    marginHorizontal: 16,
    paddingVertical: 10,
  },
  rechargeView: {
    flex: 1,
    marginHorizontal: 5,
    // justifyContent: "center",
    alignItems: "center",
  },
  rechargeIconCont: {
    // borderRadius: 50,
    paddingVertical: 5,
    height: 40,
    // width: 50,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "#364253",
  },
  rechargeText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 5,
    textAlign: "center",
  },
  warningAnimation: {
    width: 40,
    height: 40,
  },
  lessHeight: {
    width: 30,
    height: 30,
  },
});

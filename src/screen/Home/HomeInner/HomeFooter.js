import React, { useLayoutEffect, useState, useContext } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Linking,
  TouchableOpacity,
} from "react-native";
import { Config } from "../../../../config";
import { useIsFocused } from "@react-navigation/native";
import { GetManagerNo } from "../../../util/http";
import { AuthContext } from "../../../store/auth-context";

const HomeFooter = () => {
  const isFocused = useIsFocused();
  const authCtx = useContext(AuthContext);
  const [whatsAppNo, setWhatsAppNo] = useState(null);
  

  useLayoutEffect(() => {
    if (isFocused && whatsAppNo === null) {
      async function GetNo() {
        const data = {
          domain: Config.domainName,
        };
        
        const userDetail = await GetManagerNo(data);
        if (userDetail.success == true) {
          setWhatsAppNo(userDetail?.data?.mobile_no);
        }
      }
      GetNo();
    }
  }, [isFocused, authCtx.token]);

  return (
    <View style={styles.container}>
      <View style={styles.infoCont}>
        <Text style={styles.infoContText}>INFORMATION</Text>
        <View style={styles.infoSubCont}>
          <Text style={styles.infoSubText}>Rules</Text>
          <Text style={styles.infoSubText}>Affiliate Programs</Text>
          <Text style={styles.infoSubText}>Bonuses Promotions</Text>
          <Text style={styles.infoSubText}>Risk Disclosures</Text>
        </View>
        <View style={styles.supportCont}>
          <View style={styles.supportHeadCont}>
            <View style={styles.supportText}>
              <Text style={styles.supportTextView}>Support 24/7</Text>
              <Text style={styles.supportTextViewDetail}>
                Write to us if you still have any questions!
              </Text>
            </View>
            {Config.ManagerName != "" && (
              <View style={styles.supportIconCont}>
                <TouchableOpacity
                  style={styles.supportButton}
                  onPress={() => {
                    Linking.openURL(
                      "whatsapp://send?text=" +
                        "Hello !" +
                        "&phone=" +
                        `${whatsAppNo}`
                    );
                  }}
                >
                  <View style={styles.supportButtonView}>
                    <Image
                      source={require("../../../assets/images/iconPNG/chatIcon-3x.png")}
                      resizeMode="contain"
                      style={{ width: 20, height: 15 }}
                    />
                    <Text style={styles.supportButtonText}>Chat</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View style={styles.imageLogoCont}>
          <Image
            style={styles.imageLogo}
            resizeMode="contain"
            source={require("../../../assets/images/iconPNG/visa-3x.png")}
          />
          <Image
            style={styles.imageLogo}
            resizeMode="contain"
            source={require("../../../assets/images/iconPNG/applePay-3x.png")}
          />
          <Image
            style={styles.imageLogo}
            resizeMode="contain"
            source={require("../../../assets/images/iconPNG/gpay-3x.png")}
          />
          <Image
            style={styles.imageLogo}
            resizeMode="contain"
            source={require("../../../assets/images/iconPNG/skrill-3x.png")}
          />
          <Image
            style={[styles.imageLogo, { width: 70 }]}
            resizeMode="contain"
            source={require("../../../assets/images/iconPNG/mastercard-3x.png")}
          />
          <Image
            style={styles.imageLogo}
            resizeMode="contain"
            source={require("../../../assets/images/iconPNG/discover-3x.png")}
          />
          <Image
            style={styles.imageLogo}
            resizeMode="contain"
            source={require("../../../assets/images/iconPNG/bitCoin-3x.png")}
          />
          <Image
            style={styles.imageLogo}
            resizeMode="contain"
            source={require("../../../assets/images/iconPNG/jcb-3x.png")}
          />
          <Image
            style={styles.imageLogo}
            resizeMode="contain"
            source={require("../../../assets/images/iconPNG/paytm-3x.png")}
          />
        </View>

        <View style={styles.copyrirgtCont}>
          <Text style={styles.copyrirgtText}>
            2024 Copyright {Config.ManagerName}. All Rights Reserved
          </Text>
        </View>
      </View>
    </View>
  );
};

export default HomeFooter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E2836",
    marginBottom: 30,
    paddingVertical: 12,
  },
  infoCont: {},
  infoContText: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    color: "#fff",
  },
  infoSubCont: {
    marginHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 9,
    marginBottom: 15,
  },
  infoSubText: {
    fontSize: 11,
    color: "#959CA7",
    fontWeight: "400",
  },
  supportCont: {
    marginHorizontal: 8,
    backgroundColor: "#364253",
    borderRadius: 5,
  },
  supportHeadCont: {
    flexDirection: "row",
  },
  supportText: {
    flex: 1.5,
    justifyContent: "center",
    marginVertical: 10,
    marginLeft: 12,
  },
  supportTextView: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  supportTextViewDetail: {
    color: "#959CA7",
    fontSize: 10,
  },
  supportIconCont: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  supportButton: {
    justifyContent: "center",
    marginRight: 10,
  },
  supportButtonView: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 3,
    backgroundColor: "#DAA520",
    alignItems: "center",
    justifyContent: "center",
  },
  supportButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 3,
  },
  supportIcon: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginLeft: 16,
    marginVertical: 10,
  },
  supportIconView: {
    backgroundColor: "#1E2836",
    height: 25,
    width: 25,
    borderRadius: 25 / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  supportFooterCont: {
    marginVertical: 5,
    marginHorizontal: 12,
    borderTopColor: "#c2c6d1",
    borderTopWidth: 1,
  },
  supportFooterView: {
    flexDirection: "row",
    marginBottom: 5,
  },
  supportFooterText: {
    flex: 1,
    color: "#fff",
    fontSize: 10,
  },
  imageLogoCont: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 15,
    marginBottom: 20,
    marginHorizontal: 30,
    justifyContent: "center",
  },
  imageLogo: {
    marginHorizontal: 5,
    height: 30,
    width: 40,
    marginVertical: 5,
  },

  copyrirgtCont: {
    alignItems: "center",
  },
  copyrirgtText: {
    color: "#c2c6d1",
    fontSize: 10,
    // marginTop: 10,
  },
});

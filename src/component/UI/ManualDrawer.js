import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Share,
  Linking,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation, DrawerActions } from "@react-navigation/native";

import { AuthContext } from "../../store/auth-context";
import { ScrollView } from "react-native-gesture-handler";
import LoginModal from "./LoginModal";

import Lottie from "lottie-react-native";
import { Config } from "../../../config";


function ManualDrawer({  }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [navigationType, setNavigationType] = useState("");
  // const [casinoPermit, setCasinoPermit] = useState([{visible: false}, {visible: false}])
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const dataToken =
    authCtx.token === null || authCtx.token === undefined
      ? ""
      : JSON.parse(authCtx.token);

  const onShare = async () => {
    const result = await Share.share({
      message: `Download ${Config.ManagerName} and win Real Cash. Wanna Win? Do ${Config.ManagerName}..
      ${Config.AppLink}`,
    });
  };


  // useEffect(() => {
  //   const FetchCasinoPermission = async() => {
  //     if(!authCtx.token) return;

  //     const getPermitRes = await GetCasinoPermission();
  //     console.log("Permision: ", getPermitRes);
  //     if(getPermitRes) {
  //       setCasinoPermit(getPermitRes);
  //     }
  //   }

  //   FetchCasinoPermission();
  // }, []);



  const loginNavigationHandler = (navigationType) => {
    setModalVisible(true);
    setNavigationType(navigationType);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.innerCont}>
        <View style={styles.hideIconView}>
          <TouchableOpacity
            style={styles.hideIconPress}
            onPress={() => {
              navigation.dispatch(DrawerActions.closeDrawer());
            }}
          >
            <Image
              source={require("../../assets/images/iconPNG/closeIcon.png")}
              resizeMode="contain"
              style={styles.hideIconImg}
              tintColor={"#DAA520"}
            />
          </TouchableOpacity>
        </View>

        {authCtx.token === null || authCtx.token === undefined ? (
          <View style={styles.profileView}>
            <View style={styles.userIconView}>
              <View
                style={[
                  styles.userIconView,
                  {
                    width: 60,
                    height: 60,
                    backgroundColor: "#fff",
                    borderRadius: 30,
                  },
                ]}
              >
                <Image
                  source={require("../../assets/images/navigationIcon/userIcon3x.png")}
                  resizeMode="contain"
                  style={styles.userIconImg}
                />
              </View>
              <Text style={[styles.signUpText, { marginTop: 6 }]}>
                User Name
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.profileView}>
            <View style={styles.userIconView}>
              <View
                style={[
                  styles.userIconView,
                  {
                    width: 60,
                    height: 60,
                    backgroundColor: "#fff",
                    borderRadius: 30,
                  },
                ]}
              >
                <Lottie
                  source={require("../../assets/images/animation/avatarAnimation.json")}
                  autoPlay={true}
                  style={{ width: 60, height: 60 }}
                />
              </View>
              <Text
                style={[styles.signUpText, { marginTop: 6, color: "#DAA520" }]}
              >
                {dataToken?.details?.username}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.lineDivider} />

        <ScrollView style={{ marginBottom: 10 }}>
          <View style={styles.viewContainer}>
            <TouchableOpacity
              style={styles.TextView}
              onPress={() => {
                navigation.navigate("Home");
              }}
            >
              <View style={styles.iconView}>
                <Image
                  source={require("../../assets/images/navigationIcon/homeIcon3x.png")}
                  resizeMode="contain"
                  style={styles.iconImgStyles}
                />
              </View>
              <Text style={styles.TextShow}>Home</Text>
            </TouchableOpacity>

            {(Config.isVirtual && (!authCtx.token || !!authCtx?.availableEventTypes['v9'])) && (
              <TouchableOpacity
                style={styles.TextView}
                onPress={() => {
                  authCtx.token === null || authCtx.token === undefined
                    ? loginNavigationHandler("liveVirtual")
                    : navigation.navigate("Live");
                }}
              >
                <View style={styles.iconView}>
                  <Image
                    source={require("../../assets/images/navigationIcon/virtualIcon3x.png")}
                    resizeMode="contain"
                    style={styles.iconImgStyles}
                  />
                </View>
                <Text style={styles.TextShow}>24/7 Cricket</Text>
              </TouchableOpacity>
            )}

            {(Config.isBallByBall && (!authCtx.token || !!authCtx?.availableEventTypes['b9']))&&
              <TouchableOpacity
                style={styles.TextView}
                onPress={() => {
                  authCtx.token === null || authCtx.token === undefined
                    ? loginNavigationHandler("BallByBall")
                    : navigation.navigate("BallByBall");
                }}
              >
                <View style={styles.iconView}>
                  <Image
                    source={require("../../assets/images/iconPNG/cricket-ball.png")}
                    resizeMode="contain"
                    style={styles.iconImgStyles}
                  />
                </View>
                <Text style={styles.TextShow}>Ball By Ball</Text>
              </TouchableOpacity>
            }

            {/* <TouchableOpacity
              style={styles.TextView}
              onPress={() => {
                navigation.navigate("News");
              }}
            >
              <View style={styles.iconView}>
                <Image 
                  source={require("../../assets/images/navigationIcon/newsIcon.png")}
                  resizeMode="contain"
                  style={styles.iconImgStyles}
                />
              </View>
              <Text stle={styles.TextShow}>News</Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={styles.TextView}
              onPress={() => {
                navigation.navigate("Sports");
              }}
            >
              <View style={styles.iconView}>
                <Image
                  source={require("../../assets/images/navigationIcon/vGamesIcon3x.png")}
                  resizeMode="contain"
                  style={styles.iconImgStyles}
                />
              </View>
              <Text style={styles.TextShow}>Sports</Text>
            </TouchableOpacity>
            

            {(authCtx.casinoPermit[0] && authCtx.casinoPermit[0]?.visible && Config.isCasino &&
              (!authCtx.token || !!authCtx.availableEventTypes['c9']))&& (
              <TouchableOpacity
                style={styles.TextView}
                onPress={() => {
                  navigation.navigate("Casino");
                }}
              >
                <View style={styles.iconView}>
                  <Image
                    source={require("../../assets/images/navigationIcon/casinoIcon3x.png")}
                    resizeMode="contain"
                    style={styles.iconImgStyles}
                  />
                </View>
                <Text style={styles.TextShow}>Casino</Text>
              </TouchableOpacity>
            )}
            
            {(authCtx.casinoPermit[1] && authCtx.casinoPermit[1]?.visible &&
            (!authCtx.token || !!authCtx.availableEventTypes['c1'])) && (
              <TouchableOpacity
                style={styles.TextView}
                onPress={() => {
                  authCtx.token === null || authCtx.token === undefined
                  ? loginNavigationHandler("CasinoAura")
                  : navigation.navigate("CasinoAura");
                }}
              >
                <View style={styles.iconView}>
                  <Image
                    source={require("../../assets/images/navigationIcon/casinoIcon3x.png")}
                    resizeMode="contain"
                    style={styles.iconImgStyles}
                  />
                </View>
                <Text style={styles.TextShow}>Casino Aura</Text>
              </TouchableOpacity>
            )}


            {Config.isWallet && (
              <TouchableOpacity
                style={styles.TextView}
                onPress={() => {
                  navigation.navigate("Wallet");
                }}
              >
                <View style={styles.iconView}>
                  <Image
                    source={require("../../assets/images/navigationIcon/walletDarkIcon3x.png")}
                    resizeMode="contain"
                    style={styles.iconImgStyles}
                  />
                </View>
                <Text style={styles.TextShow}>Wallet</Text>
              </TouchableOpacity>
            )}

            {authCtx.token === null || authCtx.token === undefined ? (
              <></>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.TextView}
                  onPress={() => {
                    navigation.navigate("CurrentBets");
                  }}
                >
                  <View style={styles.iconView}>
                    <Image
                      source={require("../../assets/images/iconPNG/dice-3x.png")}
                      resizeMode="contain"
                      style={styles.iconImgStyles}
                      tintColor={"#959CA7"}
                    />
                  </View>
                  <Text style={styles.TextShow}>Current Bet</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.TextView}
                  onPress={() => {
                    navigation.navigate("BettingHistory");
                  }}
                >
                  <View style={styles.iconView}>
                    <Image
                      source={require("../../assets/images/navigationIcon/betHistoryGreyIcon.png")}
                      resizeMode="contain"
                      style={styles.iconImgStyles}
                    />
                  </View>
                  <Text style={styles.TextShow}>Bet History</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity
                  style={styles.TextView}
                  onPress={() => {
                    navigation.navigate("TransactionHistory");
                  }}
                >
                  <View style={styles.iconView}>
                    <Image
                      source={require("../../assets/images/navigationIcon/tranHistoryGreyIcon.png")}
                      resizeMode="contain"
                      style={styles.iconImgStyles}
                    />
                  </View>
                  <Text style={styles.TextShow}>Transaction History</Text>
                </TouchableOpacity> */}
                <TouchableOpacity
                  style={styles.TextView}
                  onPress={() => {
                    navigation.navigate("AccountStatement");
                  }}
                >
                  <View style={styles.iconView}>
                    <Image
                      source={require("../../assets/images/iconPNG/supportIcon.png")}
                      resizeMode="contain"
                      style={styles.iconImgStyles}
                      tintColor={"#959CA7"}
                    />
                  </View>
                  <Text style={styles.TextShow}>Account Statement</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.TextView}
                  onPress={() => {
                    navigation.navigate("SettingCustom");
                  }}
                >
                  <View style={styles.iconView}>
                    <Image
                      source={require("../../assets/images/iconPNG/settingsIcon.png")}
                      resizeMode="contain"
                      style={styles.iconImgStyles}
                      tintColor={"#959CA7"}
                    />
                  </View>
                  <Text style={styles.TextShow}>Edit Password</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.TextView}
                  onPress={() => {
                    navigation.navigate("Reffer");
                  }}
                >
                  <View style={styles.iconView}>
                    <Image
                      source={require("../../assets/images/iconPNG/reffer.png")}
                      resizeMode="contain"
                      style={styles.iconImgStyles}
                      tintColor={"#959CA7"}
                    />
                  </View>
                  <Text style={styles.TextShow}>Refer Account</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.TextView}
                  onPress={() => {
                    navigation.navigate("ReferalReport");
                  }}
                >
                  <View style={styles.iconView}>
                    <Image
                      source={require("../../assets/images/iconPNG/share.png")}
                      resizeMode="contain"
                      style={styles.iconImgStyles}
                      tintColor={"#959CA7"}
                    />
                  </View>
                  <Text style={styles.TextShow}>Referal Report</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <View style={styles.lineDivider} />

          {Config.isCasino && (
            <View style={styles.viewContainer}>
              {/* <TouchableOpacity
              style={styles.TextView}
              onPress={() => {
                navigation.navigate("Casino");
              }}
            >
              <View style={styles.iconView}>
                <Image
                  source={require("../../assets/images/navigationIcon/vGamesIcon3x.png")}
                  resizeMode="contain"
                  style={styles.iconImgStyles}
                />
              </View>
              <Text style={styles.TextShow}>Instant Win</Text>
            </TouchableOpacity> */}
              <TouchableOpacity
                style={styles.TextView}
                onPress={() => {
                  navigation.navigate("LiveGame");
                }}
              >
                <View style={styles.iconView}>
                  <Image
                    source={require("../../assets/images/navigationIcon/liveGamesIcon3x.png")}
                    resizeMode="contain"
                    style={styles.iconImgStyles}
                  />
                </View>
                <Text style={styles.TextShow}>Live Table</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.TextView}
                onPress={() => {
                  navigation.navigate("Casino", {
                    filter:
                      authCtx.token === null || authCtx.token === undefined
                        ? "INSTANTWIN"
                        : "TABLEGAME",
                  });
                }}
              >
                <View style={styles.iconView}>
                  <Image
                    source={require("../../assets/images/navigationIcon/casinoIcon3x.png")}
                    resizeMode="contain"
                    style={styles.iconImgStyles}
                  />
                </View>
                <Text style={styles.TextShow}>Table Games</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.lineDivider} />

          <View style={styles.viewContainer}>
            <TouchableOpacity
              style={styles.TextView}
              onPress={() => { navigation.navigate("Terms"); }}
            >
              <View style={styles.iconView}>
                <Image
                  source={require("../../assets/images/iconPNG/rules.png")}
                  resizeMode="contain"
                  style={styles.iconImgStyles}
                />
              </View>
              <Text style={styles.TextShow}>Terms & Condition</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.lineDivider} />

          <View style={{ marginTop: 15 }}>
            <TouchableOpacity
              style={styles.signUp}
              onPress={() => {
                onShare();
              }}
            >
              <Text style={styles.signUpText}>
                Share <Icon name="share-alt" size={12} color="#fff" />{" "}
              </Text>
            </TouchableOpacity>
          </View>

          {authCtx.token === null || authCtx.token === undefined ? (
            <View style={{ marginTop: 15 }}>
              <TouchableOpacity
                style={styles.signUp}
                onPress={() => {
                  navigation.dispatch(DrawerActions.closeDrawer());
                  setModalVisible(true);
                }}
              >
                <Text style={styles.signUpText}>SIGN IN</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ marginTop: 15 }}>
              <TouchableOpacity
                style={styles.signUp}
                onPress={() => {
                  authCtx.logout();
                }}
              >
                <Text style={styles.signUpText}>LOG OUT</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.socialIconView}>
            <Icon
              name="instagram"
              size={20}
              color="#959CA7"
              style={{ marginHorizontal: 10 }}
            />
            <Icon
              name="facebook"
              size={20}
              color="#959CA7"
              style={{ marginHorizontal: 10 }}
            />
            <Icon
              name="telegram"
              size={20}
              color="#959CA7"
              style={{ marginHorizontal: 10 }}
            />
          </View>
          <View style={styles.socialIconView}>
            <Text style={styles.signUpText}> Version: <Text style={{color: "#DAA520"}}>{Config.showVersion}</Text></Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      <LoginModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        navigationType={navigationType}
      />
    </View>
  );
}

export default ManualDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "flex-start",
    height: "100%",
    width: "100%",
    alignItems: "flex-start",
  },
  innerCont: {
    backgroundColor: "#151C26",
    height: "100%",
    width: "100%",
  },
  hideIconView: {
    alignItems: "flex-start",
    paddingTop: 10,
    paddingLeft: 10,
  },
  hideIconPress: {
    width: 30,
    height: 30,
  },
  hideIconImg: {
    width: "100%",
    height: "100%",
    tintColor: "#DAA520",
  },
  profileView: {
    marginTop: 10,
    marginBottom: 20,
  },
  signUp: {
    backgroundColor: "#DAA520",
    marginHorizontal: 15,
    borderRadius: 5,
    paddingVertical: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  signUpText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  userIconView: {
    alignItems: "center",
    justifyContent: "center",
  },
  userIconImg: {
    width: 30,
    height: 30,
  },
  viewContainer: {
    marginHorizontal: 15,
    paddingBottom: 10,
  },
  lineDivider: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#1E2836",
  },
  TextView: {
    alignItems: "center",
    marginVertical: 8,
    flexDirection: "row",
  },
  iconView: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  iconImgStyles: {
    width: 18,
    height: 18,
    tintColor: "#959CA7",
  },
  TextShow: {
    color: "#959CA7",
    fontSize: 14,
    fontWeight: "400",
  },
  socialIconView: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

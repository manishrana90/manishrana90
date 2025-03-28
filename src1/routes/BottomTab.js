import React, { useContext, useState } from "react";
import { Image, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Lottie from "lottie-react-native";

import { AuthContext } from "../store/auth-context";

import Home from "../screen/Home/Home";
import Sports from "../screen/Sports/Sports";
import Wallet from "../screen/Wallet/Wallet";
import Casino from "../screen/Casino/Casino";
import Live from "../screen/Live/Live";
import LiveGame from "../screen/LiveGame/LiveGame";
import LiveBet from "../screen/Live/LiveBet";
import TransactionHistory from "../screen/Wallet/WalletInner/WalletTransactionInner/TransactionHistory";
import SettingCustom from "../screen/Wallet/WalletInner/WalletTransactionInner/SettingCustom";
import Games from "../screen/Games/Games";
import LoginModal from "../component/UI/LoginModal";
import WithdrawalOptions from "../screen/Wallet/WalletInner/WalletTransactionInner/WithdrawalOptions";
import WithdrawaScreen from "../screen/Wallet/WalletInner/WalletTransactionInner/WithdrawScreen";
import DepositScreen from "../screen/Wallet/WalletInner/WalletTransactionInner/DepositScreen";
import BettingHistory from "../screen/Wallet/WalletInner/WalletTransactionInner/BettingHistory";
import Recharge from "../screen/WalletNew/WalletNewInner/Recharge";
import AccountStatement from "../screen/Wallet/WalletInner/WalletTransactionInner/AccountStatement";
import CurrentBets from "../screen/Wallet/WalletInner/WalletTransactionInner/CurrentBets";
import AccountBetShow from "../component/UI/AccountBetShow";
import { Config } from "../../config";
import CasinoHistory from "../screen/Wallet/WalletInner/WalletTransactionInner/CasinoHistory";
import ReferalReport from "../screen/Wallet/WalletInner/WalletTransactionInner/ReferalReport";
import ReferalHistory from "../screen/Wallet/WalletInner/WalletTransactionInner/ReferalHistory";
import Reffer from "../screen/Wallet/WalletInner/WalletTransactionInner/Reffer";
import InvestMent from "../screen/Wallet/WalletInner/WalletTransactionInner/InvestMent";
import InvestMentSummary from "../screen/Wallet/WalletInner/WalletTransactionInner/InvestMentSummary";
import FixDepositReport from "../screen/Wallet/WalletInner/WalletTransactionInner/FixDepositReport";
import WalletIDs from "../screen/IDs/WalletIDs";
import CreateWalletID from "../screen/IDs/IDInner/CreateWalletID";
import MyIdDeposit from "../screen/IDs/IDInner/MyIdDeposit";
import MyIdWithdraw from "../screen/IDs/IDInner/MyIdWithdraw";
import MyIdDetails from "../screen/IDs/IDInner/MyIdDetails";
import IdWithdrawScreen from "../screen/IDs/IDInner/IdWithdrawScreen";
import IdDepositScreen from "../screen/IDs/IDInner/IdDepositScreen";
import CasinoAura from "../screen/CasinoAura/CasinoAura";
import BallByBall from "../screen/BallByBall/BallByBall";
import Aviator from "../screen/Aviator/Aviator";
import Terms from "../screen/Terms/Terms";

const Bottom = createBottomTabNavigator();

export default function BottomTab() {
  const authCtx = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [navigationType, setNavigationType] = useState("");

  const navigationVirtualHandler = (page) => {
    setModalVisible(true);
    setNavigationType(page);
  };

  return (
    <>
      <Bottom.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "#fff",
          tabBarActiveBackgroundColor: "#212A37",
          tabBarInactiveBackgroundColor: "#212A37",
          headerShown: false,
          tabBarStyle: {},
          tabBarLabel: () => {
            return null;
          },
          showLabel: false,
        }}
        backBehavior={"history"}
      >
        <Bottom.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({ focused, color, size }) => {
              return (
                <>
                  <Image
                    source={require("../assets/images/navigationIcon/homeIcon3x.png")}
                    resizeMode="contain"
                    style={{
                      // marginBottom: 3,
                      width: 20,
                      height: 20,
                      tintColor: focused ? "#DAA520" : "#959CA7",
                    }}
                  />
                </>
              );
            },
          }}
        />
        <Bottom.Screen
          name="Sports"
          component={Sports}
          options={{
            tabBarIcon: ({ focused, color, size }) => {
              return (
                <>
                  <Image
                    source={require("../assets/images/navigationIcon/vGamesIcon3x.png")}
                    resizeMode="contain"
                    style={{
                      // marginBottom: 3,
                      width: 20,
                      height: 20,
                      tintColor: focused ? "#DAA520" : "#959CA7",
                    }}
                  />
                </>
              );
            },
          }}
        />

        {Config.isWallet && (
          <Bottom.Screen
            name="Wallet"
            component={Wallet}
            options={{
              tabBarIcon: ({ focused, color, size }) => {
                return (
                  <View
                    style={{
                      backgroundColor: "#DAA520",
                      borderRadius: 25,
                      position: "absolute",
                      height: 50,
                      width: 50,
                      top: -10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={require("../assets/images/navigationIcon/walletIcon3x.png")}
                      resizeMode="contain"
                      style={{
                        width: 20,
                        height: 20,
                      }}
                    />
                  </View>
                );
              },
            }}
          />
        )}
        {(Config.isCasino && 
        (!authCtx.token || 
          !!authCtx?.availableEventTypes['c9'] ||
          !!authCtx?.availableEventTypes['c1'] )) && (
          <Bottom.Screen
            name="Casino"
            component={
              authCtx.casinoPermit[0] && authCtx.casinoPermit[0]?.visible
                ? Casino
                : authCtx.casinoPermit[1] && authCtx.casinoPermit[1]?.visible
                ? CasinoAura
                : Casino
            }
            options={{
              tabBarIcon: ({ focused, color, size }) => {
                return (
                  <>
                    <Image
                      source={require("../assets/images/navigationIcon/casinoIcon3x.png")}
                      resizeMode="contain"
                      style={{
                        // marginBottom: 3,
                        width: 20,
                        height: 20,
                        tintColor: focused ? "#DAA520" : "#959CA7",
                      }}
                    />
                  </>
                );
              },
            }}
          />
        )}

        {!Config.isCasino && (
          <Bottom.Screen
            name="CurrentBets"
            component={CurrentBets}
            options={{
              tabBarIcon: ({ focused, color, size }) => {
                return (
                  <>
                    <Image
                      source={require("../assets/images/navigationIcon/tranHistoryGreyIcon.png")}
                      resizeMode="contain"
                      style={{
                        // marginBottom: 3,
                        width: 20,
                        height: 20,
                        tintColor: focused ? "#DAA520" : "#959CA7",
                      }}
                    />
                  </>
                );
              },
            }}
            listeners={({ navigation, route }) => ({
              tabPress: (e) => {
                // Prevent default action
                e.preventDefault();

                if (authCtx.token === null || authCtx.token === undefined) {
                  navigationVirtualHandler("CurrentBets");
                } else {
                  navigation.navigate("CurrentBets");
                }
              },
            })}
          />
        )}
        {/* <Bottom.Screen
            name="LiveGame"
            component={LiveGame}
            options={{
              tabBarIcon: ({ focused, color, size }) => {
                return (
                  <>
                    <Image
                      source={require("../assets/images/navigationIcon/liveGamesIcon3x.png")}
                      resizeMode="contain"
                      style={{
                        // marginBottom: 3,
                        width: 20,
                        height: 20,
                        tintColor: focused ? "#DAA520" : "#959CA7",
                      }}
                    />
                  </>
                );
              },
            }}
          /> */}

        {(Config.isVirtual && (!authCtx.token || !!authCtx?.availableEventTypes['v9'])) ? (
          <Bottom.Screen
            name="Live"
            component={Live}
            options={{
              tabBarIcon: ({ focused, color, size }) => {
                return (
                  <>
                    <Lottie
                      source={require("../assets/images/animation/cricketAnimation.json")}
                      autoPlay={true}
                      style={{ width: 50, height: 37.5 }}
                    />
                  </>
                );
              },
            }}
            listeners={({ navigation, route }) => ({
              tabPress: (e) => {
                // Prevent default action
                e.preventDefault();

                if (authCtx.token === null || authCtx.token === undefined) {
                  navigationVirtualHandler('liveVirtual');
                } else {
                  navigation.navigate("Live");
                }
              },
            })}
          />
        ) : (
          <Bottom.Screen
            name="TransactionHistory"
            component={TransactionHistory}
            options={{
              tabBarIcon: ({ focused, color, size }) => {
                return (
                  <>
                    <Image
                      source={require("../assets/images/navigationIcon/betHistoryGreyIcon.png")}
                      resizeMode="contain"
                      style={{
                        // marginBottom: 3,
                        width: 20,
                        height: 20,
                        tintColor: focused ? "#DAA520" : "#959CA7",
                      }}
                    />
                  </>
                );
              },
            }}
            listeners={({ navigation, route }) => ({
              tabPress: (e) => {
                // Prevent default action
                e.preventDefault();

                if (authCtx.token === null || authCtx.token === undefined) {
                  navigationVirtualHandler("TransactionHistory");
                } else {
                  navigation.navigate("TransactionHistory");
                }
              },
            })}
          />
        )}

        <Bottom.Screen
          name="BallByBall"
          component={BallByBall}
          options={{
            tabBarButton: (props) => null,
            title: "Ball By Ball",
          }}
        />
        <Bottom.Screen
          name="Aviator"
          component={Aviator}
          options={{
            tabBarButton: (props) => null,
            title: "Aviator",
          }}
        />
        <Bottom.Screen
          name="LiveGame"
          component={LiveGame}
          options={{
            tabBarButton: (props) => null,
            title: "LiveBet",
          }}
        />
        <Bottom.Screen
          name="LiveBet"
          component={LiveBet}
          options={{
            tabBarButton: (props) => null,
            title: "LiveBet",
          }}
        />

        {(Config.isVirtual && (!authCtx.token || !!authCtx?.availableEventTypes['v9'])) && (
          <Bottom.Screen
            name="TransactionHistory"
            component={TransactionHistory}
            options={{
              tabBarButton: (props) => null,
              title: "Transaction History",
            }}
          />
        )}
        <Bottom.Screen
          name="SettingCustom"
          component={SettingCustom}
          options={{
            tabBarButton: (props) => null,
            title: "Settings",
          }}
        />
        <Bottom.Screen
          name="WithdrawalOptions"
          component={WithdrawalOptions}
          options={{
            tabBarButton: (props) => null,
            title: "Withdrawal Options",
          }}
        />
        <Bottom.Screen
          name="Games"
          component={Games}
          options={{
            tabBarButton: (props) => null,
            title: "Casino Games",
          }}
        />
        <Bottom.Screen
          name="BettingHistory"
          component={BettingHistory}
          options={{
            tabBarButton: (props) => null,
            title: "Betting History",
          }}
        />
        <Bottom.Screen
          name="WithdrawScreen"
          component={WithdrawaScreen}
          options={{
            tabBarButton: (props) => null,
            title: "WithdrawaScreen",
          }}
        />
        <Bottom.Screen
          name="DepositScreen"
          component={DepositScreen}
          options={{
            tabBarButton: (props) => null,
            title: "DepositScreen",
          }}
        />
        <Bottom.Screen
          name="Recharge"
          component={Recharge}
          options={{
            tabBarButton: (props) => null,
            title: "Recharge",
          }}
        />
        <Bottom.Screen
          name="AccountStatement"
          component={AccountStatement}
          options={{
            tabBarButton: (props) => null,
            title: "AccountStatement",
          }}
        />
        {Config.isCasino && (
          <Bottom.Screen
            name="CurrentBets"
            component={CurrentBets}
            options={{
              tabBarButton: (props) => null,
              title: "CurrentBets",
            }}
          />
        )}
        {!Config.isWallet && (
          <Bottom.Screen
            name="Wallet"
            component={Wallet}
            options={{
              tabBarButton: (props) => null,
              title: "Wallet",
            }}
          />
        )}
        <Bottom.Screen
          name="AccountBetShow"
          component={AccountBetShow}
          options={{
            tabBarButton: (props) => null,
            title: "AccountBetShow",
          }}
        />
        {Config.isCasino && (
          <Bottom.Screen
            name="CasinoHistory"
            component={CasinoHistory}
            options={{
              tabBarButton: (props) => null,
              title: "CasinoHistory",
            }}
          />
        )}
        <Bottom.Screen
          name="ReferalReport"
          component={ReferalReport}
          options={{
            tabBarButton: (props) => null,
            title: "ReferalReport",
          }}
        />
        <Bottom.Screen
          name="ReferalHistory"
          component={ReferalHistory}
          options={{
            tabBarButton: (props) => null,
            title: "ReferalHistory",
          }}
        />
        <Bottom.Screen
          name="Reffer"
          component={Reffer}
          options={{
            tabBarButton: (props) => null,
            title: "ReferalHistory",
          }}
        />
        <Bottom.Screen
          name="InvestMent"
          component={InvestMent}
          options={{
            tabBarButton: (props) => null,
            title: "InvestMent",
          }}
        />
        <Bottom.Screen
          name="InvestMentSummary"
          component={InvestMentSummary}
          options={{
            tabBarButton: (props) => null,
            title: "InvestMentSummary",
          }}
        />
        <Bottom.Screen
          name="FixDepositReport"
          component={FixDepositReport}
          options={{
            tabBarButton: (props) => null,
            title: "FixDepositReport",
          }}
        />
        <Bottom.Screen
          name="WalletIDs"
          component={WalletIDs}
          options={{
            tabBarButton: (props) => null,
            title: "WalletIDs",
          }}
        />
        <Bottom.Screen
          name="CreateWalletID"
          component={CreateWalletID}
          options={{
            tabBarButton: (props) => null,
            title: "CreateWalletID",
          }}
        />
        <Bottom.Screen
          name="MyIdDeposit"
          component={MyIdDeposit}
          options={{
            tabBarButton: (props) => null,
            title: "MyIdDeposit",
          }}
        />
        <Bottom.Screen
          name="MyIdWithdraw"
          component={MyIdWithdraw}
          options={{
            tabBarButton: (props) => null,
            title: "MyIdWithdraw",
          }}
        />
        <Bottom.Screen
          name="MyIdDetails"
          component={MyIdDetails}
          options={{
            tabBarButton: (props) => null,
            title: "MyIdDetails",
          }}
        />
        <Bottom.Screen
          name="IdWithdrawScreen"
          component={IdWithdrawScreen}
          options={{
            tabBarButton: (props) => null,
            title: "IdWithdrawScreen",
          }}
        />
        <Bottom.Screen
          name="IdDepositScreen"
          component={IdDepositScreen}
          options={{
            tabBarButton: (props) => null,
            title: "IdDepositScreen",
          }}
        />
        <Bottom.Screen
          name="CasinoAura"
          component={CasinoAura}
          options={{
            tabBarButton: (props) => null,
            title: "CasinoAura",
            unmountOnBlur: true,
          }}
        />
        <Bottom.Screen
          name="Terms"
          component={Terms}
          options={{
            tabBarButton: (props) => null,
            title: "Terms",
          }}
        />
      </Bottom.Navigator>

      {modalVisible && (
        <LoginModal
          modalVisible={modalVisible}
          setModalVisible={() => {
            setModalVisible(false);
            setNavigationType("");
          }}
          navigationType={navigationType}
        />
      )}
    </>
  );
}

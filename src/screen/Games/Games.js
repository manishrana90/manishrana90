import React, { useContext, useLayoutEffect, useState, useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LottieView from "lottie-react-native";
import { WebView } from "react-native-webview";
import { AuthContext } from "../../store/auth-context";
import Toast from "react-native-toast-message";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { SingleCasinoAPI, SingleGameAPI } from "../../util/http";
import { Socket } from "../../util/socket";
import MarqueeView from "react-native-marquee-view";

const windowHeight = Dimensions.get("window").height;

const Games = (props) => {
  const { gameId, tableId } = props.route.params;
  const authCtx = useContext(AuthContext);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [casinoUrl, setCasinoUrl] = useState(null);
  const [oldGameId, setOldGameId] = useState(null);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (authCtx.token === null || authCtx.token === undefined) {
      navigation.navigate("Home");
    }
  }, [authCtx.logout]);

  Socket.on("get-balance-success", (...args) => {
    authCtx.setCasinoBalance(parseFloat(args[0].amount) * 10);
  });

  useLayoutEffect(() => {
    if (isFocused && oldGameId != gameId) {
      setError(false);
      setCasinoUrl(null);
      const CasinoGame = async () => {
        setOldGameId(gameId);
        const token = JSON.parse(authCtx.token);
        const data = {
          username: token.details.username,
          gameId: gameId,
          tableId: tableId.length > 0 ? tableId : "test",
        };

        let userdata = {
          user: {
            _id: token._id,
            key: token.key,
            token: token.verifytoken,
            details: {
              username: token.details.username,
              role: token.details.role,
              status: token.details.status,
            },
          },
        };

        Socket.emit("get-userbalance", userdata);
        Socket.emit("get-user", userdata);

        // const singleCasino = await SingleCasinoAPI(data);
        const singleCasino = await SingleGameAPI(data);
        setError(false);
        if (singleCasino?.data?.url) {
          setCasinoUrl(singleCasino?.data?.url);
        } else if (
          singleCasino.message ==
          "You have to Deposit First, to play Casino Games"
        ) {
          setError(true);
          setMessage("You have to Deposit First, to play Casino Games");
        } else {
          setError(true);
          setMessage(singleCasino.message);
        }
      };
      CasinoGame();
    }
  });

  return (
    <View style={{ flex: 1 }}>
      <MarqueeView
            style={{
              marginTop: 10,
              // width: 200,
            }}
          >
            <View style={{}}>
              <Text
                style={{ color: "#FFBF00", fontSize: 14, fontWeight: "600" }}
              >
                10 Points = 1 Point in Casino Games     Please Accept Our Terms
              </Text>
            </View>
          </MarqueeView>

      {casinoUrl != null && gameId === oldGameId ? (
        <>
          <WebView
            nestedScrollEnabled
            automaticallyAdjustContentInsets={true}
            javaScriptEnabled={true}
            source={{ uri: casinoUrl }}
            scrollEnabled={false}
            startInLoadingState={true}
          />
        </>
      ) : error === true ? (
        <View
          style={{
            height: windowHeight - 100,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LottieView
            source={require("../../assets/images/animation/ZoloWarning.json")}
            autoPlay={true}
            style={styles.warningAnimation}
          />
          <Text style={styles.noBetText}>{message}</Text>
          <TouchableOpacity
            style={styles.goBackButtonStyles}
            onPress={() => {
              props.navigation.goBack();
            }}
          >
            <Text style={{ color: "#fff", fontSize: 18 }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
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
  matchCountryHolder: {
    backgroundColor: "#364253",
    height: 33,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  matchCountryText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  iframeScoreCardView: {
    overflow: "hidden",
    marginHorizontal: 7,
    height: 235,
    borderRadius: 8,
  },
  scoreCardButtonView: {
    flexDirection: "row",
    marginVertical: 8,
    marginHorizontal: 5,
  },
  scoreCardInvestButton: {
    flex: 1,
    height: 35,
    marginHorizontal: 4,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  investButtonText: {
    color: "#212A37",
    fontSize: 12,
    fontWeight: "400",
  },
  bettingCardView: {
    marginHorizontal: 7,
    marginBottom: 7,
    backgroundColor: "#1E2836",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 11,
  },
  loadingStyles: {
    flex: 1,
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  goBackButtonStyles: {
    marginTop: 20,
    backgroundColor: "#DAA520",
    marginHorizontal: 4,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },

  noBetText: {
    paddingHorizontal: 10,
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },

  warningAnimation: {
    width: 300,
    height: 300,
    position: "absolute",
    top: 0,
  },
});

export default Games;

import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { memo, useContext, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import LoginModal from "../../../component/UI/LoginModal";
import { AuthContext } from "../../../store/auth-context";
import { CasinoAPI } from "../../../util/http";
import { Socket } from "../../../util/socket";
import RenderCasinoGames from "../../../component/UI/RenderCasinoGames";
import HomeLive from "../../../component/UI/HomeLive";
import TableIdList from "../../../util/casino";
import { Config } from "../../../../config";

const HomeData = () => {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [navigationType, setNavigationTyoe] = useState("");
  const [navigationData, setNavigationData] = useState("");
  const [instantWin, setInstantWin] = useState([]);
  const [tableGame, setTableGame] = useState([]);
  const [liveGame, setLiveGame] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useLayoutEffect(() => {
    if (isFocused && authCtx.casinoAllGames != null) {
      if (
        instantWin.length === 0 ||
        tableGame.length === 0 ||
        liveGame.length === 0
      ) {
        let firstArray = [];
        let secondArray = [];
        let thirdArray = [];
        for (let i = 0; i < 6; i++) {
          let show1 =
            authCtx.casinoAllGames[1][
              Math.floor(Math.random() * authCtx.casinoAllGames[1].length)
            ];
          firstArray.push(show1);
          let show2 =
            authCtx.casinoAllGames[2][
              Math.floor(Math.random() * authCtx.casinoAllGames[2].length)
            ];
          secondArray.push(show2);
          let show3 =
            authCtx.casinoAllGames[0][
              Math.floor(Math.random() * authCtx.casinoAllGames[0].length)
            ];
          thirdArray.push(show3);
        }
        setInstantWin(firstArray);
        setTableGame(secondArray);
        setLiveGame(thirdArray);
      }
    } else if (isFocused && authCtx.casinoAllGames === null) {
      if (
        instantWin.length === 0 ||
        tableGame.length === 0 ||
        liveGame.length === 0
      ) {
        const NewCasinoData = async () => {
          const casinoData = await CasinoAPI();
          if (casinoData.success === true) {
            authCtx.setCasino(casinoData.games.casinogames);
            let firstArray = [];
            let secondArray = [];
            let thirdArray = [];
            for (let i = 0; i < 6; i++) {
              let show1 =
                casinoData.games.casinogames[1][
                  Math.floor(
                    Math.random() * casinoData.games.casinogames[1].length
                  )
                ];
              firstArray.push(show1);
              let show2 =
                casinoData.games.casinogames[2][
                  Math.floor(
                    Math.random() * casinoData.games.casinogames[2].length
                  )
                ];
              secondArray.push(show2);
              let show3 =
                casinoData.games.casinogames[0][
                  Math.floor(
                    Math.random() * casinoData.games.casinogames[0].length
                  )
                ];
              thirdArray.push(show3);
            }
            setInstantWin(firstArray);
            setTableGame(secondArray);
            setLiveGame(thirdArray);
          }
        };
        NewCasinoData();
      }
    }

    const UserBalanceDetail = async () => {
      if (isFocused && authCtx.token != null && authCtx.token != undefined) {
        const token = JSON.parse(authCtx.token);

        let stakeData = {
          user: {
            _id: token._id,
            key: token.key,
            details: {
              username: token.details.username,
              role: token.details.role,
              status: token.details.status,
            },
          },
        };

        Socket.emit("get-stake", stakeData);
      }
    };
    UserBalanceDetail();
  }, [isFocused, authCtx, CasinoAPI.Socket]);

  const setLoginNavigation = (value, gameId, tableId) => {
    setNavigationTyoe(value);
    setNavigationData({ gameId: gameId, tableId: tableId });
    setModalVisible(true);
  };

  const LoginVirtualNavigation = () => {
    setModalVisible(true);
    setNavigationTyoe("liveVirtual");
  };


  const CasinoTypeNavigator = () => {
    if(authCtx.casinoPermit.length>0){
      if(authCtx.casinoPermit[0] && authCtx.casinoPermit[0]?.visible) {
        navigation.navigate("Casino", { filter: "LIVECASINO" })
      }else{ 
        navigation.navigate('CasinoAura');
      }
    }else {
      // navigation.navigate("Casino", { filter: "LIVECASINO" })
    }
  }

  const CasinoLoginNavigator = (screen, gameId, tableId) => {
    if(authCtx.casinoPermit.length>0){
      if(authCtx.casinoPermit[0] && authCtx.casinoPermit[0]?.visible) {
        setLoginNavigation(screen, gameId, tableId)
      }else{ 
        navigation.navigate('CasinoAura');
      }
    }else {
      // setLoginNavigation(screen, gameId, tableId)
    }
  }

  


  return (
    <View style={styles.container}>
      {(Config.isWallet && Config.isCasino && (!authCtx.token || !!authCtx?.availableEventTypes['c9']))&& (
        <View style={styles.gamecontainer}>
          <View style={styles.header}>
            <View style={styles.headLogoCont}>
              <View style={styles.headLogo}>
                <Image
                  source={require("../../../assets/images/iconPNG/controller-3x.png")}
                  resizeMode="contain"
                  style={{ width: 15, height: 15, tintColor: "#DAA520" }}
                  tintColor={"#DAA520"}
                />
              </View>
            </View>
            <View style={styles.headTextCont}>
              <Text style={styles.headText}>Live Casino</Text>
            </View>
            <TouchableOpacity
              style={styles.headallCont}
              onPress={() =>
                authCtx.token === null || authCtx.token === undefined
                  ? CasinoLoginNavigator("Casino", "LIVECASINO", "")
                  : CasinoTypeNavigator()
              }
            >
              <Text style={styles.headallText}>View All Games</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.gameView}>
            <FlatList
              data={liveGame}
              style={styles.flatListStyles}
              renderItem={({ item, index }) => (
                <RenderCasinoGames
                  item={item}
                  index={index}
                  setLoginModal={(gameId, tableId) =>
                    CasinoLoginNavigator("Games", gameId, tableId)
                  }
                />
              )}
              keyExtractor={(item) => item._id}
              numColumns={3}
            />
          </View>
        </View>
      )}

      {Config.isVirtual && (!authCtx.token || !!authCtx?.availableEventTypes['v9'])&& (
        <TouchableOpacity
          onPress={() => {
            authCtx.token === null || authCtx.token === undefined
              ? LoginVirtualNavigation()
              : navigation.navigate("Live");
          }}
          style={{
            marginBottom: 10,
            overflow: "hidden",
            height: 190,
            backgroundColor: "#000",
          }}
        >
          <HomeLive />
        </TouchableOpacity>
      )}

      {/* <TouchableOpacity
        onPress={() => {
          OpenGame("SPB-aviator");
        }}
        style={styles.gameImgcontainer}
      >
        <Image
          source={require("../../../assets/images/home/aviatorBanner.jpg")}
          style={styles.bannerImg}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          OpenGame("EVP-headsandtails");
        }}
        style={styles.gameImgcontainer}
      >
        <Image
          source={{
            uri:
              "https://client.qtlauncher.com/images/?id=EVP-headsandtails_en_US&type=banner&version=1538453670896",
          }}
          style={styles.bannerImg}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          OpenGame("EVP-magicwheel");
        }}
        style={styles.gameImgcontainer}
      >
        <Image
          source={{
            uri:
              "https://client-int.qtlauncher.com/images/?id=EVP-magicwheel_en_US&type=banner&version=1667798993145",
          }}
          style={styles.bannerImg}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          OpenGame("OT-wheeloffortune");
        }}
        style={styles.gameImgcontainer}
      >
        <Image
          source={{
            uri:
              "https://client.qtlauncher.com/images/?id=OT-wheeloffortune_en_US&type=banner&version=1564541886797",
          }}
          style={styles.bannerImg}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          OpenGame("EVP-thimbles");
        }}
        style={styles.gameImgcontainer}
      >
        <Image
          source={{
            uri:
              "https://client-int.qtlauncher.com/images/?id=EVP-thimbles_en_US&type=banner&version=1667798993145",
          }}
          style={styles.bannerImg}
        />
      </TouchableOpacity> */}

      {modalVisible && (
        <LoginModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          navigationType={navigationType}
          navigationData={navigationData}
        />
      )}
    </View>
  );
};

export default memo(HomeData);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gamecontainer: {
    marginBottom: 7,
    backgroundColor: "#212A37",
  },
  header: {
    flexDirection: "row",
    marginTop: 9,
    marginBottom: 7,
    marginHorizontal: 8,
  },
  headLogoCont: {
    justifyContent: "center",
    alignItems: "center",
  },
  headLogo: {
    backgroundColor: "#364253",
    height: 30,
    width: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  headTextCont: {
    flex: 3,
    marginLeft: 8,
    justifyContent: "center",
  },
  headText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  headallCont: {
    flex: 3,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  headallText: {
    color: "#DAA520",
    fontSize: 14,
    fontWeight: "500",
  },
  gameView: {
    marginBottom: 7,
  },
  flatListStyles: {
    marginHorizontal: 7,
  },
  gameInnerView: {
    justifyContent: "center",
    alignItems: "center",
  },
  gameImage: {
    borderRadius: 10,
    height: 150,
    width: 220,
    margin: 10,
    borderWidth: 0.5,
    borderColor: "#fff",
  },
  CasinoBtn: {
    position: "absolute",

    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderColor: "#fff",
    borderRightWidth: 0.5,
    borderLeftWidth: 0.5,
    borderBottomWidth: 0.5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  CasinoBtnView: {
    backgroundColor: "#e1ad01",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginVertical: 20,
  },
  gameText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "600",
  },
  gameImgcontainer: {
    marginBottom: 7,
    backgroundColor: "#212A37",
    height: 140,
  },
  bannerImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

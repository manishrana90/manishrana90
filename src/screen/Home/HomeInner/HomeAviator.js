import { useNavigation } from "@react-navigation/native";
import React, { memo, useContext, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import LoginModal from "../../../component/UI/LoginModal";
import { AuthContext } from "../../../store/auth-context";

import TableIdList from "../../../util/casino";

const HomeAviator = () => {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const [navigationType, setNavigationTyoe] = useState("");
  const [navigationData, setNavigationData] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const setLoginNavigation = (value, gameId, tableId) => {
    setNavigationTyoe(value);
    setNavigationData({ gameId: gameId, tableId: tableId });
    setModalVisible(true);
  };

  // Aviator Game..
  const OpenGame = (value) => {
    const space = TableIdList.filter((x) => x.GameID === value);
    authCtx.token === null || authCtx.token === undefined
      ? CasinoLoginNavigator("Games", value, space.length > 0 ? space[0].TableID : "")
      : CasinoTypeNavigator(value, space.length > 0 ? space[0].TableID : "" );
  };

  const CasinoTypeNavigator = (gameId, tableId) => {
    if(authCtx.casinoPermit.length>0){
      if(authCtx.casinoPermit[0] && authCtx.casinoPermit[0]?.visible) {
        navigation.navigate("Games", { gameId: gameId, tableId: tableId });
      }else{ 
        navigation.navigate('CasinoAura');
      }
    }else {
      
      // navigation.navigate("Casino", { filter: "INSTANTWIN" });
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
      setLoginNavigation(screen, gameId, tableId)
      // setLoginNavigation(screen, gameId, tableId)
    }
  }

  const AviatorNavigate = () => {
    if(authCtx.token) {
      navigation.navigate('Aviator');
    }else {
      setNavigationTyoe('Aviator');
      setModalVisible(true);
    }
  }

  return (
    <View style={styles.container}>
      {(!!authCtx?.availableEventTypes['aviator'])&&
        <TouchableOpacity
          onPress={() => {
            AviatorNavigate();
          }}
          style={styles.gameImgcontainer}
        >
          <Image
            source={{
              uri:
                "https://client.qtlauncher.com/images/?id=SPB-aviator_en_US&type=logo-round&version=1637222094391",
            }}
            style={styles.bannerImg}
          />
        </TouchableOpacity>
      }

      <TouchableOpacity
        onPress={() => {
          OpenGame("EZU-teenpatti");
        }}
        style={styles.gameImgcontainer}
      >
        <Image
          source={{
            uri:
              "https://client-int.qtlauncher.com/images/?id=EZU-teenpatti_en_US&type=logo-round&version=1667798993145",
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
              "https://client.qtlauncher.com/images/?id=EVP-magicwheel_en_US&type=logo-round&version=1579511794642",
          }}
          style={styles.bannerImg}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          OpenGame("OT-andarbahar");
        }}
        style={styles.gameImgcontainer}
      >
        <Image
          source={{
            uri:
              "https://client-int.qtlauncher.com/images/?id=BTL-andarbahar_en_US&type=logo-round&version=1667798993145",
          }}
          style={styles.bannerImg}
        />
      </TouchableOpacity>

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

export default memo(HomeAviator);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#212A37",
    marginBottom: 8,
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
    flex: 1,
    marginHorizontal: 3,
    borderRadius: 5,
  },
  bannerImg: {
    width: "100%",
    height: 110,
    resizeMode: "contain",
  },
});

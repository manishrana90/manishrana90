import React, { useContext, useLayoutEffect, useState } from "react";
import {
  View,
  NativeModules,
  ScrollView,
  StyleSheet,
  FlatList,
  Image,
  RefreshControl,
} from "react-native";
import Toast from "react-native-toast-message";
import HomeFooter from "../Home/HomeInner/HomeFooter";
import LoginModal from "../../component/UI/LoginModal";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import RenderCasinoGames from "../../component/UI/RenderCasinoGames";
import { CasinoAPI, GetUserDetail } from "../../util/http";
import { AuthContext } from "../../store/auth-context";
import LiveHeader from "./LiveGameInner/LiveHeader";
import { Socket } from "../../util/socket";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const LiveGame = () => {
  const authCtx = useContext(AuthContext);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [liveGame, setLiveGame] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [providerList, setProviderList] = useState([]);
  const [showGame, setShowGame] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [navigationType, setNavigationTyoe] = useState("");
  const [navigationData, setNavigationData] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const onFilterProvider = (value) => {
    let firstProvider = value;
    const result = liveGame.filter((item) => item.provider.id == firstProvider);
    setSelectedId(firstProvider);
    setShowGame(result);
  };

  useLayoutEffect(() => {
    if (isFocused && authCtx.casinoAllGames != null) {
      setLiveGame(authCtx.casinoAllGames[0]);
      setProviderList(authCtx.casinoAllGames[3]);
      let firstProvider = authCtx.casinoAllGames[3][4].id;
      const result = authCtx.casinoAllGames[0].filter(
        (item) => item.provider.id == firstProvider
      );
      setSelectedId(firstProvider);
      setShowGame(result);
    } else if (isFocused && authCtx.casinoAllGames === null) {
      const NewCasinoData = async () => {
        const casinoData = await CasinoAPI();
        if (casinoData.success === true) {
          authCtx.setCasino(casinoData.games.casinogames);
          setLiveGame(casinoData.games.casinogames[0]);
          setProviderList(casinoData.games.casinogames[3]);
          let firstProvider = casinoData.games.casinogames[3][4].id;
          const result = casinoData.games.casinogames[0].filter(
            (item) => item.provider.id == firstProvider
          );
          setSelectedId(firstProvider);
          setShowGame(result);
        }
      };
      NewCasinoData();
    }
  }, [isFocused, authCtx, CasinoAPI]);

  const setLoginNavigation = (value, gameId, tableId) => {
    setNavigationTyoe(value);
    setNavigationData({ gameId: gameId, tableId: tableId });
    setModalVisible(true);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    restart();
    wait(2000).then(() => setRefreshing(false));
  }, [authCtx]);

  const restart = async () => {
    if (authCtx.token != null && authCtx.token != undefined) {
      const userData = JSON.parse(authCtx.token);

      let refreshData = {
        user: {
          _id: userData._id,
          key: userData.key,
          token: userData.verifytoken,
          details: {
            username: userData.details.username,
            role: userData.details.role,
            status: userData.details.status,
          },
        },
      };

      Socket.emit("get-user", refreshData);
      Socket.emit("refresh-balance", refreshData);

      const userDetail = await GetUserDetail({ token: userData.verifytoken });

      if (userDetail?.logout === true) {
        authCtx.logout();
        navigation.navigate("Home");
        Toast.show({
          type: "error",
          text1: "Someone Login",
          text2: `Your id has been login somewhere else.`,
        });
      }
    }
  };

  return (
    <View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyboardShouldPersistTaps="always"
        stickyHeaderIndices={[1]}
      >
        <View style={styles.casinoBanner}>
          <Image
            source={require("../../assets/images/iconPNG/CasinoBanner.png")}
            // resizeMode="contain"
            style={styles.bannerImg}
          />
        </View>
        {providerList.length > 0 ? (
          <LiveHeader
            providerList={providerList}
            selectedId={selectedId}
            onFilterProvider={(value) => onFilterProvider(value)}
          />
        ) : null}
        <View style={styles.container}>
          <View style={styles.gamecontainer}>
            <View style={styles.gameView}>
              <FlatList
                data={showGame}
                renderItem={({ item, index }) => (
                  <RenderCasinoGames
                    item={item}
                    index={index}
                    setLoginModal={(gameId, tableId) =>
                      setLoginNavigation("Games", gameId, tableId)
                    }
                  />
                )}
                keyExtractor={(item) => item.id}
                numColumns={3}
              />
            </View>
          </View>

          <LoginModal
            modalVisible={modalVisible}
            setModalVisible={() => {
              setModalVisible(false);
            }}
            navigationType={navigationType}
            navigationData={navigationData}
          />
        </View>
        <HomeFooter />
      </ScrollView>

      {/* <View style={[styles.box, { width: state.w, height: state.h }]}>
        <View style={styles.closeView}>
          {isVisible && (
            <TouchableOpacity onPress={() => onClose()} style={styles.closeBtn}>
              <Icon name="close" color={"#fff"} size={30} />
            </TouchableOpacity>
          )}
        </View>
        <View style={{ padding: 10 }}>
          <FlatList
            data={providerList}
            renderItem={RenderProvider}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
      {!isVisible && (
        <TouchableOpacity style={styles.filter} onPress={() => onFilter()}>
          <Icon name="md-color-filter-sharp" color={"#000"} size={40} />
        </TouchableOpacity>
      )} */}
    </View>
  );
};

export default LiveGame;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 6,
    backgroundColor: "#212A37",
  },
  gamecontainer: {
    // margin: 5,
    paddingTop: 7,
    paddingBottom: 9,
  },
  casinoBanner: {
    height: 115,
    width: "100%",
    // marginBottom: 7,
  },
  bannerImg: {
    width: "100%",
    height: "100%",
  },

  gameView: {
    // margin
  },
  filter: {
    position: "absolute",
    bottom: 30,
    right: 30,
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    position: "absolute",
    bottom: 30,
    right: 30,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  closeView: {
    position: "absolute",
    top: -40,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  closeBtn: {
    height: 30,
    width: 30,
    borderRadius: 50,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  providerList: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#003D82",
    borderWidth: 2,
    borderRadius: 10,
    padding: 5,
    margin: 5,
  },
  newproviderList: {
    backgroundColor: "#003D82",
  },
  providerText: {
    color: "#003D82",
    fontSize: 16,
  },
});

import React, { useContext, useLayoutEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import HomeFooter from "../Home/HomeInner/HomeFooter";
import CasinoData from "./CasinoInner/CasinoData";
import CasinoHeader from "./CasinoInner/CasinoHeader";
import Toast from "react-native-toast-message";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import LoginModal from "../../component/UI/LoginModal";
import { AuthContext } from "../../store/auth-context";
import { CasinoAPI, FilterCasinoAPI, GetUserDetail, ProviderGamesAPI } from "../../util/http";
import { Socket } from "../../util/socket";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const Casino = (props) => {
  const filter = props?.route?.params?.filter;
  const authCtx = useContext(AuthContext);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [gameFilter, setGameFilter] = useState(
    // filter === undefined ? "INSTANTWIN" : filter
    filter === undefined ? "LIVECASINO" : filter
  );
  const [liveGame, setLiveGame] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [navigationType, setNavigationTyoe] = useState("");
  const [navigationData, setNavigationData] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    if (isFocused && authCtx.casinoAllGames != null && liveGame?.length <= 0) {
      if (authCtx.token === null || authCtx.token === undefined) {
        setLiveGame(authCtx.casinoAllGames[1]);
      } else {
        FilterValue(filter === undefined ? "LIVECASINO" : filter);
      }
    } else if (
      isFocused &&
      authCtx.casinoAllGames === null &&
      liveGame.length <= 0
    ) {
      const NewCasinoData = async () => {
        const casinoData = await CasinoAPI();
        if (casinoData.success === true) {
          authCtx.setCasino(casinoData.games.casinogames);
          setLiveGame(casinoData.games.casinogames[1]);
        }
      };
      NewCasinoData();
    }
  }, [isFocused, authCtx, CasinoAPI]);

  const onFilter = (value) => {
    authCtx.token === null || authCtx.token === undefined
      ? setLoginNavigation("Casino", value, "")
      : FilterValue(value);
  };

  const FilterValue = async (value) => {
    setLoading(true);
    const token = JSON.parse(authCtx.token);

    let data = {
      // gameTypes: value,
      // user: token,
      gametype: value,
      username: token?.details?.username
    };

    // const casinoData = await FilterCasinoAPI(data);
    const casinoData = await ProviderGamesAPI(data)
    if (casinoData.success === true) {
      setGameFilter(value);
      casinoData?.data?.items && setLiveGame(casinoData.data.items);
    }
    setLoading(false);
  };

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

      setRefreshing(false);
    } else {
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <CasinoHeader
        gameFilter={gameFilter}
        filterCasino={(value) => onFilter(value)}
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyboardShouldPersistTaps="always"
      >
        <CasinoData
          allGame={liveGame}
          setModalVisible={(gameId, tableId) =>
            setLoginNavigation("Games", gameId, tableId)
          }
        />
        <HomeFooter />
      </ScrollView>
      <LoginModal
        modalVisible={modalVisible}
        setModalVisible={() => {
          setModalVisible(false);
        }}
        navigationType={navigationType}
        navigationData={navigationData}
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

export default Casino;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

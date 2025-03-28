import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";

import { useDispatch, useSelector } from "react-redux";

import { Socket } from "../../../util/socket";
import LoginModal from "../../../component/UI/LoginModal";
import RenderSports from "../../../component/UI/RenderSports";
import SportsInplay from "./SportsInplay";
import { Config } from "../../../../config";
import { AuthContext } from "../../../store/auth-context";

const SportsPlay = () => {
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext);
  const { inPlay, cricket, soccer, tennis } = useSelector(
    (state) => state.allMarket
  );

  const isFocused = useIsFocused();
  const [gameType, setGameType] = useState(4);
  const [modalVisible, setModalVisible] = useState(false);
  const [gameId, setGameId] = useState("");
  const [gameData, setGameData] = useState({eventId: '', eventTypeId: ''});
  const [navigationType, setNavigationType] = useState("");

  useEffect(() => {
    const inPlayMarkets = (...args) => {

      dispatch({
        type: "INPLAY",
        payload: args[0],
      });
      dispatch({
        type: "CRICKET",
        payload: args[0][0],
      });
      dispatch({
        type: "SOCCER",
        payload: args[0][1],
      });
      dispatch({
        type: "TENNIS",
        payload: args[0][2],
      });
    };

    Socket.on("get-freehomemarkets-success", inPlayMarkets);

    return () => {
      Socket.off("get-freehomemarkets-success", inPlayMarkets);
    };
  }, [Socket]);

  useLayoutEffect(() => {
    if (isFocused) {
      let data = {
        filter: {
          managers: Config.ManagerName,
          eventTypeId: { $nin: ["t9", "4321"] },
          visible: true,
          deleted: false,
          marketType: { $in: ["MATCH_ODDS", "TOURNAMENT_WINNER"] },
          "marketBook.status": { $ne: "CLOSED" },
          // "marketBook.inplay": true,
        },
        sort: { openDate: 1 },
      };
      Socket.emit("get-free-home-markets", data);
    }
  }, [isFocused, Socket]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.gamecontainer}>
          <View style={styles.header}>
            <TouchableOpacity
              style={[
                styles.headerCont,
                gameType === 4 && { borderColor: "#fff", borderWidth: 1 },
              ]}
              onPress={() => setGameType(4)}
            >
              <View style={styles.headLogoCont}>
                <View style={styles.headLogo}>
                  <Image
                    source={require("../../../assets/images/navigationIcon/vGamesIcon3x.png")}
                    resizeMode="contain"
                    style={{ width: 15, height: 15, tintColor: "#DAA520" }}
                  />
                </View>
              </View>
              <View style={styles.headTextCont}>
                <Text style={styles.headText}>INPLAY</Text>
              </View>
            </TouchableOpacity>
            
            {(!authCtx.token || !!authCtx?.availableEventTypes['4'])&&
              <TouchableOpacity
                style={[
                  styles.headerCont,
                  gameType === 0 && { borderColor: "#fff", borderWidth: 1 },
                ]}
                onPress={() => setGameType(0)}
              >
                <View style={styles.headLogoCont}>
                  <View style={styles.headLogo}>
                    <Image
                      source={require("../../../assets/images/iconPNG/cricket-3x.png")}
                      resizeMode="contain"
                      style={{ width: 15, height: 15, tintColor: "#DAA520" }}
                      tintColor={"#DAA520"}
                    />
                  </View>
                </View>
                <View style={styles.headTextCont}>
                  <Text style={styles.headText}>CRICKET</Text>
                </View>
              </TouchableOpacity>
            }
            {(!authCtx.token || !!authCtx?.availableEventTypes['1'])&&
              <TouchableOpacity
                style={[
                  styles.headerCont,
                  gameType === 1 && { borderColor: "#fff", borderWidth: 1 },
                ]}
                onPress={() => setGameType(1)}
              >
                <View style={styles.headLogoCont}>
                  <View style={styles.headLogo}>
                    <Image
                      source={require("../../../assets/images/iconPNG/soccer-icon.png")}
                      resizeMode="contain"
                      style={{ width: 15, height: 15, tintColor: "#DAA520" }}
                    />
                  </View>
                </View>
                <View style={styles.headTextCont}>
                  <Text style={styles.headText}>SOCCER</Text>
                </View>
              </TouchableOpacity>
            }
            {(!authCtx.token || !!authCtx?.availableEventTypes['2'])&&
              <TouchableOpacity
                style={[
                  styles.headerCont,
                  gameType === 2 && { borderColor: "#fff", borderWidth: 1 },
                ]}
                onPress={() => setGameType(2)}
              >
                <View style={styles.headLogoCont}>
                  <View style={styles.headLogo}>
                    <Image
                      source={require("../../../assets/images/iconPNG/tennis-icon.png")}
                      resizeMode="contain"
                      style={{ width: 15, height: 15, tintColor: "#DAA520" }}
                    />
                  </View>
                </View>
                <View style={styles.headTextCont}>
                  <Text style={styles.headText}>TENNIS</Text>
                </View>
              </TouchableOpacity>
            }
          </View>
          <View style={styles.gameView}>
            {gameType === 4 ? (
              <>
                {inPlay.length > 0 ? (
                  <FlatList
                    data={inPlay}
                    renderItem={({ item, index }) => (
                      <SportsInplay
                        data={item}
                        index={index}
                        setModalVisible={(value) => {
                          setModalVisible(true);
                          setGameId(value);
                          setGameData({ eventId: value, eventTypeId: '4' })
                        }}
                      />
                    )}
                    keyExtractor={(item) => item._id}
                  />
                ) : (
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      height: 300,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: "#fff",
                        fontSize: 24,
                        paddingHorizontal: 10,
                      }}
                    >
                      There are currently no matches in progress
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <>
                {(gameType === 0 ? cricket : gameType === 1 ? soccer : tennis)
                  .length > 0 ? (
                  <FlatList
                    data={
                      gameType === 0
                        ? cricket
                        : gameType === 1
                        ? soccer
                        : tennis
                    }
                    renderItem={({ item, index }) => (
                      <RenderSports
                        item={item}
                        setModalVisible={(value) => {
                          setModalVisible(true);
                          setGameId(value);
                          setNavigationType("cricket");
                          setGameData({ eventId: value, eventTypeId: '4' })
                        }}
                      />
                    )}
                    keyExtractor={(item) => item._id}
                  />
                ) : (
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      height: 300,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: "#fff",
                        fontSize: 24,
                        paddingHorizontal: 10,
                      }}
                    >
                      There are no matches available
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
        <LoginModal
          modalVisible={modalVisible}
          setModalVisible={() => {
            setModalVisible(false);
            setNavigationType("");
          }}
          navigationType={"cricket"}
          navigationData={gameData}
          // navigationData={{ eventId: gameId }}
        />
      </View>
    </>
  );
};

export default SportsPlay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#212A37",
    paddingBottom: 12,
    marginBottom: 7,
  },
  gamecontainer: {},
  header: {
    flexDirection: "row",
    marginVertical: 9,
    marginHorizontal: 4,
  },
  headerCont: {
    flex: 1,
    backgroundColor: "#364253",
    // flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  headLogoCont: {
    justifyContent: "center",
    alignItems: "center",
  },
  headLogo: {
    backgroundColor: "#364253",
    height: 20,
    width: 20,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  headTextCont: {
    flex: 3,
    // marginLeft: 8,
    justifyContent: "center",
    // backgroundColor: 'red',
  },
  headText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  headallCont: {
    flex: 3,
    alignItems: "flex-end",
    justifyContent: "center",
    backgroundColor: "yellow",
  },
  headallText: {
    color: "#DAA520",
    fontSize: 14,
    fontWeight: "500",
  },
  gameView: {},
  gameInnerView: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 10,
    flexDirection: "row",
  },
  gameText: {
    flex: 1,
    color: "#000",
    fontSize: 14,
    fontWeight: "500",
    margin: 8,
    alignSelf: "center",
    textAlign: "center",
  },
  iconCont: {
    flexDirection: "row",
  },
  iconView: {
    margin: 5,
    height: 45,
    width: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#c2c6d1",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
});

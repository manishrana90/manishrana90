import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import { useDispatch, useSelector } from "react-redux";

import { Socket } from "../../../util/socket";
import LoginModal from "../../../component/UI/LoginModal";
import RenderInplaySports from "../../../component/UI/RenderInplaySports";
import { Config } from "../../../../config";
import { AuthContext } from "../../../store/auth-context";

const InPlay = () => {
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const { cricket, soccer, tennis } = useSelector((state) => state.allMarket);
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const [gameId, setGameId] = useState("");
  const [gameData, setGameData] = useState({eventId: '', eventTypeId: ''});

  useEffect(() => {
    
    const homeMarkets = (...args) => {
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

    const homeStakeSet = (...args) => {
      if (args[0].data.stake_array.length > 0) {
        let newArray = [];
        args[0].data.stake_array.forEach((item, index) => {
          newArray.push({ amount: item, indexAt: index });
        });
        let item = { amount: "Edit", indexAt: `edit` };
        newArray.push(item);
        dispatch({
          type: "ALLSTAKES",
          payload: newArray,
        });
      }
    };

    Socket.on("get-freehomemarkets-success", homeMarkets);
    Socket.on("get-stake-success", homeStakeSet);

    return () => {
      Socket.off("get-freehomemarkets-success", homeMarkets);
      Socket.off("get-stake-success", homeStakeSet);
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
        },
        sort: { openDate: 1 },
      };
      Socket.emit("get-free-home-markets", data);
    }
  }, [isFocused, Socket]);

  const checLength = (data) => {
    const filteredData = data.filter((item) => {
      let startdate = new Date(item?.openDate);
      let durationInMinutes = 15;
      startdate.setMinutes(startdate.getMinutes() - durationInMinutes);

      // return item?.marketBook?.inplay !== false || startdate < new Date();
      return item?.marketBook?.inplay == true;
    });

    const dataLength = filteredData.length;
    return dataLength;
  };

  return (
    <>
      {(checLength(cricket) > 0 && (!authCtx.token || !!authCtx?.availableEventTypes['4'])) && (
        <View style={styles.container}>
          <View style={styles.gamecontainer}>
            <View style={styles.header}>
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
                <Text style={styles.headText}>Cricket</Text>
              </View>
            </View>
            <View style={styles.gameView}>
              <FlatList
                data={cricket}
                renderItem={({ item, index }) => (
                  <RenderInplaySports
                    item={item}
                    setModalVisible={(value) => {
                      setModalVisible(true);
                      // setGameId(value);
                      setGameData({ eventId: value, eventTypeId: '4' })
                    }}
                  />
                )}
                keyExtractor={(item) => item._id}
              />
            </View>
          </View>
        </View>
      )}
      {(checLength(soccer) > 0 && (!authCtx.token || !!authCtx?.availableEventTypes['1'])) && (
        <View style={styles.container}>
          <View style={styles.gamecontainer}>
            <View style={styles.header}>
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
                <Text style={styles.headText}>Football</Text>
              </View>
            </View>
            <View style={styles.gameView}>
              <FlatList
                data={soccer}
                renderItem={({ item, index }) => (
                  <RenderInplaySports
                    item={item}
                    setModalVisible={(value) => {
                      setModalVisible(true);
                      // setGameId(value);
                      setGameData({ eventId: value, eventTypeId: '1' })
                    }}
                  />
                )}
                keyExtractor={(item) => item._id}
              />
            </View>
          </View>
        </View>
      )}
      {(checLength(tennis) > 0 && (!authCtx.token || !!authCtx?.availableEventTypes['2'])) && (
        <View style={styles.container}>
          <View style={styles.gamecontainer}>
            <View style={styles.header}>
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
                <Text style={styles.headText}>Tennis</Text>
              </View>
              {/* <View style={styles.headallCont}>
                <Text style={styles.headallText}>View All {tennis.length} games</Text>
              </View> */}
            </View>
            <View style={styles.gameView}>
              <FlatList
                data={(Array.isArray(tennis))? tennis?.filter((item) => item?.marketBook?.inplay) : []}
                renderItem={({ item, index }) => (
                  <RenderInplaySports
                    item={item}
                    setModalVisible={(value) => {
                      setModalVisible(true);
                      // setGameId(value);
                      setGameData({ eventId: value, eventTypeId: '2' })
                    }}
                  />
                )}
                keyExtractor={(item) => `${item?._id}_${item?.competitionId}`}
              />
            </View>
          </View>
        </View>
      )}
      
      

      {modalVisible && (
        <LoginModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          navigationType={"cricket"}
          navigationData={gameData}
          // navigationData={{ eventId: gameId }}
        />
      )}
    </>
  );
};

export default InPlay;

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
    // backgroundColor: 'red',
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
    // backgroundColor: 'yellow',
  },
  headallText: {
    color: "#FFBF00",
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

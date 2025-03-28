import React, { useContext } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthContext } from "../../store/auth-context";
import { useNavigation } from "@react-navigation/native";
import TableIdList from "../../util/casino";

const windowWidth = Dimensions.get("window").width;

const RenderCasinoGames = ({ item, index, setLoginModal }) => {
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();

  let image =
    item.images && item.images.length > 0
      ? item.images.find((item) => item.type === "logo-square")
      : "";

  const OpenGame = (value) => {
    const space = TableIdList.filter((x) => x.GameID === value);
    authCtx.token === null || authCtx.token === undefined
      ? setLoginModal(value, space.length > 0 ? space[0].TableID : "")
      : CasinoTypeNavigator(value, space.length > 0 ? space[0].TableID : "");
  };

  const CasinoTypeNavigator = (gameId, tableId) => {
    if(authCtx.casinoPermit.length>0){
      if(authCtx.casinoPermit[0] && authCtx.casinoPermit[0]?.visible) {
        navigation.navigate("Games", { gameId: gameId, tableId: tableId});
      }else{ 
        navigation.navigate('CasinoAura');
      }
    }else {
      navigation.navigate("Games", { gameId: gameId, tableId: tableId});
    }
  }

  if (item.images != undefined && image != undefined) {
    return (
      <>
        <TouchableOpacity
          style={styles.gameInnerView}
          onPress={() => {OpenGame(item.id); }}
        >
          <Image style={styles.gameImage} source={{ uri: image.url }} />
          {/* <View style={styles.CasinoBtn}>
          <TouchableOpacity
            style={styles.CasinoBtnView}
            onPress={() => OpenGame(item.id)}
          >
            <Text style={styles.gameText}>Play Now</Text>
          </TouchableOpacity>
        </View> */}
        </TouchableOpacity>
      </>
    );
  } else {
    return <></>;
  }
};

export default RenderCasinoGames;

const styles = StyleSheet.create({
  gameInnerView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 5,
    // borderWidth: 0.5,
    // borderColor: "#fff",
    borderRadius: 5,
    // backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  gameImage: {
    flex: 1,
    borderRadius: 5,
    height: 91,
    width: "100%",
  },
  CasinoBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
});

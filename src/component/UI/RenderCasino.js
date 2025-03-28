import { useNavigation } from "@react-navigation/native";
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
import TableIdList from "../../util/casino";

const windowWidth = Dimensions.get("window").width;

const RenderCasino = ({ item, index, setLoginModal }) => {
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();
  // console.log(item.images);
  let image =
    item.images && item.images.length > 0
      ? item.images.find((item) => item.type === "banner")
      : "";

  const OpenGame = (value) => {
    const space = TableIdList.filter((x) => x.GameID === value);

    authCtx.token === null || authCtx.token === undefined
      ? setLoginModal(value, space.length > 0 ? space[0].TableID : "")
      : navigation.navigate("Games", {
          gameId: value,
          tableId: space.length > 0 ? space[0].TableID : "",
        });
  };

  if (item.images != undefined && image != undefined) {
    return (
      <TouchableOpacity
        style={styles.gameInnerView}
        onPress={() => OpenGame(item.id)}
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
    );
  } else {
    return <></>;
  }
};

export default RenderCasino;

const styles = StyleSheet.create({
  gameInnerView: {
    justifyContent: "center",
    alignItems: "center",
  },
  gameImage: {
    borderRadius: 5,
    height: 91,
    width: windowWidth / 3,
    marginHorizontal: 4,
  },
});

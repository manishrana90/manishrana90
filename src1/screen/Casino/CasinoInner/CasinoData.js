import React from "react";
import { StyleSheet, View, FlatList } from "react-native";
import RenderCasinoGames from "../../../component/UI/RenderCasinoGames";

const CasinoData = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.gamecontainer}>
        <FlatList
          data={props.allGame}
          renderItem={({ item, index }) => (
            <RenderCasinoGames
              item={item}
              index={index}
              setLoginModal={(gameId, tableId) =>
                props.setModalVisible(gameId, tableId)
              }
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={3}
        />
      </View>
    </View>
  );
};

export default CasinoData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gamecontainer: {
    marginHorizontal: 3,
    backgroundColor: "#212A37",
    marginBottom: 6,
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
  },
  headLogoCont: {
    flex: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  headLogo: {
    backgroundColor: "#151d30",
    borderRadius: 10,
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headTextCont: {
    flex: 7,
    justifyContent: "center",
  },
  headText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  headallCont: {
    flex: 3,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  headallHeading: {
    color: "#00b4d8",
    fontSize: 12,
    fontWeight: "700",
  },
  headallText: {
    color: "#c2c6d1",
    fontSize: 12,
    fontWeight: "700",
  },
  gameView: {
    flexWrap: "wrap",
    flexDirection: "row",
  },
  gameInnerView: {
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  gameImage: {
    borderRadius: 10,
    height: 150,
    width: "92%",
    margin: 10,
  },
  gameText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});

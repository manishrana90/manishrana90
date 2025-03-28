import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import "moment-timezone";
import BetHistoryCard from "./BetHistoryCard";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../store/auth-context";
import { Socket } from "../../util/socket";

const AccountBetShow = (props) => {
    const { marketId, eventTypeName } = props.route.params;
  const authCtx = useContext(AuthContext);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [betHistory, setBetHistory] = useState([]);

  useEffect(() => {
    if (authCtx.token === null || authCtx.token === undefined) {
      navigation.navigate("Home");
    }

    const betHistoryLogs = (...args) => {
      setLoading(false);
      setBetHistory(args[0]);
    };
    Socket.on("get-bets-success", betHistoryLogs);

    return () => {
      Socket.off("get-bets-success", betHistoryLogs);
    };
  }, [Socket, authCtx]);

  useLayoutEffect(() => {
    if (isFocused) {
      const getuserTransaction = async () => {
        const token = JSON.parse(authCtx.token);
        let data = {
          user: {
            _id: token._id,
            key: token.key,
            details: {
              username: token.details.username,
              role: token.details.role,
              status: token.details.status,
            },
          },
          // filter: {
          //   username: token.details.username,
          //   status: "MATCHED",
          //   deleted: false,
          //   result: { $ne: "ACTIVE" },
          //   marketId: marketId,
          // },
          // sort: { _id: -1 },
        };

        if(eventTypeName === 'Casino') {
          data['filter'] = {
            username: token.details.username,
            deleted: false,
            marketId: marketId,
          };
          data['sort'] = {
            betentertime: -1,
          };
        }else{
          data['filter'] =  {
            username: token.details.username,
            status: "MATCHED",
            deleted: false,
            result: { $ne: "ACTIVE" },
            marketId: marketId,
          };
          data['sort'] = {
            _id: -1,
          }
        }

        setLoading(true);
        Socket.emit("get-bets", data);
      };
      getuserTransaction();
    }
  }, [isFocused, Socket, marketId]);

  return (
    <View style={styles.mainView}>
      <View style={styles.betHistoryTextViewHolder}>
        <Text style={styles.betHistoryText}>Bets History</Text>
      </View>

      {betHistory.length > 0 ? (
        <FlatList
          contentContainerStyle={styles.flatListStyles}
          data={betHistory}
          keyExtractor={(item) => item.betMessage}
          renderItem={({ item }) => {
            return <BetHistoryCard item={item} />;
          }}
        />
      ) : (
        <Text style={styles.noData}>No bets found</Text>
      )}

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

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  betHistoryTextViewHolder: {
    marginTop: 14,
    marginBottom: 10,
    alignItems: "center",
  },
  betHistoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
  paymentTypeButtonHolder: {
    padding: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  buttonPressable: {
    flex: 1,
    flexDirection: "row",
    marginHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 4,
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  paymentButtonText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: "#fff",
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  flatListStyles: {
    paddingTop: 10,
    paddingBottom: 40,
  },
  noData: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
    marginHorizontal: 10,
    marginTop: 40,
    textAlign: "center",
  },
});

export default AccountBetShow;

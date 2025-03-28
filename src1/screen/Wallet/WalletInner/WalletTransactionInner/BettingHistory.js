import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import "moment-timezone";
import Icons from "react-native-vector-icons/FontAwesome";
import BetHistoryCard from "../../../../component/UI/BetHistoryCard";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../../../store/auth-context";
import { Socket } from "../../../../util/socket";

const BettingHistory = () => {
  const authCtx = useContext(AuthContext);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("start");
  const [date, setDate] = useState({
    start: new Date(moment(new Date()).subtract(7, "day").format("YYYY-MM-DD")),
    end: new Date(moment(new Date()).add(1, "day").format("YYYY-MM-DD")),
  });
  const [open, setOpen] = useState(false);
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
          filter: {
            username: token.details.username,
            result: { $ne: "ACTIVE" },
            placedTime: {
              $gte: moment(date.start).format("YYYY-MM-DD"),
              $lte: moment(date.end).format("YYYY-MM-DD"),
            },
            // status: "MATCHED",
            // deleted: false,
            // matchedTime: {
            //   $gte: moment(date.start).format("YYYY-MM-DD"),
            //   $lte: moment(date.end).format("YYYY-MM-DD"),
            // },
          },
          sort: { 
            betentertime: -1,
            // _id: -1
          },
        };
        setLoading(true);
        Socket.emit("get-bets", data);
      };
      getuserTransaction();
    }
  }, [isFocused, Socket]);

  const onFilterSubmit = async () => {
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
      filter: {
        username: token.details.username,
        status: "MATCHED",
        deleted: false,
        result: { $ne: "ACTIVE" },
        matchedTime: {
          $gte: moment(date.start).format("YYYY-MM-DD"),
          $lte: moment(date.end).format("YYYY-MM-DD"),
        },
      },
      sort: { _id: -1 },
    };
    setLoading(true);
    Socket.emit("get-bets", data);
  };

  return (
    <View style={styles.mainView}>
      <View style={styles.betHistoryTextViewHolder}>
        <Text style={styles.betHistoryText}>Bets History</Text>
      </View>

      <View style={styles.paymentTypeButtonHolder}>
        <TouchableOpacity
          style={styles.buttonPressable}
          onPress={() => {
            setOpen(true);
            setSelected("start");
          }}
        >
          <Text style={styles.paymentButtonText}>
            {moment(date.start).format("DD MMM YYYY")}
          </Text>
          <Icons name="calendar" size={14} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonPressable}
          onPress={() => {
            setOpen(true);
            setSelected("end");
          }}
        >
          <Text style={styles.paymentButtonText}>
            {moment(date.end).format("DD MMM YYYY")}
          </Text>
          <Icons name="calendar" size={14} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => onFilterSubmit()}
        >
          <Icons name="check" size={14} color="#000" />
        </TouchableOpacity>
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
        <Text style={styles.noData}>
          No bets found between {moment(date.start).format("DD MMM YYYY")} to{" "}
          {moment(date.end).format("DD MMM YYYY")}{" "}
        </Text>
      )}

      <DatePicker
        modal
        mode={"date"}
        open={open}
        date={date[selected]}
        onConfirm={(dateselected) => {
          setOpen(false);
          setDate({
            ...date,
            [selected]: dateselected,
          });
        }}
        onCancel={() => {
          setOpen(false);
        }}
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

export default BettingHistory;

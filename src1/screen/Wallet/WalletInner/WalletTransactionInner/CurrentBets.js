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
import { Dropdown } from "react-native-element-dropdown";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../../../store/auth-context";
import { Socket } from "../../../../util/socket";
import CurrentBetCard from "../../../../component/UI/CurrentBetCard";

const bankList = [
  {
    label: "Matched",
    value: 0,
  },
  { label: "Fancy", value: 1 },
  { label: "Deleted", value: 2 },
];

const CurrentBets = () => {
  const authCtx = useContext(AuthContext);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState({
    label: "Matched",
    value: 0,
  });
  const [betHistory, setBetHistory] = useState([]);

  useEffect(() => {
    const handleCurrentGetBets = (...args) => {
      setLoading(false);
      setBetHistory(args[0]);
    };

    Socket.on("get-bets-success", handleCurrentGetBets);

    if (authCtx.token === null || authCtx.token === undefined) {
      navigation.navigate("Home");
    }

    return () => {
      Socket.off("get-bets-success", handleCurrentGetBets);
    };
  }, [Socket, authCtx.token, navigation]);

  useLayoutEffect(() => {
    if (isFocused) {
      const getuserTransaction = async () => {
        const token = JSON.parse(authCtx.token);
        let betData = {
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
            status: "MATCHED",
            username: token.details.username,
            deleted: false,
            result: "ACTIVE",
          },
          sort: { placedTime: -1 },
        };
        setLoading(true);
        Socket.emit("get-bets", betData);
      };
      getuserTransaction();
    }
  }, [isFocused, Socket]);

  const onFilterSubmit = async () => {
    const token = JSON.parse(authCtx.token);
    let betData = {
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
        status: "MATCHED",
        username: token.details.username,
        deleted: date.value === 2 ? true : false,
        result: "ACTIVE",
      },
      sort: { placedTime: -1 },
    };
    if (date.value === 1) {
      betData.filter.marketType = "SESSION";
    }
    setLoading(true);
    Socket.emit("get-bets", betData);
  };

  return (
    <View style={styles.mainView}>
      <View style={styles.betHistoryTextViewHolder}>
        <Text style={styles.betHistoryText}>Current Bets</Text>
      </View>

      <View style={styles.paymentTypeButtonHolder}>
        <View style={styles.buttonPressable}>
          <Dropdown
            placeholderStyle={[styles.textInputStyle, { color: "#959CA7" }]}
            selectedTextStyle={styles.textInputStyle}
            itemContainerStyle={styles.dropdownItemContainerStyle}
            itemTextStyle={styles.textInputStyle}
            data={bankList}
            maxHeight={400}
            labelField="label"
            valueField="value"
            placeholder="Select Bank"
            value={date}
            onChange={(value) => setDate(value)}
          />
        </View>

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
            return <CurrentBetCard item={item} />;
          }}
        />
      ) : (
        <Text style={styles.noData}>No bets found.</Text>
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
    marginHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
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
  textInputStyle: {
    padding: 0,
    fontSize: 12,
    color: "#000",
    fontWeight: "500",
  },
  dropdownItemContainerStyle: {
    justifyContent: "center",
    height: 50,
    borderBottomWidth: 1,
    borderColor: "#eaedf6",
  },
});

export default CurrentBets;

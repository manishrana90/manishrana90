import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import moment from "moment";
import "moment-timezone";
import { Socket } from "../../../../util/socket";
import { AuthContext } from "../../../../store/auth-context";

const LoopReferralHistory = ({ data, s_no }) => {
  const formattedDate = moment(data?.time).format("MMM DD, YYYY, h:mm:ss A");

  return (
    <>
      <View style={styles.refferHeading}>
        <View style={[styles.head, { width: "10%" }]}>
          <Text style={styles.headText}>{s_no + 1}</Text>
        </View>
        <View style={styles.head}>
          <Text style={styles.headText}>{formattedDate}</Text>
        </View>
        <View style={styles.head}>
          <Text style={styles.headText}>{data?.username}</Text>
        </View>
        <View style={styles.head}>
          <Text style={styles.headText}>{data?.eventName}</Text>
        </View>
        <View style={styles.head}>
          <Text style={styles.headText}>{data?.marketName}</Text>
        </View>
        <View style={styles.head}>
          <Text style={styles.headText}>{data?.settle_amount}</Text>
        </View>
      </View>
    </>
  );
};

const LoopHeader = () => {
  return (
    <>
      <View style={styles.refferHeading}>
        <View style={[styles.heads, { width: "10%" }]}>
          <Text style={styles.headTextss}>S.N.</Text>
        </View>
        <View style={styles.heads}>
          <Text style={styles.headTextss}>Time</Text>
        </View>
        <View style={styles.heads}>
          <Text style={styles.headTextss}>Username</Text>
        </View>
        <View style={styles.heads}>
          <Text style={styles.headTextss}>Event Name</Text>
        </View>
        <View style={styles.heads}>
          <Text style={styles.headTextss}>Market Name</Text>
        </View>
        <View style={styles.heads}>
          <Text style={styles.headTextss}>P/L</Text>
        </View>
      </View>
    </>
  );
};

const ReferalHistory = ({ route, navigation }) => {
  const { userId } = route.params;
  const authCtx = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState("0");

  useEffect(() => {
    if (authCtx.token === null || authCtx.token === undefined) {
      navigation.navigate("Home");
    }

    const referalHistory = (...args) => {
      setData(args[0]);
      if (args[0]?.total.length > 0) {
        setTotal(args[0]?.total[0]?.total);
      }
    };
    Socket.on("get-referals-history-success", referalHistory);

    return () => {
      Socket.off("get-referals-history-success", referalHistory);
    };
  }, [Socket, authCtx]);

  useLayoutEffect(() => {
    if (isFocused === true) {
      async function token() {
        let tokendata = JSON.parse(authCtx.token);

        let userdata = {
          _id: userId,
          user: {
            _id: tokendata._id,
            key: tokendata.key,
            details: {
              username: tokendata.details.username,
              role: tokendata.details.role,
              status: tokendata.details.status,
            },
          },
          sort: { time: -1 },
        };

        Socket.emit("get-referal-history", userdata);
      }

      token();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profile}>
          <View style={styles.leftamount}>
            <Text style={styles.InnerText}>Total: {total}</Text>
          </View>
        </View>
      </View>

      <View style={styles.passContainer}>
        <FlatList
          data={data?.logList}
          ListHeaderComponent={LoopHeader}
          KeyExtractor={(item) => item?._id}
          renderItem={({ item, index }) => {
            return <LoopReferralHistory data={item} s_no={index} />;
          }}
        />
      </View>
    </View>
  );
};

export default ReferalHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    // backgroundColor: "#000",
  },
  heading: {
    flexDirection: "row",
    margin: 10,
  },
  headback: {
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  headtext: {
    width: "80%",

    justifyContent: "center",
    alignItems: "center",
  },
  InnerText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  profile: {
    margin: 10,
    flexDirection: "row",
  },
  leftamount: {
    justifyContent: "center",
    alignItems: "center",
  },
  rightamount: {
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutView: {
    margin: 10,
  },
  inputButtonCont: {
    marginHorizontal: 5,
  },
  pressed: {
    opacity: 0.75,
    backgroundColor: "#fff",
    borderRadius: 4,
  },

  passContainer: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
  refferHeading: {
    flexDirection: "row",
    marginLeft: 2,
    marginRight: 2,
  },
  head: {
    width: "18%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 2,
  },
  heads: {
    width: "18%",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#000",
    borderColor: "#f2b71a",
    borderWidth: 1,
    borderRadius: 2,
  },
  head1: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#000",
    borderColor: "#f2b71a",
    borderWidth: 1,
    justifyContent: "center",
    margin: 0.5,
  },
  headText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "250",
    margin: 6,
  },
  headTextss: {
    fontSize: 12,
    color: "#f2b71a",
    margin: 6,
  },
});

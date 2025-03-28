import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import { AuthContext } from "../../../../store/auth-context";
import { Socket } from "../../../../util/socket";
import FixDepositInner from "../../../../component/UI/FixDepositInner";

function FixDepositReport() {
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const [days, setDays] = useState("1");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authCtx.token === null || authCtx.token === undefined) {
      navigation.navigate("Home");
    }

    const getFixedDepositSuccess = (...args) => {
      if (args[0].success === true) {
        setLoading(false);
        setData(args[0].data);
        setTotal(args[0].total);
      }
    };
    Socket.on("get-fixed-deposit-report-success", getFixedDepositSuccess);

    return () => {
      Socket.off("get-fixed-deposit-report-success", getFixedDepositSuccess);
    };
  }, [Socket, authCtx]);

  async function submitHandler(text) {
    setDays(text);
    let tokendata = JSON.parse(authCtx.token);

    let userdata = {
      user: {
        _id: tokendata._id,
        key: tokendata.key,
        details: {
          username: tokendata.details.username,
          role: tokendata.details.role,
          status: tokendata.details.status,
        },
      },
      filter: {
        username: tokendata.details.username,
        deleted: false,
        time: {
          $gte: new Date(new Date().getTime() - text * 24 * 60 * 60 * 1000),
        },
      },
      sort: { time: -1 },
    };
    setLoading(true);
    Socket.emit("get-fixed-depsoit-report", userdata);
  }

  useLayoutEffect(() => {
    if (isFocused === true) {
      async function token() {
        let tokendata = JSON.parse(authCtx.token);

        let userdata = {
          user: {
            _id: tokendata._id,
            key: tokendata.key,
            details: {
              username: tokendata.details.username,
              role: tokendata.details.role,
              status: tokendata.details.status,
            },
          },
          filter: {
            username: tokendata.details.username,
            deleted: false,
            time: {
              $gte: new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000),
            },
          },
          sort: { time: -1 },
        };
        setLoading(true);
        Socket.emit("get-fixed-depsoit-report", userdata);
      }

      token();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <View style={styles.heading1}>
          <Text style={styles.headingText}>Days:</Text>
        </View>
        {/* <View style={styles.boxday}> */}
        <Pressable
          style={[styles.daysBox, days === "1" ? styles.boxday : ""]}
          onPress={() => {
            submitHandler("1");
          }}
        >
          <Text style={styles.daysText}>01</Text>
        </Pressable>
        {/* </View> */}
        <Pressable
          style={[styles.daysBox, days === "7" ? styles.boxday : ""]}
          onPress={() => {
            submitHandler("7");
          }}
        >
          <Text style={styles.daysText}>07</Text>
        </Pressable>
        <Pressable
          style={[styles.daysBox, days === "15" ? styles.boxday : ""]}
          onPress={() => {
            submitHandler("15");
          }}
        >
          <Text style={styles.daysText}>15</Text>
        </Pressable>
        <Pressable
          style={[styles.daysBox, days === "30" ? styles.boxday : ""]}
          onPress={() => {
            submitHandler("30");
          }}
        >
          <Text style={styles.daysText}>30</Text>
        </Pressable>
      </View>
      <View style={styles.totalstyle}>
        <Text style={{ color: "#000", fontWeight: "bold", fontSize: 14 }}>
          Total: {Number(total).toFixed(2)}
        </Text>
      </View>
      <ScrollView>
        {loading ? (
          <View style={styles.dropdown}>
            <ActivityIndicator size={30} color="#fbb845" />
          </View>
        ) : (
          <View>
            {data.map((a) => {
              return (
                <View key={a._id}>
                  <FixDepositInner data={a} />
                </View>
              );
            })}
            {data.length <= 0 && (
              <View style={styles.nofound}>
                <Text style={styles.nofound}>No data Found !</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

export default FixDepositReport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  heading: {
    backgroundColor: "#212a37",
    flexDirection: "row",
    margin: 10,
    borderColor: "#fff",
    borderWidth: 0.7,
  },
  heading1: {
    backgroundColor: "#212a37",
  },
  headingText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginHorizontal: 15,
    marginVertical: 10,
  },
  daysBox: {
    marginHorizontal: 18,
    marginVertical: 8,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#f2b71a",
    borderRadius: 30,
  },
  boxday: {
    backgroundColor: "#f2b71a",
  },
  daysText: {
    marginHorizontal: 8,
    marginVertical: 7,
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  totalstyle: {
    backgroundColor: "#f2b71a",
    marginHorizontal: 8,
    marginBottom: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: "center",
  },
  nofound: {
    alignItems: "center",
    padding: 32,
    color: "#f2b71a",
  },
  dropdown: {
    padding: 32,
  },
});

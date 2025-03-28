import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useIsFocused } from "@react-navigation/native";

import { AuthContext } from "../../../../store/auth-context";
import { Socket } from "../../../../util/socket";
import RefferInner from "../../../../component/UI/RefferInner";

function Reffer({ navigation }) {
  const authCtx = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState("0");

  const isFocused = useIsFocused();

  useEffect(() => {
    if (authCtx.token === null || authCtx.token === undefined) {
      navigation.navigate("Home");
    }

    const getLogStateMentSuccess = (...args) => {
      setData(args[0]);

      let amount = 0;
      args[0].map((a) => {
        amount = amount + a.amount;
      });
      setTotal(amount);
    };
    Socket.on("get-logsettlement-success", getLogStateMentSuccess);

    return () => {
      Socket.off("get-logsettlement-success", getLogStateMentSuccess);
    };
  }, [Socket, authCtx]);

  useLayoutEffect(() => {
    if (isFocused === true) {
      async function token() {
        let tokendata = JSON.parse(authCtx.token);
        setToken(tokendata);
        setUsername(tokendata.details.username);

        let userdata = {
          filter: { manager: tokendata.details.username, deleted: false },
          sort: { time: -1 },
          user: {
            _id: tokendata._id,
            key: tokendata.key,
            details: {
              username: tokendata.details.username,
              role: tokendata.details.role,
              status: tokendata.details.status,
            },
          },
        };

        Socket.emit("get-settlement", userdata);
      }

      token();
    }
  }, [isFocused]);

  async function submitHandler() {
    let userdata = {
      user: {
        _id: token._id,
        key: token.key,
        details: {
          username: token.details.username,
          role: token.details.role,
          status: token.details.status,
        },
      },
    };
    Socket.emit("update-amount", userdata);
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profile}>
          <Icon name="user" color="#fff" size={60} onPress={() => {}} />
          <Text style={styles.InnerText}>{username}</Text>
          <Text style={styles.InnerText}>{total}</Text>
          <Text style={styles.InnerText}>Total</Text>
        </View>

        <View style={styles.logoutView}>
          <View style={styles.inputButtonCont}>
            <Pressable
              style={[styles.button, { backgroundColor: "#f2b71a" }]}
              onPress={() => {
                submitHandler();
              }}
            >
              <Icon
                name="key"
                color="#fff"
                size={24}
                onPress={() => {
                  navigation.goBack();
                }}
              />
              <Text style={[styles.buttonText]}>Balance Transfer</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.passContainer}>
        <View style={styles.refferHeading}>
          <View style={styles.head}>
            <Text style={styles.headText}>Date</Text>
          </View>
          <View style={styles.head}>
            <Text style={styles.headText}>Event</Text>
          </View>
          <View style={styles.head1}>
            <Text style={styles.headText}>Remark</Text>
          </View>
          <View style={styles.head}>
            <Text style={styles.headText}>Account</Text>
          </View>
        </View>

        {data.map((a) => {
          return (
            <View key={a._id}>
              <RefferInner data={a} />
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

export default Reffer;

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
    fontSize: 18,
    fontWeight: "bold",
  },
  profile: {
    margin: 10,
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
  button: {
    borderRadius: 20,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginHorizontal: 10,
  },
  passContainer: {
    marginVertical: 10,
  },
  refferHeading: {
    flexDirection: "row",
    marginLeft: 8,
    marginRight: 8,
  },
  head: {
    width: "22%",
    alignItems: "center",
    justifyContent: "center",
    margin: 0.5,
    backgroundColor: "#DAA520",
    borderRadius: 2,
  },
  head1: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#DAA520",
    borderRadius: 2,
    justifyContent: "center",
    margin: 0.5,
  },
  headText: {
    fontSize: 12,
    color: "#fff",
    margin: 10,
  },
});

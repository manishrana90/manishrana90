import React, { useContext, useLayoutEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Clipboard from "@react-native-clipboard/clipboard";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicon from "react-native-vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import moment from "moment";
import "moment-timezone";
import { AuthContext } from "../../../store/auth-context";
import { Config } from "../../../../config";
import { GetMySiteTransaction, WalletToken } from "../../../util/http";
import TransactionModal from "../../../component/UI/TransactionModal";

const MyIdDetails = () => {
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();
  const { params } = useRoute();
  const { item } = params;
  const [getTransaction, setGetTransaction] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [transactionData, setTransactionData] = useState();

  useLayoutEffect(() => {
    FetchTransaction();
  }, []);

  const FetchTransaction = async () => {
    setLoading(true);
    const userData = JSON.parse(authCtx.token);
    const WalletDetail = await WalletToken(userData.details.username);
    if (WalletDetail.success === true) {
      const token = WalletDetail.data.token;
      const data = {
        mysiteId: item._id,
      };
      const transactRes = await GetMySiteTransaction(data, token);
      // console.log('transactionRes: ', transactRes);
      if (transactRes.success === true) {
        setGetTransaction(transactRes.doc);
      }
    }
    setLoading(false);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    FetchTransaction();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const onClickTransaction = (data) => {
    setModalVisible(true);
    setTransactionData(data);
  };

  function copyToClipboard(type, text) {
    Clipboard.setString(text);
    Toast.show({
      type: "success",
      text1: "Copied Successfully.",
      text2: `${type} copied to Clipboard.`,
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headingContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.backButton}
        >
          <Ionicon size={24} color={"#fff"} name={"arrow-back"} />
        </TouchableOpacity>
        <Text style={styles.headingText}>My ID Details</Text>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View>
          <View style={styles.upperboxContainer}>
            <View style={styles.imgContainer}>
              <Image
                source={{ uri: Config.idImageUrl + item.sites.image }}
                resizeMode="contain"
                style={styles.img}
              />
              <Text style={styles.idText}>
                {item.sites.name}
                {"\n"}
                {item.sites.url}
              </Text>
            </View>

            <View style={styles.containers}>
              <View style={{ flex: 1 }}>
                <Text style={styles.Textd}>Username</Text>
                <View style={{ marginBottom: 8 }} />
                <Text style={styles.Textd}>Password</Text>
                <View style={{ marginBottom: 8 }} />
              </View>

              <View style={{ flex: 1 }}>
                <View
                  style={{ flexDirection: "row", justifyContent: "flex-end" }}
                >
                  <Text style={styles.Textsm}>{item.username}</Text>
                  <TouchableOpacity
                    style={{ marginLeft: 8 }}
                    onPress={() => {
                      copyToClipboard("Username", item.username);
                    }}
                  >
                    <Icon name="content-copy" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
                <View style={{ marginBottom: 8 }} />
                <View
                  style={{ flexDirection: "row", justifyContent: "flex-end" }}
                >
                  <Text style={styles.Textsm}>{item.password}</Text>
                  <TouchableOpacity
                    style={{ marginLeft: 8 }}
                    onPress={() => {
                      copyToClipboard("Password", item.password);
                    }}
                  >
                    <Icon name="content-copy" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
                <View style={{ marginBottom: 8 }} />
              </View>
            </View>
          </View>

          <View style={styles.lowerboxContainer}>
            <Text style={styles.deposit}>ID Balance Details</Text>
            <View style={styles.divide} />

            <View style={styles.containers}>
              <View style={{ flex: 1 }}>
                <Text style={styles.Textd}>Available Balance</Text>
                <View style={{ marginBottom: 8 }} />
                <Text style={styles.Textd}>Exposure</Text>
                <View style={{ marginBottom: 8 }} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.Textsm}>{item.sites.balance}</Text>
                <View style={{ marginBottom: 8 }} />
                <Text style={styles.Textsm}>{item.exposure}</Text>
                <View style={{ marginBottom: 8 }} />
              </View>
            </View>
          </View>
          <View style={styles.headingContainer}>
            <Text style={styles.headingText}>Transaction Details</Text>
          </View>
          {loading === true ? (
            <View style={styles.dropdown}>
              <ActivityIndicator size={30} color="#fbb845" />
            </View>
          ) : (
            <View>
              {getTransaction.map((trans, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.listtrans}
                    onPress={() => {
                      onClickTransaction(trans);
                    }}
                  >
                    <View>
                      <Image
                        source={{ uri: Config.idImageUrl + item.sites.image }}
                        resizeMode="cover"
                        style={styles.imglist}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.Texttdlist,
                          { fontWeight: "300", fontSize: 12 },
                        ]}
                      >
                        {trans.type} To {trans.to}
                      </Text>
                      <Text style={styles.Textsmlist}>
                        {" "}
                        {moment(trans.updatedAt).format(
                          "MMM DD YYYY hh:mm:ss A"
                        )}
                      </Text>
                      <Text
                        style={[
                          styles.Texttdlist,
                          { fontWeight: "300", fontSize: 12 },
                        ]}
                      >
                        Remarks:{trans.remarks}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.Textnumber}>{trans.amount}</Text>
                      <Text
                        style={[
                          styles.Textnumber,
                          {
                            color:
                              trans.status === "Approved"
                                ? "green"
                                : trans.status === "Decline"
                                ? "red"
                                : "yellow",
                          },
                        ]}
                      >
                        {trans.status}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {getTransaction.length <= 0 && (
            <View style={styles.nofound}>
              <Text>No data Found !</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <TransactionModal
        modalVisible={modalVisible}
        data={transactionData}
        setModalVisible={() => {
          setModalVisible(false);
        }}
      />
    </View>
  );
};
export default MyIdDetails;
const styles = StyleSheet.create({
  headingContainer: {
    marginVertical: 14,
    alignItems: "center",
  },
  headingText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
  imgContainer: {
    flexDirection: "row",
    margin: 8,
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#f2b71a",
    alignItems: "center",
  },
  containers: {
    flex: 1,
    flexDirection: "row",
    overflow: "hidden",
    padding: 14,
  },
  Textd: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "300",
  },
  Textsm: {
    fontSize: 14,
    color: "#fff",
    textAlign: "right",
    fontWeight: "500",
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  idText: {
    color: "#fff",
    marginHorizontal: 8,
    textAlign: "center",
  },
  deposit: {
    padding: 16,
    color: "#fff",
  },
  divide: {
    borderColor: "#f2b71a",
    marginBottom: 16,
    borderWidth: 0.2,
  },
  listtrans: {
    flex: 1,
    flexDirection: "row",
    overflow: "hidden",
    backgroundColor: "#2a2d3c",
    borderRadius: 5,
    margin: 8,
    marginBottom: 2,
    padding: 8,
    alignItems: "center",
  },
  Texttdlist: {
    fontSize: 14,
    paddingLeft: 8,
    fontWeight: "400",
    color: "#fff",
  },
  Textnumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "right",
  },
  Textsmlist: {
    fontSize: 11,
    paddingLeft: 6,
    color: "#fff",
    fontWeight: "300",
  },
  imglist: {
    width: 40,
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#fff",
  },
  nofound: {
    alignItems: "center",
    padding: 32,
  },
  upperboxContainer: {
    backgroundColor: "#2a2d3c",
    borderRadius: 8,
    marginHorizontal: 6,
    paddingVertical: 5,
  },
  lowerboxContainer: {
    backgroundColor: "#2a2d3c",
    borderRadius: 8,
    margin: 8,
    paddingBottom: 8,
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  Linking
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { FlatList } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { Config } from "../../../config";

const RenderMyID = ({ myid, navigation, loading }) => {

  const handleURL = (item) => {
    let url = item?.sites?.url || '';

    if (!url.match(/^[a-zA-Z]+:\/\//)) { 
      url = 'https://' + url; 
    }

    Linking.openURL(url).catch(err => {
      Toast.show({
        type: "error",
        text1: "URL Error!",
        text2: err.message,
      });
    });
  }

  return (
    <View>
      <FlatList
        data={myid}
        keyExtractor={(item) => item?._id}
        contentContainerStyle={{ paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return (
            <View key={index}>
              <View style={styles.listid}>
                <View>
                  <Image
                    source={{ uri: Config.idImageUrl + item?.sites?.image }}
                    resizeMode="cover"
                    style={styles.img}
                  />
                </View>
                <Pressable 
                  style={styles.textBox}
                  onPress={() => {handleURL(item); console.log("Item: ", item);}}
                >
                  <Text style={styles.Textd}>{item?.sites?.name}</Text>
                  <View style={{ paddingVertical: 3 }} />
                  <Text style={[styles.textdSmall]}>{item?.username}</Text>
                </Pressable>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("MyIdDeposit", { item: item });
                    }}
                    style={[styles.roundedButton, styles.depositbutton]}
                  >
                    <Text style={styles.buttonText}>D</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("MyIdWithdraw", { item: item });
                    }}
                    style={[styles.roundedButton, styles.withdrawbutton]}
                  >
                    <Text style={styles.buttonText}>W</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("MyIdDetails", { item: item });
                    }}
                    style={[styles.roundedButton, styles.useidbutton]}
                  >
                    <Icon name="dots-horizontal" size={24} color="#ffc21d" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }}
      />

      {loading ? (
        <View>
          <ActivityIndicator size={30} color="#fbb845" />
        </View>
      ) : (
        myid.length <= 0 && (
          <View style={styles.nofound}>
            <Text style={styles.nofound}>No data Found !</Text>
          </View>
        )
      )}
    </View>
  );
};

export default RenderMyID;

const styles = StyleSheet.create({
  listid: {
    flex: 1,
    flexDirection: "row",
    overflow: "hidden",
    backgroundColor: "#2a2d3c",
    marginHorizontal: 8,
    marginBottom: 8,
    borderRadius: 5,
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
  textBox: {
    flex: 1,
  },
  Textd: {
    fontSize: 14,
    marginLeft: 10,
    fontWeight: "bold",
    color: "#fff",
    // marginBottom: 5,
  },
  textdSmall: {
    fontSize: 11,
    marginLeft: 10,
    fontWeight: "500",
    color: "#FFF380",
  },
  img: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "#fff",
  },
  roundedButton: {
    width: 35,
    height: 35,
    borderRadius: 35/2,
    borderColor: "#fff",
    borderWidth: 1,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  depositbutton: { backgroundColor: "#57c660" },
  withdrawbutton: { backgroundColor: "#FF7A2F" },
  useidbutton: { backgroundColor: "#000" },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  nofound: {
    alignItems: "center",
    marginTop: 32,
    color: "#f2b71a",
  },
});

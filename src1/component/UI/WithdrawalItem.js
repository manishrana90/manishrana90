import React, { memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";

const WithdrawalItem = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.containerView}>
        <View style={styles.header}>
          <Text style={[styles.heading]}>Name</Text>
        </View>
        <View style={styles.footer}>
          <Text style={[styles.textInputStyle]}>
            {props.item.name.toUpperCase()}
          </Text>
        </View>
      </View>
      <View style={styles.containerView}>
        <View style={styles.header}>
          <Text style={[styles.heading]}>UPI Number</Text>
        </View>
        <View style={styles.footer}>
          <Text style={[styles.textInputStyle]}>
            {props.item.upi.toUpperCase()}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        disabled={props.loading}
        style={[styles.buttonView, { backgroundColor: "#e7685a" }]}
        onPress={() => {
          props.onRemove(props.item._id);
        }}
      >
        {!props.loading ? (
          <Icon name="trash" size={20} color="#fff" />
        ) : (
          <ActivityIndicator size={20} color={"#fff"} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    marginVertical: 5,
    paddingVertical: 7,
    backgroundColor: "#fff",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  containerView: {
    flex: 1,
    marginRight: 5,
  },
  header: {
    marginBottom: 5,
  },
  heading: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },

  textInputStyle: {
    padding: 0,
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
  },
  buttonView: {
    height: 35,
    width: 35,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DAA520",
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "500",
  },
});

export default memo(WithdrawalItem);

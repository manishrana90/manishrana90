import React, { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";

const WithdrawalItemBank = (props) => {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.containerView}>
          <View style={styles.header}>
            <Text style={[styles.heading]}>BankName</Text>
          </View>
          <View style={styles.footer}>
            <Text style={[styles.textInputStyle]}>{props.item.bankName}</Text>
          </View>
        </View>
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
            <Text style={[styles.heading]}>IFSC:</Text>
          </View>
          <View style={styles.footer}>
            <Text style={[styles.textInputStyle]}>{props.item.ifsc}</Text>
          </View>
        </View>
        <View style={styles.containerView}>
          <View style={styles.header}>
            <Text style={[styles.heading]}>A/C Number:</Text>
          </View>
          <View style={styles.footer}>
            <Text style={[styles.textInputStyle]}>{props.item.accnumber}</Text>
          </View>
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
    flexDirection: "row",
  },
  header: {
    marginBottom: 5,
    flex: 1,
  },
  heading: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
  footer: {
    flex: 1.5,
  },
  textInputStyle: {
    padding: 0,
    fontSize: 14,
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

export default memo(WithdrawalItemBank);

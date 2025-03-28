import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import moment from "moment";
import "moment-timezone";
import Icon from "react-native-vector-icons/FontAwesome";

const OffersSlider = ({
  data,
  selectedOfferId,
  setSelectOfferId,
  usernameToCheck,
}) => {
  const [offer, setOffer] = useState("");
  const onSelectOffer = (item) => {
    setSelectOfferId(item._id);
    setOffer(item);
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
        {data.map((item) => {
          const currentDate = moment();
          const expiryMoment = moment(item?.endDate);
          const daysUntilExpiry = expiryMoment.diff(currentDate, "days");

          const count = item.apply_user.filter(
            (username) => username === usernameToCheck
          ).length;
          if (count >= item.max_apply) return <></>;

          return (
            <View>
              <TouchableOpacity
                style={[
                  styles.itemButton,
                  selectedOfferId === item._id ? styles.selectedItem : "",
                ]}
                onPress={() => {
                  //   console.log("Item: ", item);
                  onSelectOffer(item);
                }}
              >
                <View style={styles.itemContainer}>
                  <View style={styles.detailView}>
                    <Text style={styles.textUpper}>Bonus</Text>
                    <Text style={styles.textLower}>{item.percentage}%</Text>
                  </View>
                  <View style={styles.detailView}>
                    <Text style={styles.textUpper}>Rolling</Text>
                    <Text style={styles.textLower}>{item.multiple_value}x</Text>
                  </View>
                  <View style={styles.detailView}>
                    <Text style={styles.textUpper}>Max Bonus</Text>
                    <Text style={styles.textLower}>{item.max_cap_value}</Text>
                  </View>
                </View>

                <View style={styles.validityView}>
                  <Text style={styles.validityText}>
                    {item.max_apply_days} days validity
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
      {selectedOfferId != "" && (
        <View style={styles.terms}>
          <Text style={styles.termsHeading}>Terms And Conditions</Text>
          <Text style={styles.termsDetail}>
            1. Offer valid For {offer?.max_apply_days} days.
          </Text>
          <Text style={styles.termsDetail}>
            2. Max Apply {offer?.max_apply} Time.
          </Text>

          <TouchableOpacity
            style={styles.termsButton}
            onPress={() => {
              setSelectOfferId("");
              setOffer("");
            }}
          >
            <Icon name="close" size={18} color="#000" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default OffersSlider;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 5,
  },
  itemButton: {
    backgroundColor: "#000",
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
  },
  selectedItem: {
    borderColor: "#e7bd06",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailView: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  textUpper: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  textLower: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "400",
  },
  validityView: {
    backgroundColor: "#e7bd06",
    marginTop: 5,
    padding: 2,
    borderRadius: 2,
    alignItems: "center",
  },
  validityText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "500",
  },
  terms: {
    marginHorizontal: 10,
    marginVertical: 10,
    borderColor: "#000",
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  termsHeading: {
    color: "#000",
    fontSize: 13,
    fontWeight: "500",
  },
  termsDetail: {
    marginTop: 5,
    color: "#ab393a",
    fontSize: 12,
    fontWeight: "500",
  },
  termsButton: {
    position: "absolute",
    right: 10,
    top: 10,
  },
});

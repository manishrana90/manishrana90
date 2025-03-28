import React, { memo } from "react";
import { View, Modal, StyleSheet, Text, Image, Pressable } from "react-native";

const SessionMinMaxModal = ({ modalVisible, limit, setModalVisible }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.hideIconView}>
            <Pressable
              style={styles.hideIconPress}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Image
                source={require("../../assets/images/iconPNG/closeIcon.png")}
                resizeMode="contain"
                style={styles.hideIconImg}
                tintColor={"#DAA520"}
              />
            </Pressable>
          </View>
          <View style={styles.mainInvestBetCardStyles}>
            <View style={styles.cardBetDecisionOddView}>
              <View style={styles.cardBetDecisionView}>
                <Text
                  style={[styles.cardBetDecisionText, { marginBottom: 10 }]}
                >
                  Min Limit:{" "}
                  <Text style={[styles.cardBetDecisionText]}>{limit.min}</Text>
                </Text>
                <Text
                  style={[styles.cardBetDecisionText, { marginBottom: 10 }]}
                >
                  Max Limit:{" "}
                  <Text style={[styles.cardBetDecisionText]}>{limit.max}</Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalView: {
    width: "40%",
    borderRadius: 5,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  hideIconView: {
    alignItems: "flex-end",
    paddingTop: 5,
    paddingRight: 10,
    marginBottom: 5,
    // backgroundColor: 'orange',
  },
  hideIconPress: {
    width: 25,
    height: 25,
  },
  hideIconImg: {
    width: "100%",
    height: "100%",
    // backgroundColor: 'black',
  },

  modalBox: {
    flexDirection: "row",
    justifyContent: "center",
  },

  Icon: {
    flex: 1,
    marginVertical: 5,
    marginHorizontal: 5,
    position: "absolute",
    top: -50,
    right: 10,
  },

  investSideCardDivider: {
    width: 1,
    backgroundColor: "#364253",
  },

  // Invest Bet Card Styles..
  mainInvestBetCardStyles: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginBottom: 5,
    borderRadius: 5,
    padding: 5,
    elevation: 5,
    shadowColor: "#fff",
  },

  cardBetMessageView: {
    marginVertical: 5,
    marginHorizontal: 10,
    // alignItems: "center",
    // justifyContent: "center",
  },

  cardBetMessageText: {
    color: "#000",
    fontWeight: "500",
    fontSize: 12,
  },

  cardBetDecisionOddView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingVertical: 5,
  },

  cardBetDecisionView: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
  },

  cardBetDecisionText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "500",
  },

  cardBetAmount: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
});

export default memo(SessionMinMaxModal);

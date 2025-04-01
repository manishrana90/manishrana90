import React, { memo, useContext, useEffect, useState } from "react";
import {
  View,
  Modal,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";

import Lottie from "lottie-react-native";

const SuccessModal = ({ modalVisible, setModalVisible }) => {

  useEffect(()=> {
    setTimeout(() => {
      setModalVisible(false);
    }, 3000);
  }, [])
  //success modal;
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
          <View style={[styles.modalBox]}>
            <View style={styles.container}>
              <View style={styles.hideIconView}>
                <TouchableOpacity
                  style={styles.hideIconPress}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Image
                    source={require("../../assets/images/iconPNG/closeIcon.png")}
                    style={styles.hideIconImg}
                    tintColor={"#DAA520"}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.imageContainer}>
                {/* <Image
                  source={require("../../assets/images/iconPNG/successIcon.png")}
                  resizeMode="contain"
                  style={styles.imgSuccessStyles}
                /> */}
                <Lottie source={require('../../assets/images/animation/successAnimation.json')} autoPlay={true} style={styles.imgSuccessStyles} />
              </View>
              <View style={styles.textView}>
                <Text style={styles.headerText}>Successful</Text>
                <Text style={styles.lowerText}>
                  Your bet have been placed successfully.
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
    width: "90%",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    elevation: 20,
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
  container: {
    width: "100%",
    backgroundColor: "#fff",
  },
  hideIconView: {
    alignItems: "flex-end",
    paddingTop: 10,
    paddingRight: 10,
  },
  hideIconPress: {
    width: 30,
    height: 30,
  },
  hideIconImg: {
    width: "100%",
    height: "100%",
  },
  imageContainer: {
    width: "100%",
    height: 150,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  imgSuccessStyles: {
    width: "60%",
  },
  textView: {
    marginBottom: 30,
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    color: "#000",
    fontWeight: "bold",
  },
  lowerText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
    marginTop: 10,
  },
});

export default memo(SuccessModal);

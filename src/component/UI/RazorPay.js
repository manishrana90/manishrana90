import React from "react";
import RazorpayCheckout from "react-native-razorpay";
import Toast from "react-native-toast-message";
import { DepositPayment } from "../../util/http";

import { Config } from "../../../config";

const RazorPay = (name, contact, amount, orderId, modalVisible, setModalVisible, razorpayKey, userData) => {
  var options = {
    description: "Credits towards consultation",
    image: "",
    currency: "INR",
    key: razorpayKey,                // "rzp_live_q09sl8uLmGjfg5"
    amount: `${amount * 100}`,
    name: "Zolo Win",
    order_id: orderId,
    prefill: {
      contact: `${contact}`,
      name: `${name}`,
    },
    theme: { color: "#2CC597" },
  };
  RazorpayCheckout.open(options)
    .then(async (data) => {

      setModalVisible(!modalVisible);
      Toast.show({
        type: "success",
        text1: "Deposit Payment",
        text2: `😁Your payment of ₹ ${amount} has been successfully done. 😁`,
      });

      //  Custom Analytic Event..
      await analytics().logEvent('deposit_success', {
        type: 'razorpay',
        userNumber: userData?.details?.fullname,
        userName: userData?.details?.mobile,
        depositAmount: amount,
      });
    })
    .catch(async (error) => {
      setModalVisible(!modalVisible);
      Toast.show({
        type: "error",
        text1: "Deposit payment",
        text2: `😔 Your payment of ₹ ${amount} has failed. 😔`,
      });

      // Custom Analytic Event..
      await analytics().logEvent('deposit_failed', {
        type: "razorpay",
        userNumber: userData?.details?.fullname,
        userName: userData?.details?.mobile,
        depositAmount: amount,
      });
    });
};

export default RazorPay;

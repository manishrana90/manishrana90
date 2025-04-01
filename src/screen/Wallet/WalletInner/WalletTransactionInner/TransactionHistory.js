import React, { useState, useLayoutEffect, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import "moment-timezone";
import Toast from "react-native-toast-message";
import TransactionHistoryCard from "../../../../component/UI/TransactionHistoryCard";
import { AuthContext } from "../../../../store/auth-context";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { cancelTransactionAPI, GetAllTransaction } from "../../../../util/http";
import TransactionModal from "../../../../component/UI/TransactionModal";


const TransactionHistory = () => {
  const authCtx = useContext(AuthContext);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const [transaction, setTransaction] = useState([]);
  const [selected, setSelected] = useState("start");
  const [date, setDate] = useState({
    start: new Date(moment(new Date()).subtract(7, "day").format("YYYY-MM-DD")),
    end: new Date(),
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [transactionData, setTransactionData] = useState();


  useEffect(() => {
    if (authCtx.token === null || authCtx.token === undefined) {
      navigation.navigate("Home");
    }
  }, [authCtx.logout]);

  useLayoutEffect(() => {
    if (isFocused) {
      getuserTransaction();
    }
  }, [isFocused, GetAllTransaction]);
  

  const getuserTransaction = async () => {
    if(authCtx.token == null || authCtx.token == undefined) return;

    setLoading(true);
    // const token = authCtx.walletToken;

    const userData = JSON.parse(authCtx.token);
    const data = {
      user_id: userData?.details?._id,
    };

    let allTransaction = await GetAllTransaction(data);
    setLoading(false);
    if (allTransaction.success == true) {
      setTransaction(allTransaction.data);
    }
  };


  const onCancelWithdrawal = async(data) => {
    setLoading(true);

    // const token = authCtx.walletToken;
    const userData = JSON.parse(authCtx.token);
    data['user_id'] = userData?.details?._id;
    
    const cancelRes = await cancelTransactionAPI(data);

    if(cancelRes.success){
      Toast.show({
        type: "success",
        text1: "Cancelled Successfuly",
        text2: cancelRes.message,
      });
      getuserTransaction();
    } else {
      Toast.show({
        type: "error",
        text1: "Cancellation Failed!",
        text2: cancelRes.message,
      });
    }

    setLoading(false);
  }



  return (
    <View style={styles.mainViewHolder}>
      <View style={styles.transactionTextViewHolder}>
        <Text style={styles.transactionText}>Transaction History</Text>
      </View>

      {transaction.length > 0 ? (
        <FlatList
          contentContainerStyle={styles.flatListStyles}
          keyExtractor={(item) => item.id}
          data={transaction}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <TransactionHistoryCard
                item={item}
                setData={() => {
                  setModalVisible(true);
                  setTransactionData(item);
                }}
              />
            );
          }}
          // onRefresh={()=>onFilterSubmit()}
        />
      ) : (
        <Text style={styles.noData}>No transaction found.</Text>
      )}
      <DatePicker
        modal
        mode={"date"}
        open={open}
        date={date[selected]}
        onConfirm={(dateselected) => {
          setOpen(false);
          setDate({
            ...date,
            [selected]: dateselected,
          });
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
      {loading && (
        <View
          style={{
            flex: 1,
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size={"large"} color={"#DAA520"} />
        </View>
      )}
      <TransactionModal
        modalVisible={modalVisible}
        data={transactionData}
        setModalVisible={() => {setModalVisible(false);}}
        onCancelWithdraw={(val)=>{
          setModalVisible(false);
          onCancelWithdrawal(val);
        }} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainViewHolder: {
    flex: 1,
  },
  flatListStyles: {
    paddingTop: 10,
    paddingBottom: 40,
  },
  transactionTextViewHolder: {
    marginTop: 14,
    marginBottom: 10,
    alignItems: "center",
  },

  transactionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },

  paymentTypeButtonHolder: {
    padding: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },

  buttonPressable: {
    flex: 1,
    flexDirection: "row",
    marginHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 4,
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  paymentButtonText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: "#fff",
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  noData: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
    marginHorizontal: 10,
    marginTop: 40,
    textAlign: "center",
  },
});

export default TransactionHistory;

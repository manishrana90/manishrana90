import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable, Image, ScrollView, TextInput, TouchableOpacity, FlatList, ToastAndroid, ImageBackground, ActivityIndicator, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CopyIcon from 'react-native-vector-icons/MaterialIcons';
import { Config } from "../../../config";
import Clipboard from '@react-native-clipboard/clipboard';
import ImagePicker from 'react-native-image-picker';
import { PermissionsAndroid } from 'react-native';
import {launchCamera, launchImageLibrary } from 'react-native-image-picker';

const windowHeight = Dimensions.get("window").height;

const copyToClipboard = (fieldData, fieldType) => {
    
    Clipboard.setString(fieldData); 

    ToastAndroid.showWithGravity(
        `${fieldType} Copied`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
}

const PaymentDetailCard = ({fieldType, fieldData, iconName=null}) => {
    return(
        <View style={styles.bankHolderView}>
            {
                iconName!==null?
                <View style={styles.userIconView}>
                    <Icon name={iconName} color='#62bef6' size={20} />
                </View>
                :
                null
            }
            <View style={styles.accountHolderView}>
                <Text style={styles.accountHolderTextBold}>{fieldType}</Text>
                <Text style={styles.accountHolderText}>{fieldData}</Text>
            </View>
            <TouchableOpacity style={styles.copyButton} onPress={() => {copyToClipboard(fieldData, fieldType)}}>
                <CopyIcon name="content-copy" color='#62bef6' size={20} />
            </TouchableOpacity>
        </View>
    );
}


const TransactionScreenShotCard = ({depAmount, setdepAmount, imageFilePath, setImageFilePath, transactionId, onSubmit, loading, minMaxLimit }) => {
    const dummyImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Picture_icon_BLACK.svg/1200px-Picture_icon_BLACK.svg.png';

    // Image File Picker
    const chooseFile = () => {
        let options = {
            mediaType: 'photo',
            // maxWidth: 350,
            // maxHeight: 1000,
            quality: 1,
            includeBase64: true,
        };
        launchImageLibrary(options, (response) => {
  
            if (response.didCancel) {
                // alert('User cancelled camera picker');
                return;
            } 
            else if (response.errorCode == 'camera_unavailable') {
                alert('Camera not available on device');
                return;
            } 
            else if (response.errorCode == 'permission') {
                alert('Permission not satisfied');
                return;
            } 
            else if (response.errorCode == 'others') {
                alert(response.errorMessage);
                return;
            }
            // console.log("Image", response)
            setImageFilePath(response.assets[0]);
        });
    };


    return(
        <ScrollView style={[styles.methodCont, styles.scrollViewHandleImage]}>
            <TouchableOpacity style={styles.uploadImageHolder} onPress={() => {chooseFile()}} >
                <View style={styles.imageUploadSection}>
                    {
                        imageFilePath.uri!==dummyImage?
                        <Image 
                            source={{uri: imageFilePath.uri}}
                            style={[styles.imageTransactionStyles]} 
                        />
                        :
                        <Image 
                            source={require('../../assets/images/iconPNG/folder.png')}
                            style={[styles.imageTransactionStyles, {width: 200, height: 200}]} 
                        />
                    }
                </View>

                <View style={styles.screenShotTextView}>
                    {
                        imageFilePath.uri!==dummyImage?
                        <Text style={[styles.screenshotText, {color: '#2CC597'}]}>Screenshot Uploaded Successfully! {'\n'}Tap to Upload another Screenshot.</Text>
                        :
                        <Text style={styles.screenshotText}>*Tap to Upload Transaction Screenshot.</Text>

                    }
                </View>
            </TouchableOpacity>
     
            {
                // depAmount >= minMaxLimit?.min && depAmount <= minMaxLimit?.max && imageFilePath.uri!==dummyImage && transactionId.length>0?
                depAmount >= minMaxLimit?.min && depAmount <= minMaxLimit?.max && imageFilePath.uri!==dummyImage?
                <Pressable style={styles.pressableSubmitButton} onPress={() => {onSubmit()}} disabled={loading} >
                    {
                        !loading?
                        <Text style={styles.pressableText}>SUBMIT</Text>
                        :
                        <ActivityIndicator size='small' color="#fff" />

                    }
                </Pressable>
                :
                null
            }
        </ScrollView>
    );
}


const PaymentTypeCardUPI = ({paymentMethodData, depAmount, setError, setPageIndex, goToLastIndex, minDeposit}) => {

    const submitButtonHandler = () => {
        if(depAmount < paymentMethodData?.minLimit || depAmount > paymentMethodData?.maxLimit){
            setError(true);
            return;
        }

        // console.log("Amount: ", depAmount);
        setPageIndex(2);
        goToLastIndex();
    }
  
    return(
        <ScrollView style={[styles.methodCont, styles.scrollViewHandle]} >
            <View style={styles.imageHolderView} >
                <View style={styles.paymentImagecontainer}>
                    {
                        paymentMethodData.paymenttype == 'Phone Pay'?
                            <Image 
                                source={require('../../assets/images/iconPNG/phonePe.png')}  
                                resizeMode="contain"
                                style={styles.imagePaymentTypeStyles} />
                            :
                            paymentMethodData.paymenttype == 'Paytm'?
                                <Image 
                                    source={require('../../assets/images/iconPNG/paytmUPI.png')}
                                    resizeMode="contain"
                                    style={styles.imagePaymentTypeStyles} />
                                :
                                paymentMethodData.paymenttype == 'Google Pay'?
                                    <Image 
                                        source={require('../../assets/images/iconPNG/googlePay.png')} 
                                        resizeMode="contain"
                                        style={styles.imagePaymentTypeStyles} />
                                    :
                                    <Image 
                                        source={require('../../assets/images/deposit/upi.png')} 
                                        resizeMode="contain"
                                        style={styles.imagePaymentTypeStyles} />
                    }
                </View>
            </View>
            
            <View style={styles.bankDetailHolder}>
                <PaymentDetailCard fieldType="Name" fieldData={paymentMethodData.name} iconName="user" />
                <PaymentDetailCard fieldType="Phone Number" fieldData={paymentMethodData.mobile} iconName="phone" />
                {paymentMethodData.upi&&
                    <PaymentDetailCard fieldType="UPI Id" fieldData={paymentMethodData.upi} iconName="at" />
                }
                
                <TouchableOpacity style={styles.pressableSubmitButton} onPress={() => { submitButtonHandler() }}>
                    <Text style={styles.pressableText}>SUBMIT</Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
    );
}


const PaymentMethodCardBarCode = ({paymentMethodData, depAmount, setError, setPageIndex, goToLastIndex, minDeposit}) => {

    const submitButtonHandler = () => {
        if(depAmount < paymentMethodData?.minLimit || depAmount > paymentMethodData?.maxLimit){
            setError(true);
            return;
        }

        // console.log("Amount: ", depAmount);
        setPageIndex(2);
        goToLastIndex();
    }
  
    return(
        <ScrollView style={[styles.methodCont, styles.scrollViewHandle]} >
            <View style={styles.imageHolderView} >
                <View style={styles.paymentImagecontainer}>
                    <Icon name="qrcode" color='#62bef6' size={35} />
                </View>
            </View>
            
            <View style={styles.bankDetailHolder}>

                <PaymentDetailCard fieldType="Name" fieldData={paymentMethodData?.paymenttype} iconName="user" />
                
                <View style={styles.barcodeHolderView}>
                    <Image source={{uri: `${Config.transactionUrl}${paymentMethodData.image}`}} style={{width: 270, height: 350, resizeMode: 'contain', backgroundColor: 'white', borderRadius: 10}}  />
                    <Text style={styles.accountHolderTextBold} >Scan This QR Code</Text>
                </View>

                <TouchableOpacity style={styles.pressableSubmitButton} onPress={() => { submitButtonHandler() }}>
                    <Text style={styles.pressableText}>SUBMIT</Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
    );
}


const PaymentMethodCardBank = ({paymentMethodData, depAmount, setError, setPageIndex, goToLastIndex, minDeposit}) => {
    
    const submitButtonHandler = () => {
        if(depAmount < paymentMethodData?.minLimit || depAmount > paymentMethodData?.maxLimit){
            setError(true);
            return;
        }

        // console.log("Amount: ", depAmount);
        setPageIndex(2);
        goToLastIndex();
    }

    return(
        <ScrollView style={[styles.methodCont, styles.scrollViewHandle]}>
            <View style={styles.imageHolderView} >
                <View style={styles.paymentImagecontainer}>
                    <Image 
                        source={require('../../assets/images/iconPNG/bank.png')}  
                        resizeMode="contain"
                        style={styles.imagePaymentTypeStyles}
                    />
                </View>
            </View>
      
            <View style={styles.bankDetailHolder}>

                <PaymentDetailCard fieldType="A/C Holder Name" fieldData={paymentMethodData.name} iconName="user" />
                <PaymentDetailCard fieldType="Account Number" fieldData={paymentMethodData.accnumber} />
                <PaymentDetailCard fieldType="IFSC Code" fieldData={paymentMethodData.ifsc} />

                <TouchableOpacity style={styles.pressableSubmitButton} onPress={() => { submitButtonHandler() }}>
                    <Text style={styles.pressableText}>SUBMIT</Text>
                </TouchableOpacity>
                
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    methodCont: {
        marginTop: 5,
        marginHorizontal: 10,
    },
    scrollViewHandle :{
        maxHeight: 400,
    },
    scrollViewHandleImage :{
        maxHeight: windowHeight - 300,
    },
    imageHolderView :{
        marginVertical: 5,
        alignItems: 'center',
    },
    paymentImagecontainer : {
        backgroundColor: "#fff",
        borderRadius: 4,
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#2CC597",
    },
    imagePaymentTypeStyles :{
        width: 30,
        height: 30,
    },
    depositAmountViewHolder :{
        marginHorizontal: 20,
        marginVertical: 20,
    },
    depoAmountInputStyles :{
        backgroundColor: '#eaedf5',
        color: '#000',
        padding: 10,
        borderRadius: 5,
    },
    minimumAmountText : {
        color: 'red',
        fontSize: 12,
    },
    bankHolderView :{
        margin: 5,
        backgroundColor: '#e8f6fe',
        flexDirection :'row',
        paddingHorizontal: 5,
        paddingVertical: 10,
        borderRadius: 7,
        alignItems:'center',
    },
    barcodeHolderView : {
        margin: 5,
        backgroundColor: '#e8f6fe',
        paddingHorizontal: 5,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems:'center',
        justifyContent: 'center',
    },
    userIconView :{
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    accountHolderView :{
        flex: 1,
        paddingLeft: 5,
    },
    accountHolderTextBold :{
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
    },
    accountHolderText :{
        color: '#7d7d7d',
        fontSize: 12,
        fontWeight: '400',
    },
    copyButton :{
        marginHorizontal: 5,
    },
    copyButtonText :{
        color: '#62bef6',
        fontWeight: '500',
    },
    imageViewHolder :{
    },
    screenShotTextView : {
        width: '80%',
    },
    screenshotText :{
        color: 'red',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
    uploadImageIconHolderView :{
        marginTop: 10,
        marginHorizontal: 30,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#62bef6',
        borderRadius: 5,
    },
    uploadImageHolder :{
        padding: 10,
        backgroundColor: '#e8f6fe',
        margin: 5,
        borderRadius: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 10,
        
    },
    imageUploadSection : {
        minHeight: 300,
    },
    imageTransactionStyles :{
        width: 260,
        height: 320,
        resizeMode: "stretch",
        // resizeMode: 'contain',
        marginBottom: 10,
    },
    imageTransactionStylesStatic : {
        marginVertical: 10,
        flex: 1,
        width: '100%',
        height: 100,
    },
    uploadImageIconHolder :{
        backgroundColor: '#62bef6',
        width: 30,
        height: 30,
        alignItems:'center',
        justifyContent: 'center',
        borderRadius: 15,
    },
    pressableSubmitButton :{
        marginVertical: 10,
        marginHorizontal: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#62bef6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pressableText :{
        fontWeight: 'bold',
        color: '#fff',
    },
});


export default PaymentTypeCardUPI;
export {PaymentMethodCardBarCode};
export {PaymentMethodCardBank};
export {TransactionScreenShotCard};
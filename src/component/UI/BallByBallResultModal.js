import React from 'react';
import { StyleSheet, Text, View, Modal, Dimensions } from 'react-native';
import { WebView } from "react-native-webview";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from 'react-redux';
const {width: windowWidth} = Dimensions.get('window');

const BallByBallResultModal = () => {
    const dispatch = useDispatch();
    const {bbbResultModal: modalVisible, bbbSingleResult: data} = useSelector((state) => state.liveBet)

    const handleClose = () => {
        dispatch({
            type: "BBBRESULTMODAL",
            payload: false,
        });
    }

    return (
        <Modal
            onRequestClose={() => {handleClose();}}
            visible={modalVisible}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>{data?.Result}</Text>
                        <View style={styles.closeBtnSection}>
                            <Icon 
                                name="close" 
                                size={18} 
                                color={'#fff'} 
                                onPress={() => {handleClose();}}
                                style={styles.iconStyles}
                            />
                        </View>
                    </View>
                    <View style={styles.webViewStyles}>
                        <WebView
                            source={{uri: `https://vc9raw.sgp1.cdn.digitaloceanspaces.com/BallpBall/${data?.ballvideo}`}}
                            nestedScrollEnabled
                            androidHardwareAccelerationDisabled={true}
                            automaticallyAdjustContentInsets={true}
                            scrollEnabled={false}
                            startInLoadingState={true}
                            style={styles.webViewStyles}
                        />
                    </View>

                </View>
            </View>

        </Modal>
    )
}

export default BallByBallResultModal;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.7)",
    },
    modalView: {
        width: "100%",
        backgroundColor: "#000",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        overflow: 'hidden',
    },
    header: {
        padding: 2,
        backgroundColor: "#DAA520",
        marginBottom: 0,
        borderWidth: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 30,
        textAlign: 'center',
    },
    closeBtnSection: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 40,
        right: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconStyles: {
        backgroundColor: '#0009',
        padding: 10,
        borderRadius: 15,
        fontSize: 20,
    },
    webViewStyles: {
        width: windowWidth,
        height: windowWidth *0.60,
        backgroundColor: "#151C26",
        opacity: 0.99,
    }

})
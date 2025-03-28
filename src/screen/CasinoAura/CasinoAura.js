import React, { useContext, useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { WebView } from "react-native-webview";
import MarqueeView from "react-native-marquee-view";
import { useNavigation } from "@react-navigation/native";

import { AuthContext } from '../../store/auth-context';
import { Config } from '../../../config';
const screenWidth = Dimensions.get('window').width;

const CasinoAura = () => {
    const authCtx = useContext(AuthContext);
    const navigation = useNavigation();
    const dataToken =
    authCtx.token === null || authCtx.token === undefined
    ? ""
    : JSON.parse(authCtx.token);


    useEffect(() => {
        if (authCtx.token === null || authCtx.token === undefined) {
          navigation.navigate("Home");
        }
    }, [authCtx.logout]);


    return (
        <View style={{flex: 1}}>
            <MarqueeView>
                <Text style={{ color: "#FFBF00", fontSize: 14, fontWeight: "600", width: screenWidth }}>1 Point = 1 Rupee.</Text>                
            </MarqueeView>

            <WebView
                nestedScrollEnabled
                automaticallyAdjustContentInsets={true}
                javaScriptEnabled={true}
                source={{ uri: `https://m2.fawk.app/#/splash-screen/${dataToken? dataToken.verifytoken : ''}/${Config.casinoOrderId}` }}
                scrollEnabled={false}
                startInLoadingState={true}
            />
        </View>
    );
}

export default CasinoAura
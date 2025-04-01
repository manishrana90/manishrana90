import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { WebView } from "react-native-webview";

const HomeLive = () => {
    const isFocused = useIsFocused();
  return (
    <View style={styles.container} >
        {isFocused &&
        <WebView
            source={{
            uri: "https://kushubmedia.com/cricket/cricket.html",
            }}
            // nestedScrollEnabled
            androidHardwareAccelerationDisabled={true}
            automaticallyAdjustContentInsets={true}
            scrollEnabled={false}
            startInLoadingState={true}
            style={{
                height: 180,
                backgroundColor: "#151C26",
                opacity: 0.99,
            }}
            allowsInlineMediaPlayback={true}
        />
        }
        <Image 
            source={require('../../assets/images/home/virtualCricket.png')} 
            resizeMode="contain"
            style={styles.imageStyle} 
        />
        
    </View>
  )
};

const styles = StyleSheet.create({
    container : {
        height: 190,
    },
    textStyles : {
        color: '#FFF',
    },
    imageStyle : {
        position: 'absolute',
        top: 0,
        right: 0,
        height: 190,
        width: 190,
    }

});

export default HomeLive;
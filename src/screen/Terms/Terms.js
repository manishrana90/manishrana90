import React from 'react';
import { StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';


const Terms = () => {
    return (
        <View style={styles.container}>
            <WebView
                nestedScrollEnabled
                automaticallyAdjustContentInsets={true}
                javaScriptEnabled={true}
                source={{ uri: 'https://paisaexch.com/terms-conditions' }}
                scrollEnabled={false}
                startInLoadingState={true}
            />
        </View>
    )
}

export default Terms;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})
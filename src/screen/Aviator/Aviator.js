import React, { useEffect, useState, useContext } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import WebView from 'react-native-webview';
import { AuthContext } from '../../store/auth-context';


const Aviator = () => {
    const authCtx = useContext(AuthContext);
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const [casinoUrl, setCasinoUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const token = !!authCtx.token? JSON.parse(authCtx.token)?.verifytoken : ''


    useEffect(() => {
        if (authCtx.token === null || authCtx.token === undefined) {
            navigation.navigate("Home");
        }
    }, [authCtx.logout]);


    useEffect(() => {
        if(isFocused) {
            setLoading(true);
            setCasinoUrl(`https://paisaaviator.fantasylineups.com/?host_id=paisauser&token=${token}`)

            setTimeout(() => {
                setLoading(false);
            }, 2000)

            return () => {
                setCasinoUrl('')
            }
        }
    }, [isFocused, token])


    return (
        <View style={styles.container}>
            {!loading?
                <WebView
                    nestedScrollEnabled
                    automaticallyAdjustContentInsets={true}
                    javaScriptEnabled={true}
                    source={{ uri: casinoUrl }}
                    scrollEnabled={false}
                    startInLoadingState={true}
                />
                :
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size={"large"} color={"#DAA520"} />
                </View>
            }
        </View>
    )
}

export default Aviator;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loaderContainer: {
        flex: 1,
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        alignItems: "center",
    }

})
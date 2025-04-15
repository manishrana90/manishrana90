import React, { useLayoutEffect, useEffect, useState, useContext } from 'react';
import { View, StyleSheet,ActivityIndicator  } from 'react-native';
import WebView from 'react-native-webview';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../store/auth-context';
import { GetlcasinoAPI } from '../../util/http';
const DiamondTable = ({ route }) => {
  const { eventname } = route.params; // Receiving data
  const authCtx = useContext(AuthContext);
  const isFocused = useIsFocused();
  const navigation = useNavigation(); 
  const [casinoUrl, setCasinoUrl] = useState('');
  const token = !!authCtx.token? JSON.parse(authCtx.token)?.verifytoken : ''
  const [loading, setLoading] = useState(false);
  const id = JSON.parse(authCtx.token)?.details?._id;
  const name = JSON.parse(authCtx.token)?.details?.username;
      
useLayoutEffect(() => {
  if (isFocused ) {
    const NewCasinoData = async () => {
    let data = {
         name: name,
        id: id
        };
    const casinoData = await GetlcasinoAPI(data);
      if (casinoData.success === true) {
        setLoading(true);
        setCasinoUrl(`https://lobbyc.allpanealexch.com/${eventname}/?host_id=diamond222&token=${casinoData?.response?.user}`);
        setTimeout(() => {
          setLoading(false);
      }, 2000)

      return () => {
          setCasinoUrl('')
      }
        }
      };
   NewCasinoData();       
    }
  }, [isFocused, authCtx, GetlcasinoAPI]);

 useEffect(() => {
  if (authCtx.token === null || authCtx.token === undefined) {
   navigation.navigate("Home");
   }
  }, [authCtx.logout, token]);

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
  );
};

export default DiamondTable;
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


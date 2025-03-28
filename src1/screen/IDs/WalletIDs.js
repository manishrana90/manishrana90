import React, { useContext, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../store/auth-context';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { GetCreateId, GetmyId, WalletToken } from '../../util/http';
import RenderMyID from '../../component/UI/RenderMyID';
import RenderCreateID from '../../component/UI/RenderCreateID';
import Clipboard from '@react-native-clipboard/clipboard';
import MinBetModal from '../../component/UI/MinBetModal';
import Toast from 'react-native-toast-message';
const {width, height: windowHeight} = Dimensions.get('window')


const WalletIDs = () => {
    const authCtx = useContext(AuthContext);
    const [check, setCheck] = useState('create_id');
    const [minBetVisible, setMinBetVisible] = useState(false);
    const [minBetData, setMinBetData] = useState([]);
    const [createId, setCreateId] = useState([]);
    const [myid , setmyId]= useState([]);
    const [loading, setLoading] = useState(false);
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const { params } = useRoute();
    const {idType} = params;


    useLayoutEffect(() => {
        if(!isFocused || !authCtx.token) return;
        
        const FetchIdsFunc = async() => {
            setLoading(true);
            const userData = JSON.parse(authCtx.token);
            const WalletDetail = await WalletToken(userData.details.username);
            
            if(WalletDetail.success === true) {
                let token = WalletDetail.data.token;
                let data = {
                    type: WalletDetail.data.doc.type,
                    typeId: WalletDetail.data.doc.typeId,
                };

                const getCreateRes = await GetCreateId(data, token);
                // console.log('getCreateId: ', getCreateRes);
                if (getCreateRes.success === true ) {
                    setCreateId(getCreateRes.doc);
                }

                const myid = await GetmyId(token);
                // console.log("My Id: ", myid);
                if (myid.success===true ) {
                    setmyId(myid.data);
                }
            }

            setLoading(false);
        }

        FetchIdsFunc();
    }, []);


    const minBet = (data) => {
        setMinBetData(data);
        setMinBetVisible(true);
    }

    function copyToClipboard(type, text) {
        Clipboard.setString(text);
        Toast.show({
            type: "success",
            text1: "Copied Successfully.",
            text2: `${type} copied to Clipboard.`,
        });
    }

    return (
        <View>
            
            {/* <View style={styles.container}>
                <Pressable
                    style={[styles.innerBox, check === 'my_id' ? styles.activeBox : {}]}
                    onPress={() => { setCheck('my_id'); }}>
                    <Icon
                        name="user"
                        style={[
                            styles.iconContent,
                            check === 'my_id' ? styles.activeIcon : {},
                        ]}
                        size={windowHeight < 700 ? 16 : 18}
                    />
                    <Text style={[styles.textContent, check === 'my_id' ? styles.activeText : {},]}>
                        My ID
                    </Text>
                </Pressable>
                <Pressable
                    style={[ styles.innerBox, check === 'create_id' ? styles.activeBox : {},]}
                    onPress={() => { setCheck('create_id'); }}>
                    <Icon
                        name="adduser"
                        style={[
                            styles.iconContent,
                            check === 'create_id' ? styles.activeIcon : {},
                        ]}
                        size={windowHeight < 700 ? 16 : 18}
                    />
                    <Text style={[ styles.textContent, check === 'create_id' ? styles.activeText : {} ]}>
                        Create ID
                    </Text>
                </Pressable>
            </View> */}

            <View style={styles.headingContainer}>

                <TouchableOpacity
                    onPress={() => {navigation.goBack();}}
                    style={styles.backButton}
                >
                    <Ionicon size={24} color={'#fff'} name={'arrow-back'} />
                </TouchableOpacity>

                <Text style={styles.headingText}>{idType==='my_id'? 'My ID' : 'Create ID'}</Text>
            </View>

            {idType === 'my_id'? 
                <RenderMyID 
                    myid={myid} 
                    navigation={navigation} 
                    loading={loading} 
                /> 
                : 
                <RenderCreateID 
                    createId={createId} 
                    navigation={navigation} 
                    loading={loading} 
                    minBet={(val) => {minBet(val);}} 
                /> 
            }

            {(idType === 'create_id')&&
                <MinBetModal 
                    isVisible={minBetVisible}
                    setIsVisible={(val) => {setMinBetVisible(val);}}
                    data={minBetData}
                    copyToClipboard={(type, val) => {copyToClipboard(type, val)}}
                />
            }
        </View>
    )
}

export default WalletIDs;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        margin: 6,
    },
    headingContainer: {
        marginVertical: 14,
        alignItems: "center",
    },
    headingText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#fff",
    },

    innerBox: {
        flex: 1,
        justifyContent: 'center',
        paddingVertical: 0,
        flexDirection: 'row',
        // marginTop: 4,
    },
    textContent: {
        marginVertical: 10,
        fontWeight: 'bold',
        fontSize: 11,
        marginHorizontal: 4,
        color: '#fff',
    },
    activeBox: {
        backgroundColor: '#2a2d3c',
        borderRadius: 5,
        height: 35,
    },
    activeText: {
        color: '#ffc21d',
        fontSize: 10,
    },
    iconContent: {
        marginVertical: 8,
        fontWeight: 'bold',
        color: '#fff',
    },
    activeIcon: {
        marginVertical: 8,
        fontWeight: 'bold',
        color: '#ffc21d',
    },
    backButton: {
        position: 'absolute',
        left: 10,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    }
})
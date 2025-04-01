import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image, FlatList } from 'react-native';
import { Config } from '../../../config';


const RenderCreateID = ({ createId, navigation, loading, minBet }) => {
    return (
        <View>
            <FlatList 
                data={createId}
                keyExtractor={item => item?._id}
                contentContainerStyle={{paddingBottom: 90}}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => {
                    return(
                        <View>
                            <View style={styles.listid}>
                                <View>
                                    <TouchableOpacity  onPress={() => { minBet(item); }}>
                                        <Image
                                            source={{ uri: Config.idImageUrl + item.image }}
                                            resizeMode="cover"
                                            style={styles.img}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.textBox}>
                                    <TouchableOpacity  onPress={() => { minBet(item);}}>
                                        <Text style={styles.Textd}>{item.name}</Text>
                                        <View style={{paddingVertical: 3}} />
                                        <Text style={styles.textdSmall}>{item.url}</Text>  
                                    </TouchableOpacity>
                                </View>
                
                                <View style={{flexDirection:'row', alignItems: 'center', }}>
                                    <TouchableOpacity 
                                        onPress={() => { navigation.navigate('CreateWalletID', {item:item}); }}
                                        style={styles.createIdtbutton}
                                    >
                                        <Text style={styles.createIdText}>Create</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    );
                }}
            />
         

            {loading ? (
                <View>
                    <ActivityIndicator size={30} color="#fbb845" />
                </View>
            ) : (
                <View>
                    {createId.length <= 0 && (
                        <View style={styles.nofound}>
                            <Text style={styles.nofound}>No data Found !</Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}

export default RenderCreateID;

const styles = StyleSheet.create({
    listid: {
        flex: 1,
        flexDirection: 'row',
        overflow: 'hidden',
        backgroundColor: '#2a2d3c',
        marginHorizontal: 8,
        marginBottom: 8,
        borderRadius: 5,
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 2,
    },
    textBox: {
        flex: 1,
    },
    Textd: {
        fontSize: 14,
        marginLeft: 10,
        fontWeight: 'bold',
        color: '#fff',
        // marginBottom: 5,
    },
    textdSmall: {
        fontSize: 11,
        marginLeft: 10,
        fontWeight: "500",
        color: "#FFF380",
    },
    urlText: {
        color: '#fff', 
        fontWeight:'300', 
        fontSize:11,
    },
    img: {
        width: 40,
        height: 40,
        borderRadius: 5,
        marginLeft: 8,
        borderWidth: 1,
        borderColor: '#fff'
    },
    createIdtbutton: {
        borderRadius: 5,
        backgroundColor: '#ffc21d',
        borderColor: '#ffc21d',
        borderColor: '#fff',
        borderWidth: 1,
        padding: 5,
        paddingHorizontal: 10,
        marginRight: 10,
        flexDirection: 'row',
    },
    createIdText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600'
    },
    nofound: {
        alignItems: "center",
        marginTop: 32,
        color: "#f2b71a",
      },
});
import React from 'react';
import { StyleSheet, Text, View, Modal, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';


const MinBetModal = (props) => {
    const { isVisible, setIsVisible, data, copyToClipboard } = props;
    
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={() => {setIsVisible(!isVisible);}}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.Addbank}>
                        <View style={styles.textadd}>
                            <Text style={styles.textmarket}>MIN BET</Text>
                        </View>
                        <View style={styles.iconView}>
                            <Icon
                                name="close"
                                color="red"
                                size={30}
                                style={styles.Icon}
                                onPress={() => setIsVisible(!isVisible)}
                            />
                        </View>
                    </View>
                    
                    <ScrollView>
                        <View
                            style={{
                                backgroundColor: '#2a2d3c',
                                borderRadius: 8,
                                paddingVertical: 8,
                            }}
                        >
                            <View style={{flexDirection:'row'}}>
                                <Text style={{color:'#fff',padding:8}}>Details</Text>
                            </View>
                        <View
                        style={styles.divide}
                    />
                        <View style={styles.containers}>
                            <View style={{width: '50%', padding: 4}}>
                                <Text style={styles.Textdlist}>Demo Id</Text>
                            </View>

                            <View style={{width: '50%', padding: 4}}>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={styles.Textsmlist}>{data.demoId}</Text>
                                    <TouchableOpacity
                                        onPress={() => { copyToClipboard('Demo Id', data.demoId);}}
                                        style={{paddingLeft: 12}}
                                    >
                                        <Icon name="content-copy" size={18} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                
                        <View style={styles.containers}>
                            <View style={{width: '50%', padding: 4}}>
                                <Text style={styles.Textdlist}>Password</Text>
                            </View>
                            <View style={{width: '50%', padding: 4}}>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={styles.Textsmlist}>{data.demoPassword}</Text>
                                    <TouchableOpacity 
                                        onPress={() => {copyToClipboard('Password', data.demoPassword);}}
                                        style={{paddingLeft: 12}}
                                    >
                                        <Icon name="content-copy" size={18} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{backgroundColor:'#2a2d3c', paddingVertical: 8, borderRadius:8,marginTop:8,}}>
                        <View style={styles.containers}>
                            <View style={{width: '50%', padding: 0}}>
                                <Text style={styles.Textdlist}>cricket</Text>
                                <View style={styles.divider} />
                            </View>
                            <View style={{width: '50%', padding: 0}}>
                                <Text style={styles.Textsmlist}>{data.cricket}</Text>
                                <View style={styles.divider} />
                            </View>
                        </View>
                        <View style={styles.containers}>
                            <View style={{width: '50%', padding: 0}}>
                                <Text style={styles.Textdlist}>Football</Text>
                                <View style={styles.divider} />
                            </View>
                            <View style={{width: '50%', padding: 0}}>
                                <Text style={styles.Textsmlist}>{data.football}</Text>
                                <View style={styles.divider} />
                            </View>
                        </View>
                        <View style={styles.containers}>
                            <View style={{width: '50%', padding: 0}}>
                                <Text style={styles.Textdlist}>Tennis</Text>
                                <View style={styles.divider} />
                            </View>
                            <View style={{width: '50%', padding: 0}}>
                                <Text style={styles.Textsmlist}>{data.tennis}</Text>
                                <View style={styles.divider} />
                            </View>
                        </View>
                        <View style={styles.containers}>
                            <View style={{width: '50%', padding: 0}}>
                                <Text style={styles.Textdlist}>Cards</Text>
                                <View style={styles.divider} />
                            </View>
                            <View style={{width: '50%', padding: 0}}>
                                <Text style={styles.Textsmlist}>{data.cards}</Text>
                                <View style={styles.divider} />
                            </View>
                        </View>
                        <View style={styles.containers}>
                            <View style={{width: '50%', padding: 0}}>
                                <Text style={styles.Textdlist}>Horse Racing</Text>
                                <View style={styles.divider} />
                            </View>
                            <View style={{width: '50%', padding: 0}}>
                                <Text style={styles.Textsmlist}>{data.horse_racing}</Text>
                                <View style={styles.divider} />
                            </View>
                        </View>
                        <View style={styles.containers}>
                            <View style={{width: '50%', padding: 0}}>
                                <Text style={styles.Textdlist}>Live Casino</Text>
                                <View style={styles.divider} />
                            </View>
                            <View style={{width: '50%', padding: 0}}>
                                <Text style={styles.Textsmlist}>{data.live_casino}</Text>
                                <View style={styles.divider} />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
            </View>
        </Modal>
    )
}

export default MinBetModal

const styles = StyleSheet.create({
    
    
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: '98%',
        backgroundColor: '#000',
        borderRadius: 5,
        borderColor: '#f2b71a',
        borderWidth: 2,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        paddingBottom: 20,
    },
    iconView: {
        alignItems: 'flex-end',
        fontWeight: 'bold',
        marginRight: 10,
        width: '10%',
    },
    textmarket: {
        color: '#f2b71a',
        fontSize: 16,
        fontWeight: 'bold',
        paddingLeft: 8,
    },
    Addbank: {
        flexDirection: 'row',
    },
    textadd: {
        width: '90%',
        padding: 4,
    },
    containers: {
        flex: 1,
        flexDirection: 'row',
        overflow: 'hidden',
        margin: 4,
        marginHorizontal: 8,
    },
    Textdlist: {
        fontSize: 14,
        paddingLeft:8,
        color:'#fff',
        fontWeight: '400',
    },

    Textsmlist: {
        fontSize: 12,
        paddingLeft: 8,
        color: '#fff',
        textAlign: 'left',
    },
    divider: {
        marginVertical: 8,
    },
    divide:{
        borderColor: '#f2b71a',
        marginVertical: 8,
        borderWidth: 0.2,
    }
});
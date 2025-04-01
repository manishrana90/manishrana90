import React from 'react';
import {View, Modal, Text, StyleSheet, TextInput, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

const RegisterModal = ({modalVisible, setModalVisible, setLoginModal}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalBox}>
            <Icon
              name="close"
              color="#fff"
              size={30}
              style={styles.Icon}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            />
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.headtext}>Registration</Text>
                <Text
                  style={[styles.headtext, {fontSize: 13, fontWeight: '600'}]}
                >
                  Welcome to Casino Win
                </Text>
              </View>
              <View style={styles.inputCont}>
                <TextInput
                  style={styles.inputText}
                  placeholder="Name"
                  placeholderTextColor="grey"
                  onChangeText={() => {}}
                />
                <TextInput
                  style={styles.inputText}
                  placeholder="Phone"
                  placeholderTextColor="grey"
                  onChangeText={() => {}}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.inputText}
                  placeholder="Password"
                  //   value={inputs.message.value}
                  placeholderTextColor="grey"
                  onChangeText={() => {}}
                  secureTextEntry={true}
                />
              </View>
              <View style={styles.signupCont}>
                <Pressable >
                  <LinearGradient
                    colors={['#0C53A6', '#6BD0FF']}
                    style={{
                      borderRadius: 10,
                      width: '100%',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={styles.signupText}>Register</Text>
                  </LinearGradient>
                </Pressable>
              </View>
              <View style={styles.footerCont}>
                    <View style={styles.account}>
                        <Text style={styles.accountHeading}>Already have an account? </Text>
                        <Text style={styles.accountText} onPress={()=>{ setModalVisible(!modalVisible); setLoginModal(true) }}>Login</Text>
                    </View>
              </View>

            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RegisterModal;

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.7)',
    },
    modalView: {
      width: '90%',
      backgroundColor: '#fff',
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      // paddingBottom: 20,
    },
    modalBox: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    Icon: {
      flex: 1,
      marginVertical: 5,
      marginHorizontal: 5,
      position: 'absolute',
      top: -50,
      right: 10,
    },
    container: {
      margin: 30,
      width: '100%',
    },
    header: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    headtext: {
      color: '#000',
      fontSize: 26,
      fontWeight: 'bold',
    },
    inputCont: {
      margin: 30,
      marginTop: 50,
    },
    inputText: {
      backgroundColor: '#eaedf5',
      borderRadius: 10,
      marginVertical: 10,
      paddingHorizontal: 10,
      fontSize: 14,
      color: '#000',
    },
    signupCont: {
      paddingHorizontal: 30,
      paddingBottom: 20,
      borderBottomWidth: 0.8,
      borderBottomColor: '#eaedf5',
    },
    signupText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      margin: 10,
    },
    footerCont: {
      marginTop: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    forgotten: {
      margin: 10,
    },
    forgottenText: {
      color: '#0C53A6',
      fontSize: 14,
      fontWeight: 'bold',
    },
    account: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    accountHeading: {
      color: 'grey',
      fontSize: 11,
      opacity: 0.7,
    },
    accountText: {
      color: '#0C53A6',
      fontSize: 15,
      fontWeight: 'bold',
    },
  });

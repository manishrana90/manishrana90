import React from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {WebView} from 'react-native-webview';
import Icon from 'react-native-vector-icons/FontAwesome';

const windowWidth = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const windowHeight = Dimensions.get('window').height / 3 + 60;
const videoHeight = Dimensions.get('window').height / 3;

const ScoreLiveModal = ({modalVisible, setModalVisible, url, type}) => {
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
          <View style={[styles.modalBox, { height: height < 700 ? 260 : type === 'Video' ? videoHeight - 20 : windowHeight - 20, }]}>
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
                {type === 'Video' ?
            <WebView
              source={{uri: url}}
              nestedScrollEnabled
              androidHardwareAccelerationDisabled={true}
              automaticallyAdjustContentInsets={true}
              scrollEnabled={false}
              startInLoadingState={true}
              style={{
                height: height < 700 ? 260 : videoHeight - 20,
                marginBottom: -20,
                backgroundColor: '#000',
                opacity: 0.99,
              }}
            />
            :
<WebView
            androidHardwareAccelerationDisabled={true}
            source={{
              html: `<iframe height="100%"  src="${url}" frameborder="0" allow="autoplay; encrypted-media" ></iframe>`,
            }}
            nestedScrollEnabled
            scrollEnabled={false}
            startInLoadingState={true}
            style={{
              flex: 1,
              width: '342%',
              height: height < 700 ? 260 : windowHeight,
              marginLeft: windowWidth <= 360 ? -18 : -22,
              marginTop: -23,
              marginBottom: -10,
              backgroundColor: '#000',
              opacity: 0.99,
            }}
          />
}

            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ScoreLiveModal;

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
    fontSize: 15,
    fontWeight: 'bold',
  },
  account: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountHeading: {
    color: 'grey',
    fontSize: 12,
    opacity: 0.7,
  },
  accountText: {
    color: '#0C53A6',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

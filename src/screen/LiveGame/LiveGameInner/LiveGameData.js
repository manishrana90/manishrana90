import {useIsFocused} from '@react-navigation/native';
import React, {useLayoutEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
} from 'react-native';
import {Socket} from '../../../util/socket';
import RenderCasinoGames from '../../../component/UI/RenderCasinoGames';
import LoginModal from '../../../component/UI/LoginModal';

const LiveGameData = () => {

  const isFocused = useIsFocused();
  const [liveGame, setLiveGame] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  Socket.on('get-homegames-success', (...args) => {
    setLiveGame(args[0][0]);
  });

  useLayoutEffect(() => {
    if (isFocused && liveGame.length === 0) {
      // console.log('hit');
      let data = {};
      // Socket.emit('get-home-game', data);
    }
  }, [isFocused, Socket]);

  return (
    <View style={styles.container}>
      <View style={styles.gamecontainer}>
        <View style={styles.gameView}>
          <FlatList
            data={liveGame}
            renderItem={({item, index})=> <RenderCasinoGames item={item} index={index} setLoginModal={()=>setModalVisible(true)} />}
            keyExtractor={item => item.id}
            numColumns={2}
          />
        </View>
      </View>
      <LoginModal
        modalVisible={modalVisible}
        setModalVisible={()=>{setModalVisible(false)}}
      />

     
    </View>
  );
};

export default LiveGameData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gamecontainer: {
    margin: 5,
  },
  gameView: {
    // margin
  },
  gameInnerView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameImage: {
    borderRadius: 10,
    height: 100,
    width: 220,
    margin: 10,
  },
  gameText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  filter: {
    position: 'absolute',
    bottom: 50,
    right: 50,
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: '#fff',
  }
});

import React, { useContext } from 'react';
import {StyleSheet, Text, View, FlatList, Image, Pressable} from 'react-native';
import RenderInplaySports from '../../../component/UI/RenderInplaySports';
import { AuthContext } from '../../../store/auth-context';

const SportsInplay = (props) => {
  const authCtx = useContext(AuthContext)

  const atLeastOneObjectsMeetCondition = props.data.some(item => {
    let startdate =  new Date(item?.openDate);
    let durationInMinutes = 15;
    startdate.setMinutes(startdate.getMinutes() - durationInMinutes);

    if(!authCtx.token) {
      // return item?.marketBook?.inplay !== false || startdate < new Date();
      return item?.marketBook?.inplay !== false;
    }else{
      // return (!!authCtx?.availableEventTypes[item?.eventTypeId]) && (item?.marketBook?.inplay !== false || startdate < new Date());
      return (!!authCtx?.availableEventTypes[item?.eventTypeId]) && (item?.marketBook?.inplay !== false);
    }
  });

  return (
    <>
      {atLeastOneObjectsMeetCondition &&
        <View style={styles.container}>
          <View style={styles.gamecontainer}>
            <View style={styles.header}>
              <View style={styles.headLogoCont}>
                <View style={styles.headLogo}>
                  {props.index === 0?
                    <Image source={require('../../../assets/images/iconPNG/cricket-3x.png')} resizeMode="contain" style={{width: 15, height: 15, tintColor: '#DAA520'}} />
                    :
                    props.index === 1?
                      <Image source={require('../../../assets/images/iconPNG/soccer-icon.png')} resizeMode="contain" style={{width: 15, height: 15, tintColor: '#DAA520'}} />
                      :
                      <Image source={require('../../../assets/images/iconPNG/tennis-icon.png')} resizeMode="contain" style={{width: 15, height: 15, tintColor: '#DAA520'}} />
                  }
                </View>
              </View>
              <View style={styles.headTextCont}>
                <Text style={styles.headText}>{props.index === 0 ? "Cricket" : props.index === 1 ? "Soccer" : "Tennis" }</Text>
              </View>
            </View>
            <View style={styles.gameView}>
              <FlatList
<<<<<<< HEAD
                data={props.data}
=======
                //data={props.data}
                data={(Array.isArray(props.data))? props.data?.filter((item) => item?.marketBook?.inplay) : []}
>>>>>>> origin/main
                renderItem={({item, index}) => <RenderInplaySports item={item} setModalVisible={(value)=>{ props.setModalVisible(value);}}  />}
                keyExtractor={item => item._id}
              />
            </View>
          </View>
        </View>
      }
    </> 
  );
};

export default SportsInplay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212A37',
    paddingBottom: 12,
    marginBottom: 7,
    
  },
  gamecontainer: {
  },
  header: {
    flexDirection: 'row',
    marginVertical: 9,
    marginHorizontal: 8,
  },
  headLogoCont: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headLogo: {
    backgroundColor: '#364253',
    height: 30,
    width: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  headTextCont: {
    flex: 3,
    marginLeft: 8,
    justifyContent: 'center',
    // backgroundColor: 'red',
  },
  headText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  headallCont: {
    flex: 3,
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: 'yellow',
  },
  headallText: {
    color: '#DAA520',
    fontSize: 14,
    fontWeight: '500',
  },
  gameView: {
  },
  gameInnerView: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
    flexDirection: 'row',
  },
  gameText: {
    flex: 1,
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
    margin: 8,
    alignSelf: 'center',
    textAlign: 'center',
  },
  iconCont: {
    flexDirection: 'row',
  },
  iconView: {
    margin: 5,
    height: 45,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#c2c6d1',
    shadowOffset: {width: 2, height: 4},
    shadowOpacity: 1,
    shadowRadius: 5,
  },
});

import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  AppState,
  Platform,
} from 'react-native';
import {WebView} from 'react-native-webview';
import Toast from 'react-native-toast-message';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {batch, useDispatch, useSelector} from 'react-redux';

import BettingBetLayCard from '../../component/UI/BettingBetLayCard';
import BookMakerBetCard from '../../component/UI/BookMakerBetCard';
import LiveBetModal from '../../component/UI/LiveBetModal';
import {Socket} from '../../util/socket';
import {AuthContext} from '../../store/auth-context';
import {
  CommonActions,
  useFocusEffect,
  useIsFocused,
} from '@react-navigation/native';
import ConfirmBetLayModal from '../../component/UI/ConfirmBetLayModal';
import {GetMarketsAPI, GetUserDetail, GetUserSetting} from '../../util/http';
import SuccessModal from '../../component/UI/SuccessModal';
import ConfirmBookmakerModal from '../../component/UI/ConfirmBookmakerModal';
import SessionBook from '../../component/UI/SessionBook';
import CashoutModal from '../../component/UI/CashoutModal';
import {Config} from '../../../config';
import moment from 'moment';
import 'moment-timezone';
const {width: windowWidth, height: windowHeight} = Dimensions.get('window');

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const LiveBet = props => {
  const currentEventIdRef = useRef(null);

  const dispatch = useDispatch();
  const {
    allData,
    marketsData,
    videoUrl,
    iphoneUrl,
    scoreUrl,
    betAllData,
    allBetData,
    refreshing,
    modalVisible,
    modalBetVisible,
    modalType,
    betDataType,
    loading,
    successModalVisible,
    playType,
    modalVisibleOdds,
    betDataTypeOdds,
    betTypeOdds,
    betAllDataOdds,
    oddsMarket,
    sessionModalVisible,
    sessionProfit,
    modalCashout,
    marketLoad,
    count,
    placeType,
    limit,
    bookmakerLimit,
    sessionLimit,
    visibility,
  } = useSelector(state => state.liveBet);

  const {eventId, eventTypeId} = props.route.params;
  const authCtx = useContext(AuthContext);

  const isFocused = useIsFocused();
  const [betType, setBetType] = useState(betDataType?.betModalType);
  const [diamondLimitStatus, setDiamondLimitStatus] = useState({matchodds: false, bookmaker: false, session: false});
  const [oddslimit, setoddLimit] = useState('');

  useEffect(() => {
    if (authCtx.token === null || authCtx.token === undefined) {
      props.navigation.navigate('Home');
    }
  }, [authCtx]);

  const onRefresh = React.useCallback(() => {
    dispatch({
      type: 'REFRESHING',
      payload: true,
    });
    wait(2000).then(() =>
      dispatch({
        type: 'REFRESHING',
        payload: false,
      }),
    );
    restart();
  }, [authCtx]);

  const getBalance = async () => {
    const token = JSON.parse(authCtx.token);
    let refreshData = {
      user: {
        _id: token._id,
        key: token.key,
        token: token.verifytoken,
        details: {
          username: token.details.username,
          role: token.details.role,
          status: token.details.status,
        },
      },
    };
    Socket.emit('get-user', refreshData);
    Socket.emit('refresh-balance', refreshData);

    const userDetail = await GetUserDetail({token: token.verifytoken});
    if (userDetail?.logout === true) {
      authCtx.logout();
      props.navigation.navigate('Home');
      Toast.show({
        type: 'error',
        text1: 'Someone Login',
        text2: `Your id has been login somewhere else.`,
      });
    }
  };

  useEffect(() => {
    if (isFocused) {
      dispatch({
        type: 'PLAYTYPE',
        payload: 'Score',
      });
    }
  }, [isFocused]);

  useEffect(() => {
    const handleEventPulse = (...args) => {
      
      const data = args[0];
     //console.log(data);
      
      //  const matchoddlimit = data.find(item => item.marketType === 'MATCH_ODDS');
      //  setoddLimit(matchoddlimit[0]);

      //  const fancylimt = data.find(item => item.marketType === 'Special');
      //  const bookmakerlimit = data.find(item => item.marketType === 'TO Win Toss');
      dispatch({
        type: 'ALLDATA',
        payload: data,
      });

      // if (allData === null) {
      //   if (matchOddsData) {
      //     batch(() => {
      //       dispatch({
      //         type: "SETVIDEO",
      //         payload: matchOddsData.tv,
      //       });
      //       dispatch({
      //         type: "SETSCORE",
      //         payload: matchOddsData.score,
      //       });
      //       dispatch({
      //         type: "SETIPHONE",
      //         payload: matchOddsData.iphone,
      //       });
      //     });
      //   }
      // }
    };

    const disconnectEmit = () => {
      if (authCtx.token && eventId === currentEventIdRef.current) {
        const token = JSON.parse(authCtx.token);
        let data = {
          user: {
            _id: token._id,
            key: token.key,
            details: {
              username: token.details.username,
              role: token.details.role,
              status: token.details.status,
            },
          },
          eventId: eventId,
        };
        Socket.emit('add-to-room', data);
      }
    };

    const handleGetBetsSuccess = (...args) => {
      let allBets = args[0].filter(item => {
        return item.eventId == eventId;
      });

      dispatch({
        type: 'ALLBETDATA',
        payload: allBets,
      });
    };

    const placeBetSuccess = (...args) => {
      batch(() => {
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        dispatch({
          type: 'COUNT',
          payload: 0,
        });
        dispatch({
          type: 'PLACETYPE',
          payload: '',
        });
      });

      if (args[0]?.bet?.eventTypeId !== 'v9') {
        Toast.show({
          type: 'success',
          text1: 'Bet Success',
          text2: `Your bet has been placed successfully.😊`,
        });
      }
      getBalance();
      getBets();
    };

    const placeBetError = (...args) => {
      batch(() => {
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        dispatch({
          type: 'COUNT',
          payload: 0,
        });
        dispatch({
          type: 'PLACETYPE',
          payload: '',
        });
      });
      Toast.show({
        type: 'error',
        text1: 'Trade Placed Error',
        text2: `😔${args[0].message}😔`,
      });
    };

    const getRunnerProfit = (...args) => {
      dispatch({
        type: 'SESSIONPROFIT',
        payload: args[0],
      });
    };

    const editStake = (...args) => {
      Toast.show({
        type: 'success',
        text1: 'Stake Updated Successfully',
      });
    };

    const logoutListen = (...args) => {
      authCtx.logout();
    };

    if (isFocused) {
      currentEventIdRef.current = eventId;

      Socket.on('logout', logoutListen);

      Socket.on(`event-pulse-${eventId}`, handleEventPulse);

      Socket.on('get-bets-success', handleGetBetsSuccess);

      Socket.on('place-bet-success', placeBetSuccess);

      Socket.on('place-bet-error', placeBetError);

      Socket.on('get-runner-profit-success', getRunnerProfit);

      Socket.on('edit-stake-success', editStake);

      if (eventId === currentEventIdRef.current) {
        Socket.on('disconnect', disconnectEmit);
      }
    }

    return () => {
      Socket.off(`event-pulse-${eventId}`, handleEventPulse);
      Socket.off('logout', logoutListen);
      Socket.off('get-bets-success', handleGetBetsSuccess);
      Socket.off('place-bet-success', placeBetSuccess);
      Socket.off('place-bet-error', placeBetError);
      Socket.off('get-runner-profit-success', getRunnerProfit);
      Socket.off('edit-stake-success', editStake);
      Socket.off('disconnect', disconnectEmit);
    };
  }, [isFocused, Socket, eventId, authCtx, loading, videoUrl, allData]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        props.navigation.dispatch(state => {
          const index = state.routes.findIndex(r => r.name === 'Profile');
          const routes = state.routes.slice(0, index + 1);
          const lastValue = state.history[state.history.length - 1];
          const desiredObject = state.routes.find(
            item => item.key === lastValue.key,
          );

          return CommonActions.reset({
            ...state,
            routes,
            index: routes.length - 1,
          });
        });
      };
    }, []),
  );

  useLayoutEffect(() => {
    if (isFocused && authCtx.token) {
      const FetchMarkets = async () => {
        const token = JSON.parse(authCtx.token);

        const data = {
          eventId,
          user_id: token?.details?._id,
        };
        const response = await GetMarketsAPI(data);
        if (response?.success == true) {
          const data = response?.data || [];

          dispatch({
            type: 'MARKETSDATA',
            payload: data,
          });

          const matchOddsData = data.find(
            item => item.marketType === 'MATCH_ODDS',
          );

          if (matchOddsData) {
            batch(() => {
              dispatch({
                type: 'SETVIDEO',
                payload: matchOddsData.url,
              });
              dispatch({
                type: 'SETSCORE',
                payload: matchOddsData.score,
              });
              dispatch({
                type: 'SETIPHONE',
                payload: matchOddsData.iphone,
              });
            });
          }

          if (!!matchOddsData.score) {
            dispatch({
              type: 'PLAYTYPE',
              payload: 'Score',
            });
          } else if (
            (!!matchOddsData.url && Platform.OS === 'android') ||
            (!!matchOddsData.iphone && Platform.OS === 'ios')
          ) {
            dispatch({
              type: 'PLAYTYPE',
              payload: 'Video',
            });
          }
        }
      };

      FetchMarkets();
    }
  }, [eventId, isFocused]);

  useEffect(() => {
    if (isFocused && authCtx.token && eventTypeId) {
      const FetchUserSetting = async () => {
        const token = JSON.parse(authCtx.token);
        const data = {
          eventTypeId: eventTypeId,
          user_id: token?.details?._id,
        };

        const response = await GetUserSetting(data);
       
        if (response?.success == true) {
          //console.log(response?.response?.data);
          dispatch({
            type:
              eventTypeId == '4'
                ? 'CRICKETTIME'
                : eventTypeId == '1'
                ? 'SOCCERTIME'
                : 'TENNISTIME',
            payload: parseInt(response?.response?.data?.betDelay),
          });
          dispatch({
            type: 'BOOKMAKERTIME',
            payload: parseInt(response?.response?.data?.bookmakerDelay),
          });
          dispatch({
            type: 'SESSIONTIME',
            payload: parseInt(response?.response?.data?.sessionDelay),
          });

          setDiamondLimitStatus({
            matchodds: response?.response?.data?.diamondLimit, 
            bookmaker: response?.response?.data?.diamondbLimit, 
            session: response?.response?.data?.diamondfLimit
          })
         
          dispatch({
            type: 'LIIMIT',
            payload: {
              min: response?.response?.data?.minLimit,
              max: response?.response?.data?.maxLimit,
            },
          });
          dispatch({
            type: 'BOOKMAKERLIMIT',
            payload: {
              min: response?.response?.data?.minbookmakerLimit,
              max: response?.response?.data?.maxbookmakerLimit,
            },
          });
          dispatch({
            type: 'SESSIONLIMIT',
            payload: {
              min: response?.response?.data?.minsessoinLimit,
              max: response?.response?.data?.maxsessionLimit,
            },
          });
          dispatch({
            type: 'VISIBILITY',
            payload: {
              MATCH_ODDS: !response?.response?.match_odds,
              Special: !response?.response?.bookmaker,
              SESSION: !response?.response?.fancy,
              Toss: !response?.response?.bookmaker,
            },
          });
        }
      };

      FetchUserSetting();
    }
  }, [eventTypeId, authCtx, isFocused, refreshing]);

  useLayoutEffect(() => {
    if (isFocused) {
      batch(() => {
        dispatch({
          type: 'ALLDATA',
          payload: null,
        });
        dispatch({
          type: 'ALLBETDATA',
          payload: [],
        });
        dispatch({
          type: 'MODALVISIBLEODDS',
          payload: false,
        });
        dispatch({
          type: 'MODALVISIBLE',
          payload: false,
        });
        dispatch({
          type: 'MODALCASHOUT',
          payload: false,
        });
        dispatch({
          type: 'MARKETLOAD',
          payload: false,
        });
      });

      const token = JSON.parse(authCtx.token);
      if (
        token?.verifytoken === undefined ||
        token?.verifytoken.trim().length < 10
      ) {
        authCtx.logout();
        return;
      }
      let data = {
        user: {
          _id: token._id,
          key: token.key,
          details: {
            username: token.details.username,
            role: token.details.role,
            status: token.details.status,
          },
        },
        eventId: eventId,
      };
      Socket.emit('add-to-room', data);
      setTimeout(() => {
        Socket.emit('add-to-room', data);
      }, 3000);
      let betData = {
        user: {
          _id: token._id,
          key: token.key,
          details: {
            username: token.details.username,
            role: token.details.role,
            status: token.details.status,
          },
        },
        filter: {
          eventId: eventId,
          username: token.details.username,
          deleted: false,
          result: 'ACTIVE',
        },
        sort: {placedTime: -1},
      };
      Socket.emit('get-bets', betData);
    }
  }, [isFocused, Socket]);

  const betModalonPress = (name, yesRate, noRate, betModalType, betData) => {
    batch(() => {
      dispatch({
        type: 'BETDATATYPE',
        payload: {
          name: name,
          yesRate: yesRate,
          noRate: noRate,
          betModalType: betModalType,
        },
      });
      dispatch({
        type: 'BETALLDATA',
        payload: betData,
      });
      dispatch({
        type: 'MODALBETVISIBLE',
        payload: true,
      });
    });

    setBetType(betModalType);
  };

  const getBets = () => {
    if (authCtx.token != null && authCtx.token != undefined) {
      const userData = JSON.parse(authCtx.token);
      let betData = {
        user: {
          _id: userData._id,
          key: userData.key,
          details: {
            username: userData.details.username,
            role: userData.details.role,
            status: userData.details.status,
          },
        },
        filter: {
          eventId: eventId,
          username: userData.details.username,
          deleted: false,
          result: 'ACTIVE',
        },
        sort: {placedTime: -1},
      };
      Socket.emit('get-bets', betData);
    }
  };

  const restart = async () => {
    if (authCtx.token != null && authCtx.token != undefined) {
      const userData = JSON.parse(authCtx.token);
      getBalance();

      let data = {
        user: {
          _id: userData._id,
          key: userData.key,
          details: {
            username: userData.details.username,
            role: userData.details.role,
            status: userData.details.status,
          },
        },
        eventId: eventId,
      };
      Socket.emit('add-to-room', data);
      getBets();
    }
  };

  async function setMarketLoad() {
    if (authCtx.token != null && authCtx.token != undefined) {
      setTimeout(() => {
        dispatch({
          type: 'MARKETLOAD',
          payload: !marketLoad,
        });
      }, 500);
      let tokendata = JSON.parse(authCtx.token);

      let newdata;
      if (marketLoad === true) {
        dispatch({
          type: 'ALLBETDATA',
          payload: [],
        });
        newdata = {
          user: {
            _id: tokendata._id,
            key: tokendata.key,
            details: {
              username: tokendata.details.username,
              role: tokendata.details.role,
              status: tokendata.details.status,
            },
          },
          filter: {
            eventId: eventId,
            username: tokendata.details.username,
            deleted: false,
            result: 'ACTIVE',
          },
          sort: {placedTime: -1},
        };
      } else {
        newdata = {
          user: {
            _id: tokendata._id,
            key: tokendata.key,
            details: {
              username: tokendata.details.username,
              role: tokendata.details.role,
              status: tokendata.details.status,
            },
          },
          filter: {
            eventId: eventId,
            deleted: false,
            result: 'ACTIVE',
          },
          sort: {placedTime: -1},
        };
      }

      Socket.emit('get-bets', newdata);
    }
  }

  const checkEventVideo = (url, eventId) => {
    if (url === null || url === undefined) return false;
    // const match = url?.match(/(?:&|\?)eventid=([\d]+)/i);
    // const eventIdInUrl = match ? parseInt(match[1], 10) : null;
    // const isEventIdInUrl = eventIdInUrl == eventId;

    // return isEventIdInUrl;
    return true;
  };

  const sessionBetModalOpen = market => {
    const userData = JSON.parse(authCtx.token);
    let data = {
      user: {
        _id: userData._id,
        key: userData.key,
        details: {
          username: userData.details.username,
          role: userData.details.role,
          status: userData.details.status,
        },
      },
      market: market,
    };
    Socket.emit('get-runner-profit', data);

    batch(() => {
      dispatch({
        type: 'SESSIONPROFIT',
        payload: [],
      });
      dispatch({
        type: 'SESSIONMODALVISIBLE',
        payload: true,
      });
    });
  };

  function setCounting() {
    let all = count - 1;
    if (all > 0) {
      dispatch({
        type: 'COUNT',
        payload: all,
      });
    }
  }

  if (loading && placeType === 'bet') {
    setTimeout(() => {
      setCounting();
    }, 1000);
  }

  return (
    <>
      {isFocused &&
      allData != null &&
      allData.length > 0 &&
      marketsData.length > 0 &&
      marketsData[0]?.eventId === currentEventIdRef.current ? (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          keyboardShouldPersistTaps="always"
          stickyHeaderIndices={
            ((playType === 'Video' && videoUrl) ||
              (playType == 'Score' && scoreUrl)) && [1]
          }>
          <View style={styles.matchCountryHolder}>
            <View style={{flex: 1}}>
              <Text style={styles.matchCountryText}>
                {marketsData[0]?.eventName}
              </Text>
            </View>
            {Config.MarketLoad === true && (
              <TouchableOpacity
                style={{marginRight: 15}}
                onPress={() => setMarketLoad()}>
                <Icon name="th" color="#DAA520" size={20} />
              </TouchableOpacity>
            )}
            {marketsData.length > 0 &&
              marketsData.some(
                a =>
                  a.marketName === 'Match Odds' &&
                  moment(a.openDate).isSameOrBefore(moment()) === true,
              ) &&
              videoUrl !== null &&
              checkEventVideo(videoUrl, eventId) &&
              scoreUrl != undefined &&
              scoreUrl != null && (
                <>
                  <TouchableOpacity
                    style={{marginRight: 15}}
                    onPress={() =>
                      dispatch({
                        type: 'PLAYTYPE',
                        payload: 'Score',
                      })
                    }>
                    <Icon name="flag-checkered" color="#DAA520" size={20} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{marginRight: 10}}
                    onPress={() =>
                      dispatch({
                        type: 'PLAYTYPE',
                        payload: 'Video',
                      })
                    }>
                    <Icon name="video-camera" color="#DAA520" size={20} />
                  </TouchableOpacity>
                </>
              )}
          </View>
          <View style={{backgroundColor: '#151c26'}}>
            {((playType === 'Video' &&
              videoUrl !== null &&
              checkEventVideo(videoUrl, eventId)) ||
              (playType == 'Score' &&
                scoreUrl != undefined &&
                scoreUrl != null)) && (
              <View
                style={[
                  styles.iframeScoreCardView,
                  allData[0]?.eventTypeId == '4' && playType == 'Score'
                    ? styles.crickScoreView
                    : {},
                ]}>
                <WebView
                  androidHardwareAccelerationDisabled={true}
                  source={{
                    uri:
                      checkEventVideo(videoUrl, eventId) &&
                      playType === 'Video' &&
                      marketsData.length > 0 &&
                      marketsData.some(
                        a =>
                          a.marketName === 'Match Odds' &&
                          moment(a.openDate).isSameOrBefore(moment()) &&
                          a?.marketBook?.inplay == true,
                      )
                        ? Platform.OS === 'android'
                          ? videoUrl
                          : iphoneUrl
                        : scoreUrl != undefined && scoreUrl != null
                        ? scoreUrl
                        : '',
                    headers: {Referer: 'https://clubosg.com'},
                  }}
                  nestedScrollEnabled
                  automaticallyAdjustContentInsets={true}
                  scrollEnabled={false}
                  startInLoadingState={true}
                  style={{
                    flex: 1,
                    backgroundColor: '#151C26',
                    opacity: 0.99,
                  }}
                />
              </View>
            )}
            <View style={[styles.scoreCardButtonView, {flexDirection: 'row'}]}>
              <TouchableOpacity
                style={[
                  styles.scoreCardInvestButton,
                  {backgroundColor: '#DAA520'},
                ]}
                onPress={() => {
                  // setModalVisible(true);
                  // setModalType("total");
                }}>
                <Text style={[styles.investButtonText, {color: '#212A37'}]}>
                  All
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={marketLoad}
                style={[
                  styles.scoreCardInvestButton,
                  {backgroundColor: '#212A37'},
                ]}
                onPress={() => {
                  dispatch({
                    type: 'MODALVISIBLE',
                    payload: true,
                  });
                  dispatch({
                    type: 'MODALTYPE',
                    payload: 'allbet',
                  });
                }}>
                <Text style={[styles.investButtonText, {color: '#fff'}]}>
                  Active {allBetData.length > 1 ? 'Bets' : 'Bet'}{' '}
                  {marketLoad ? '' : `(${allBetData.length})`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {allData
            .sort((a, b) => {
              const priority = [
                'Match Odds',
                'Special',
                'Bookmaker',
                'TO Win Toss',
              ];

              const priorityA = priority.indexOf(a.marketName);
              const priorityB = priority.indexOf(b.marketName);

              if (priorityA !== -1 && priorityB !== -1) {
                return priorityA - priorityB; // Both are in priority list, sort by their index.
              }

              if (priorityA !== -1) return -1; // `a` is in priority list, put it first.
              if (priorityB !== -1) return 1; // `b` is in priority list, put it first.

              return 0;
            })
            .map(a => {

              return (
                <View key={a._id} >
                  {a.marketType != 'SESSION' &&
                    // a.marketTypeStatus != 0 &&
                    marketsData[0]?.competitionName != 'Others' &&
                    !!visibility[a.marketType] && (
                      <View style={styles.bettingCardView}>
                        <View
                          style={{
                            marginBottom: 3,
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={[
                              styles.matchCountryText,
                              {color: '#DAA520', fontSize: 14, flex: 1},
                            ]}>
                            {a.marketName}
                          </Text>

                          {(a?.marketName === 'Match Odds' ||
                            a?.marketName === 'Bookmaker') && (
                            <TouchableOpacity
                              disabled={
                                allBetData.some(
                                  item => item.marketId === a.marketId,
                                )
                                  ? marketLoad
                                  : true
                              }
                              style={styles.cashoutButton}
                              onPress={() => {
                                dispatch({
                                  type: 'MODALCASHOUT',
                                  payload: true,
                                });
                                dispatch({
                                  type: 'ODDSMARKET',
                                  payload: {
                                    data: a,
                                    allBetData: allBetData.filter(item => {
                                      return item.marketId === a.marketId;
                                    }),
                                  },
                                });
                              }}>
                              <Text
                                style={[
                                  styles.investButtonText,
                                  {color: '#fff'},
                                ]}>
                                CashOut
                              </Text>
                            </TouchableOpacity>
                          )}
                          <Text
                            style={[
                              styles.matchCountryText,
                              {
                                color: '#fff',
                                fontSize: 10,
                                flex: 1,
                                textAlign: 'right',
                              },
                            ]}>
                            {/* Min :{' '} */}
                            {/* {(a?.marketName === 'Match Odds')?
                              (limitStatus?.matchodds)?
                                (a?.limit_peroirty)?
                                  a?.minlimit
                                  :
                                  a?.bminlimit
                                :
                                limit.min || 'N/A'
                              :
                              (a?.marketName === 'Bookmaker')?
                                (limitStatus?.bookmaker)?
                                  (a?.limit_peroirty)?
                                    a?.minlimit
                                    :
                                    a?.bminlimit
                                  :
                                  bookmakerLimit.min || 'N/A'
                                :
                                ''
                            } */}
                            {(a?.limit_peroirty)?
                              `Min: ${a?.minlimit}  Max: ${a?.maxlimit}`
                              :
                              (a?.marketName === 'Match Odds')?
                                (diamondLimitStatus?.matchodds)?
                                  `Min: ${a?.bminlimit} Max: ${a?.bmaxlimit}`
                                  :
                                  `Min: ${limit.min || 'N/A'}  Max: ${limit.max || 'N/A'}`
                                :
                                (a?.marketName === 'Bookmaker' || a?.marketName === 'TO Win Toss')?
                                  (diamondLimitStatus?.bookmaker)?
                                    `Min: ${a?.bminlimit} Max: ${a?.bmaxlimit}`
                                    :
                                    `Min: ${bookmakerLimit.min || 'N/A'}  Max: ${bookmakerLimit.max || 'N/A'}`
                                :
                                'N/A'
                            }
                            {/* {a?.marketName === 'Match Odds'
                              ? limit.min || 'N/A'
                              : a?.marketName === 'Bookmaker'
                              ? bookmakerLimit.min || 'N/A'
                              : 'N/A'} */}
                            {/* {'  '}
                            Max:{' '}
                            
                            {a?.marketName === 'Match Odds'
                              ? limit.max || 'N/A'
                              : a?.marketName === 'Bookmaker'
                              ? bookmakerLimit.max || 'N/A'
                              : 'N/A'} */}
                          </Text>
                        </View>

                        <BookMakerBetCard
                          data={a}
                          marketsData={marketsData}
                          allBetData={allBetData}
                          marketLoad={marketLoad}
                          userId={
                            !!authCtx.token
                              ? JSON.parse(authCtx.token)?.details?.username
                              : ''
                          }
                        />
                      </View>
                    )}
                </View>
              );
            })}
          {allData.some(item => item.marketType === 'SESSION') &&
            !!visibility['SESSION'] && (
              <View style={styles.bettingCardView}>
                <View style={{marginBottom: 3, flexDirection: 'row'}}>
                  <Text
                    style={[
                      styles.matchCountryText,
                      {color: '#DAA520', fontSize: 14, flex: 1},
                    ]}>
                    Session
                  </Text>
                  <Text
                    style={[
                      styles.matchCountryText,
                      {color: '#fff', fontSize: 10},
                    ]}>
                    {/* Min : {sessionLimit?.min || 'N/A'}
                    {'  '}
                    Max: {sessionLimit?.max || 'N/A'} */}
                  </Text>
                </View>
                {allData.map(item => {
                  return (
                    <View key={item._id}>
                      {item.marketType === 'SESSION' && (
                        <BettingBetLayCard
                          data={item}
                          allBetData={allBetData}
                          marketLoad={marketLoad}
                          betModalonPress={(
                            name,
                            yesRate,
                            noRate,
                            betModalType,
                            betData,
                          ) =>
                            betModalonPress(
                              name,
                              yesRate,
                              noRate,
                              betModalType,
                              betData,
                            )
                          }
                          sessionBetModalOpen={market =>
                            sessionBetModalOpen(market)
                          }
                          limit={(item?.limit_peroirty)?
                            {min: item?.minlimit || 'N/A', max: item?.maxlimit || 'N/A'}
                            :
                            (diamondLimitStatus?.session)?
                            {min: item?.bminlimit || 'N/A', max: item?.bmaxlimit || 'N/A'}
                            :
                            {min: sessionLimit?.min || 'N/A', max: sessionLimit?.max || 'N/A'}
                          }
                        />
                      )}
                    </View>
                  );
                })}
              </View>
            )}

          {modalVisible && (
            <LiveBetModal
              modalVisible={modalVisible}
              setModalVisible={() =>
                dispatch({
                  type: 'MODALVISIBLE',
                  payload: false,
                })
              }
              type={modalType}
              allBetData={allBetData}
              eventId={eventId}
            />
          )}
          {modalBetVisible && !loading && (
            <ConfirmBetLayModal
              modalVisible={modalBetVisible}
              betDataType={betDataType}
              betType={betType}
              betAllData={betAllData}
            />
          )}
          {successModalVisible && (
            <SuccessModal
              modalVisible={successModalVisible}
              setModalVisible={() =>
                dispatch({
                  type: 'SUCCESSMODALVISIBLE',
                  payload: false,
                })
              }
            />
          )}
          {sessionModalVisible && (
            <SessionBook
              betmodalVisible={sessionModalVisible}
              setBetModalVisible={() =>
                dispatch({
                  type: 'SESSIONMODALVISIBLE',
                  payload: false,
                })
              }
              runners={sessionProfit}
            />
          )}
          {modalVisibleOdds && !loading && (
            <ConfirmBookmakerModal
              modalVisible={modalVisibleOdds}
              betDataType={betDataTypeOdds}
              betType={betTypeOdds}
              betAllData={betAllDataOdds}
              allData={oddsMarket}
            />
          )}

          {modalCashout && !loading && (
            <CashoutModal
              modalVisible={modalCashout}
              betDataType={betDataTypeOdds}
              betType={betTypeOdds}
              betAllData={betAllDataOdds}
              allData={oddsMarket}
            />
          )}
        </ScrollView>
      ) : (
        <>
          {allData !== null && (
            <View
              style={{
                height: windowHeight - 100,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <LottieView
                source={require('../../assets/images/animation/ZoloWarning.json')}
                autoPlay={true}
                style={styles.warningAnimation}
              />
              <Text style={styles.noBetText}>
                Currently, You Cannot Trade in this match!
              </Text>
              <TouchableOpacity
                style={styles.goBackButtonStyles}
                onPress={() => {
                  props.navigation.goBack();
                }}>
                <Text style={{color: '#fff', fontSize: 18}}>Go Back</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      {(loading || allData === null) && (
        <View style={styles.loadingStyles}>
          {placeType === 'bet' ? (
            <Text style={{fontSize: 50, fontWeight: 'bold', color: '#DAA520'}}>
              {count}
            </Text>
          ) : (
            <ActivityIndicator size={'large'} color={'#DAA520'} />
          )}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  matchCountryHolder: {
    backgroundColor: '#364253',
    minHeight: 33,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  matchCountryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  iframeScoreCardView: {
    overflow: 'hidden',
    marginHorizontal: 7,
    height: 235,
    borderRadius: 8,
  },
  crickScoreView: {
    height: windowWidth * 0.25,
  },
  scoreCardButtonView: {
    flexDirection: 'row',
    marginVertical: 8,
    marginHorizontal: 5,
  },
  scoreCardInvestButton: {
    flex: 1,
    height: 35,
    marginHorizontal: 4,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  investButtonText: {
    color: '#212A37',
    fontSize: 12,
    fontWeight: '400',
  },
  bettingCardView: {
    marginHorizontal: 7,
    marginBottom: 7,
    backgroundColor: '#1e252e',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 11,
    borderWidth: 0.2,
    borderColor: '#fff',
  },
  loadingStyles: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  goBackButtonStyles: {
    backgroundColor: '#DAA520',
    marginHorizontal: 4,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },

  noBetText: {
    paddingHorizontal: 10,
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },

  warningAnimation: {
    width: 200,
    height: 200,
    position: 'absolute',
    top: 0,
    
  },
  cashoutButton: {
    height: 30,
    paddingHorizontal: 10,
    marginHorizontal: 4,
    borderRadius: 3,
    backgroundColor: '#DAA520',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LiveBet;

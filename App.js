import React, {
  useState,
  useContext,
  useLayoutEffect,
  useEffect,
  useRef,
} from "react";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerToggleButton,
} from "@react-navigation/drawer";
import { Provider as StoreProvider, batch, useDispatch } from "react-redux";

import LottieView from "lottie-react-native";

import Icon from "react-native-vector-icons/Ionicons";
import AuthContextProvider, { AuthContext } from "./src/store/auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SplashScreen from "react-native-splash-screen";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

import ManualDrawer from "./src/component/UI/ManualDrawer";

import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  LogBox,
  SafeAreaView,
} from "react-native";

import {
  CasinoAPI,
  GetCasinoPermission,
  GetSetting,
  GetUserDetail,
  GetUserSetting,
  UserSettingAPI,
} from "./src/util/http";

import CasinoBalanceModal from "./src/component/UI/CasinoBalanceModal";
import { Config } from "./config";
import store from "./src/reduxStorage/store";
import { Socket } from "./src/util/socket";
import BottomTab from "./src/routes/BottomTab";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Drawer = createDrawerNavigator();

function LogoTitle() {
  return (
    <Image
      style={{
        height: Config.logoHeight,
        width: Config.logoWidth,
        marginLeft: 0,
        marginBottom: 0,
      }}
      resizeMode="contain"
      source={Config.logoUrl}
    />
  );
}

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#50c878" }}
      text1Style={{ fontSize: 16, fontWeight: "700", color: "#000" }}
      text2Style={{ fontSize: 14, fontWeight: "600", color: "#000" }}
      text2NumberOfLines={2}
    />
  ),

  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "#FF0000" }}
      text1Style={{ fontSize: 16, fontWeight: "700", color: "#000" }}
      text2Style={{ fontSize: 14, fontWeight: "600", color: "#000" }}
      text2NumberOfLines={2}
    />
  ),
};

const Auth = () => {
  return (
    <SafeAreaView
      style={{
        height: windowHeight,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
      }}
    >
      <View
        style={{
          marginTop: 200,
        }}
      >
        <Image
          style={{ height: 85 }}
          resizeMode="contain"
          source={Config.logoUrl}
        />
      </View>

      <LottieView
        source={require("./src/assets/images/animation/Sports.json")}
        autoPlay={true}
        style={{
          width: "100%",
          height: "100%",
          // position: "absolute",
          top: 0,
        }}
      />
    </SafeAreaView>
  );
};

// ..
export const LinkingConfig = {
  prefixes: ["zolowin://"],
  config: {
    screens: {
      Drawer: {
        screens: {
          Home: "home",
          Live: "live",
        },
      },
    },
  },
};
// ..

function Navigation({ loading }) {
  const authCtx = useContext(AuthContext);

  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef();
  const [currentRoute, setCurrentRoute] = useState("");
  const [casinoModal, setCasinoModal] = useState(false);

  
  useEffect(() => {
    const logoutAppListen = (...args) => {
      console.log("Logout Data: ", args[0]);
      let token = JSON.parse(authCtx.token);
      console.log("Logout Data: ", args[0], token);
      if (
        args[0] !== undefined &&
        args[0] !== null &&
        token.verifytoken === args[0]?.user?.token
      ) {
        authCtx.logout();
      }
    };

    const getUserListen = (...args) => {
      authCtx.setBalance(JSON.parse(args[0].balance));
      authCtx.setExpo(JSON.parse(args[0].exposure));
    };

    Socket.on("get-user-success", getUserListen);
    Socket.on("logout", logoutAppListen);

    return () => {
      Socket.off("get-user-success", getUserListen);
      Socket.off("logout", logoutAppListen);
    };
  }, []);

  useEffect(() => {
    if (authCtx.token != null && authCtx.token != undefined) {
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
      Socket.emit("get-user", refreshData);
      Socket.emit("refresh-balance", refreshData);

      setTimeout(async () => {
        const userDetail = await GetUserDetail({ token: token.verifytoken });

        if (userDetail?.logout === true) {
          authCtx.logout();
          Toast.show({
            type: "error",
            text1: "Someone Login",
            text2: `Your id has been login somewhere else.`,
          });
        }
      }, 1000);
    }
  }, [currentRoute]);


  useEffect(() => {
    const FetchCasinoPermission = async() => {
      if(authCtx.token) {
        if (authCtx.casinoPermit.length === 0) {
          const getPermitRes = await GetCasinoPermission();
          if(getPermitRes) {
            authCtx.casinoPermissionSetter(getPermitRes);
          }
        }
      }
    }
    FetchCasinoPermission();

    const FetchUserSetting = async() => {
      if(authCtx.token == null || authCtx.token == undefined) return;

      const userData = JSON.parse(authCtx?.token);
      const data = {
        user_id: userData?.details?._id
      }
      const userSetting = await UserSettingAPI(data);
      if(userSetting.success == true) {
        const result = {};
        const availableEventTypesSet = new Set(userSetting?.user?.availableEventTypes);

        userSetting?.eventTypes.forEach(event => {
          const eventTypeId = event?.eventType?.id;
          const isAvailable = availableEventTypesSet.has(eventTypeId);
        
          // If the eventTypeId is in availableEventTypes, use its visible_status
          // Otherwise, if the eventTypeId is not in availableEventTypes, set visible_status to false
          result[eventTypeId] = isAvailable ? event.visible_status : false;
        
          // Remove the processed eventTypeId from the set
          availableEventTypesSet.delete(eventTypeId);
        });

        // For any remaining IDs in availableEventTypes that weren't in eventTypes
        availableEventTypesSet.forEach(id => {
          result[id] = false;
        });

        authCtx.setEventTypes(result);
      }
    }

    FetchUserSetting();

  }, [authCtx.token, currentRoute]);


  const balanceRefresh = async () => {
    if (authCtx.token != null && authCtx.token != undefined) {
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

      Socket.emit("get-user", refreshData);
      Socket.emit("refresh-balance", refreshData);

      const userDetail = await GetUserDetail({ token: token.verifytoken });

      if (userDetail?.logout === true) {
        authCtx.logout();
        Toast.show({
          type: "error",
          text1: "Someone Login",
          text2: `Your id has been login somewhere else.`,
        });
      }
    }
  };

  return (
    <>
      <NavigationContainer
        theme={{
          colors: {
            background: "#151c26",
          },
        }}
        linking={LinkingConfig}
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = navigationRef.getCurrentRoute().name;
          setCurrentRoute(navigationRef.getCurrentRoute().name);
        }}
        onStateChange={async () => {
          setCurrentRoute(navigationRef.getCurrentRoute().name);
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.getCurrentRoute().name;
          if (previousRouteName != currentRouteName) {
            // Save the current route name for later comparison
            routeNameRef.current = currentRouteName;

            // Replace the line below to add the tracker from a mobile analytics SDK
            // await trackScreenView(currentRouteName);
          }
        }}
      >
        <Drawer.Navigator
          drawerPosition="right"
          initialRouteName="Drawer"
          drawerContent={(props) => <ManualDrawer {...props} />}
          screenOptions={({ navigation, route }) => ({
            headerShown: !loading,
            headerStyle: { backgroundColor: "#212A37" },
            headerTintColor: "#fff",
            sceneContainerStyle: {
              backgroundColor: "#212A37",
            },
            headerTitleAlign: "center",
            headerLeft: (props) => <LogoTitle {...props} />,
            contentStyle: { backgroundColor: "#212A37" },
            drawerStyle: {
              backgroundColor: "#212A37",
              width: (70 * windowWidth) / 100,
            },
            drawerPosition: "right",
            headerTitle: "",
            headerRight: () => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#151C26",
                    paddingVertical: 5,
                    paddingHorizontal: 9,
                    borderRadius: 20,
                  }}
                  onPress={() => {
                    navigation.navigate("Wallet");
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontSize: 15, fontWeight: "700" }}
                  >
                    {`₹ ${authCtx.balance.toFixed(0)}`}
                  </Text>
                  <Image
                    source={require("./src/assets/images/navigationIcon/plusHeader.png")}
                    style={{
                      height: 13,
                      width: 13,
                      marginLeft: 5,
                      tintColor: "#DAA520",
                    }}
                    tintColor={"#DAA520"}
                  />
                </TouchableOpacity>
               
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#151C26",
                      paddingVertical: 5,
                      paddingHorizontal: 9,
                      borderRadius: 20,
                      marginLeft: 5,
                    }}
                    onPress={() => {
                      authCtx.token === null || authCtx.token === undefined
                        ? ""
                        : navigation.navigate("CurrentBets");
                    }}
                  >
                    <Text
                      style={{
                        color: "#FF0000",
                        fontSize: 15,
                        fontWeight: "700",
                      }}
                    >
                      Ex: {authCtx.expo.toFixed(0)}
                    </Text>
                  </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#151C26",
                    paddingVertical: 5,
                    paddingHorizontal: 5,
                    borderRadius: 20,
                    marginLeft: 2,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    balanceRefresh();
                  }}
                >
                  <Icon name="refresh" color={"#DAA520"} size={20} />
                </TouchableOpacity>
                <DrawerToggleButton tintColor={"#fff"} />
              </View>
            ),
          })}
        >
          <Drawer.Screen
            name="Drawer"
            component={loading ? Auth : BottomTab}
            options={{
              drawerIcon: ({ color, size }) => (
                <Icon name="envelope" color={color} size={size} />
              ),
              // headerShown: false,
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
      <CasinoBalanceModal
        modalVisible={casinoModal}
        setModalVisible={() => setCasinoModal(false)}
      />
    </>
  );
}

function Root() {
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    async function fetchToken() {
      SplashScreen.hide();
      const storedToken = await AsyncStorage.getItem("token");
      const userBalance = await AsyncStorage.getItem("balance");
      const userExpo = await AsyncStorage.getItem("expo");
      const userStake = await AsyncStorage.getItem("stake");
      if (storedToken) {
        authCtx.authenticate(storedToken);
      }
      if (userBalance) {
        authCtx.setBalance(JSON.parse(userBalance));
      }
      if (userExpo) {
        authCtx.setExpo(JSON.parse(userExpo));
      }
      if (storedToken) {
        authCtx.authenticate(storedToken);
      }
      if (userStake) {
        dispatch({
          type: "ALLSTAKES",
          payload: userStake,
        });
      } else {
        let newArray = [];
        for (let i = 1; i < 10; i++) {
          let item = { amount: i * 1000, indexAt: `${i}` };
          newArray.push(item);
        }
        let item = { amount: "Edit", indexAt: `edit` };
        newArray.push(item);
        dispatch({
          type: "ALLSTAKES",
          payload: newArray,
        });
      }

     
      // const userSetting = await GetUserSetting({});
      // if (userSetting.error === false) {
      //   const cricketData = userSetting.data.find(
      //     (item) => item.eventType.id === "4"
      //   );
      //   const soccerData = userSetting.data.find(
      //     (item) => item.eventType.id === "1"
      //   );
      //   const tennisData = userSetting.data.find(
      //     (item) => item.eventType.id === "2"
      //   );
      //   const virtualData = userSetting.data.find(
      //     (item) => item.eventType.id === "v9"
      //   );
      //   const bbbData = userSetting.data.find(
      //     (item) => item.eventType.id === "b9"
      //   );

      //   batch(() => {
      //     dispatch({
      //       type: "CRICKETTIME",
      //       payload: cricketData.betDelay,
      //     });
      //     dispatch({
      //       type: "SOCCERTIME",
      //       payload: soccerData.betDelay,
      //     });
      //     dispatch({
      //       type: "TENNISTIME",
      //       payload: tennisData.betDelay,
      //     });
      //     dispatch({
      //       type: "VIRTUALTIME",
      //       payload: virtualData.betDelay,
      //     });
      //     dispatch({
      //       type: "BOOKMAKERTIME",
      //       payload: cricketData.bookmakerDelay,
      //     });
      //     dispatch({
      //       type: "SESSIONTIME",
      //       payload: cricketData.sessionDelay,
      //     });
      //     dispatch({
      //       type: "BBBTIME",
      //       payload: bbbData.betDelay,
      //     })
      //   });
      // }

      if (storedToken) {
        const userData = JSON.parse(storedToken);
        const userDetail = await GetUserDetail({ token: userData.verifytoken });

        if (userDetail.success == true && userDetail?.logout != true) {
          authCtx.setBalance(JSON.parse(userDetail.doc.balance));
          authCtx.setCasinoBalance(userDetail.doc.mainbalance * 10);
          authCtx.setExpo(JSON.parse(userDetail.doc.exposure));
        }

        if (userDetail?.logout === true) {
          authCtx.logout();
          Toast.show({
            type: "error",
            text1: "Someone Login",
            text2: `Your id has been login somewhere else.`,
          });
        }
      }

      setTimeout(() => {
        setLoading(false);
      }, 1000);
      const casinoData = await CasinoAPI();
      if (casinoData.success === true) {
        authCtx.setCasino(casinoData.games.casinogames);
      }
    }

    fetchToken();
  }, []);

  return <Navigation loading={loading} />;
}

const App = () => {
  LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
  LogBox.ignoreAllLogs(); //Ignore all log notifications

  return (
    <>
      <StoreProvider store={store}>
        <AuthContextProvider>
          <Root />
        </AuthContextProvider>
        <Toast zIndex={9999} config={toastConfig} />
      </StoreProvider>
    </>
  );
};

export default App;

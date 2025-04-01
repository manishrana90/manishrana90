import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useContext, useLayoutEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import FadeCarousel from "rn-fade-carousel";

import { BannerAPI } from "../../../util/http";
import { Config } from "../../../../config";
import { AuthContext } from "../../../store/auth-context";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

const HomeHeader = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const [images, setImagesArray] = useState([]);
  const [apiGet, setApiGet] = useState(false);

  useLayoutEffect(() => {
    if (isFocused) {
      const getImages = async () => {
        let getImageArr = await BannerAPI();
        // if (false && getImageArr.error == false && images.length != getImageArr.response.length) {
        if (getImageArr.error == false && images.length != getImageArr.response.length) {
          let imagesArrayNew = [];
          for (let i = 0; i < getImageArr.response.length; i++) {
            imagesArrayNew.push(
              <TouchableOpacity
                onPress={() => {
                  CasinoTypeNavigator();
                }}
              >
                <Image
                  source={{
                    uri: `${getImageArr.response[i].image}`,
                  }}
                  style={[styles.imageScroll]}
                />
              </TouchableOpacity>
            );
          }
          setImagesArray(imagesArrayNew);
          setApiGet(true);
        }  
        // else {
        //   let imagesArrayNew = [];
        //   for (let i = 0; i < 6; i++) {
        //     imagesArrayNew.push(
        //       <TouchableOpacity
        //         onPress={() => {
        //           CasinoTypeNavigator();
        //         }}
        //         style={{backgroundColor: 'red'}}
        //       >
        //         <Image
        //           source={{
        //             uri: `https://kushubmedia.com/build/new-osg-app/slider/${i + 1}.png`,
        //           }}
        //           style={styles.imageScroll}
        //           resizeMode="contain"
        //         />
        //       </TouchableOpacity>
        //     );
        //   }
        //   setImagesArray(imagesArrayNew);
        //   setApiGet(false);
        // }
      };
      getImages();
    }
  }, [isFocused, setImagesArray, BannerAPI]);


  const CasinoTypeNavigator = () => {
    if(authCtx.casinoPermit.length>0){
      if(authCtx.casinoPermit[0] && authCtx.casinoPermit[0]?.visible) {
        navigation.navigate("Casino", { filter: "INSTANTWIN" });
      }else{ 
        navigation.navigate('CasinoAura');
      }
    }else {
      // navigation.navigate("Casino", { filter: "INSTANTWIN" });
    }
  }

  return (
    <View style={styles.container}>
      <FadeCarousel
        elements={images}
        containerStyle={[styles.carouselContainer]}
        fadeDuration={3000}
        stillDuration={3000}
        start={true}
      />
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 7,
  },
  signupCont: {
    flexDirection: "row",
  },
  signupButton: {
    flex: 1,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    color: "#fff",
    fontSize: 18,
    margin: 5,
  },
  filterCont: {
    margin: 10,
    paddingBottom: 10,
    borderBottomColor: "#fff",
    borderBottomWidth: 0.2,
  },
  filterView: { marginHorizontal: 10 },
  filterText: {
    color: "#fff",
    fontSize: 14,
    marginVertical: 3,
  },
  activeFilter: {
    backgroundColor: "#0C53A6",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  carouselContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: screenWidth,
    height: 100,
  },
  imageScroll: {
    width: screenWidth,
    height: 100,
  },
});

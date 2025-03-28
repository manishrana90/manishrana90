import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';

const windowWidth = Dimensions.get('window').width;

const Preview = ({style, item, imageKey, onPress, index, active, local}) => {

  return (
    <View
      style={[styles.videoContainer]}
      //   onPress={() => onPress(item)}
    >
      <View style={[styles.imageContainer]}>
        {item.banner ? (
          <Image
            style={[styles.videoPreview]}
            source={item.banner}
            resizeMethod='resize'
            resizeMode='center'
          />
        ) : (
          <View></View>
        )}
      </View>
    </View>
  );
};

export default Preview;

const styles = StyleSheet.create({
  videoContainer: {
    width: windowWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPreview: {
    height: 145,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  
});

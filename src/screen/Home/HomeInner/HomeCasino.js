import React from 'react';
import { View, Image, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";

const sliderData = [
  { image_id: 1, image: 'https://nd.sprintstaticdata.com/casino-icons/lc/teen20.jpg', name: 'teen20' },
  { image_id: 2, image: 'https://nd.sprintstaticdata.com/casino-icons/lc/teen8.jpg', name: 'teen8' },
  { image_id: 3, image: 'https://nd.sprintstaticdata.com/casino-icons/lc/dt6.jpg', name: 'dt6' },
  { image_id: 4, image: 'https://nd.sprintstaticdata.com/casino-icons/lc/card32.jpg', name: 'card32' },
  { image_id: 5, image: 'https://nd.sprintstaticdata.com/casino-icons/lc/lucky7eu.jpg', name: 'lucky7eu' },
  { image_id: 6, image: 'https://nd.sprintstaticdata.com/casino-icons/lc/war.jpg', name: 'war' },
  { image_id: 7, image: 'https://nd.sprintstaticdata.com/casino-icons/lc/cmatch20.jpg', name: 'cmatch20' },
  { image_id: 8, image: 'https://nd.sprintstaticdata.com/casino-icons/lc/teen9.jpg', name: 'teen9' },
  { image_id: 9, image: 'https://nd.sprintstaticdata.com/casino-icons/lc/dt20.jpg', name: 'dt20' },
  { image_id: 10, image: 'https://nd.sprintstaticdata.com/casino-icons/lc/dt202.jpg', name: 'dt202' },
  { image_id: 11, image: 'https://nd.sprintstaticdata.com/casino-icons/lc/lucky7.jpg', name: 'lucky7' },
  { image_id: 12, image: 'https://nd.sprintstaticdata.com/casino-icons/lc/3cardj.jpg', name: '3cardj' },
  { image_id: 13, image: 'https://nd.sprintstaticdata.com/casino-icons/lc/aaa.jpg', name: 'aaa' },
  { image_id: 14, image: 'https://nd.sprintstaticdata.com/casino-icons/lc/teen.jpg', name: 'teen' },
  { image_id: 15, image: 'https://nd.sprintstaticdata.com/casino-icons/lc/poker.jpg', name: 'poker' },
  { image_id: 16, image: 'https://nd.sprintstaticdata.com/casino-icons/lc/poker20.jpg', name: 'poker20' },
  { image_id: 17, image: 'https://nd.sprintstaticdata.com/casino-icons/lc/queen.jpg', name: 'queen' },
//   { image_id: 18, image: 'https://nd.sprintstaticdata.com/casino-icons/lc/baccarat.jpg', name: 'baccarat' },
//   { image_id: 19, image: 'https://nd.sprintstaticdata.com/casino-icons/lc/baccarat2.jpg', name: 'baccarat2' },
  { image_id: 18, image: 'https://nd.sprintstaticdata.com/casino-icons/lc/ab20.jpg', name: 'ab20' },
//   { image_id: 21, image: 'https://nd.sprintstaticdata.com/casino-icons/lc/btable.jpg', name: 'btable' },
  { image_id: 19, image: 'https://nd.sprintstaticdata.com/casino-icons/lc/abj.jpg', name: 'abj' },
//   { image_id: 23, image: 'https://nd.sprintstaticdata.com/casino-icons/lc/race20.jpg', name: 'race20' },
];

const { width } = Dimensions.get('window');
const imageSize = (width / 3) - 15;
const chunkSize = 6;
const totalColumns = 3;

// Function to ensure each page has exactly `chunkSize` items
const getFormattedPages = (data, chunkSize) => {
  let pages = [];
  for (let i = 0; i < data.length; i += chunkSize) {
    let chunk = data.slice(i, i + chunkSize);
    // Fill remaining space with empty objects
    while (chunk.length < chunkSize) {
      chunk.push({ image_id: `empty-${chunk.length}`, image: null, name: '' });
    }
    pages.push(chunk);
  }
  return pages;
};

const HomeCasino = () => {
  const navigation = useNavigation();
  const pages = getFormattedPages(sliderData, chunkSize);

  return (
    <FlatList
      data={pages}
      keyExtractor={(item, index) => index.toString()}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <View style={styles.page}>
          <FlatList
            data={item}
            keyExtractor={(imgItem) => imgItem.image_id.toString()}
            numColumns={totalColumns}
            renderItem={({ item }) => (
              item.image ? (
                <TouchableOpacity
                  style={styles.imageContainer}
                  onPress={() => {
                    navigation.navigate('DiamondTable', { image: item.image, eventname: item.name });
                  }}
                >
                  <Image source={{ uri: item.image }} style={styles.image} />
                </TouchableOpacity>
              ) : (
                <View style={[styles.imageContainer, styles.emptyBox]} />
              )
            )}
          />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  page: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  imageContainer: {
    margin: 5,
  },
  image: {
    width: imageSize,
    height: 90,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  emptyBox: {
    width: imageSize,
    height: 90,
    backgroundColor: 'transparent', // Empty placeholder to maintain layout
  },
});

export default HomeCasino;

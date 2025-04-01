import React from 'react';
import {StyleSheet, Text, View, ScrollView, TouchableOpacity, } from 'react-native';
import {FlatListSlider} from 'react-native-flatlist-slider';
import Preview from '../../Home/HomeInner/Preview';


const LiveHeader = props => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal={true} style={styles.filterCont} showsHorizontalScrollIndicator={false}>
        {
          props.providerList.map(item => {
            return(
              <TouchableOpacity 
                style={[ styles.filterView, props.selectedId === item.id && styles.activeFilter,]}
                onPress={() => { props.onFilterProvider(item.id);}}
                key={item.id}
                >
                <Text style={[styles.filterText, props.selectedId === item.id && styles.activeFilterText,]}>{item.name}</Text>
              </TouchableOpacity>
            );
          })
        }
      </ScrollView>
    </View>
  );
};

export default LiveHeader;

const styles = StyleSheet.create({
  
  container: {
    backgroundColor: "#151C26",
  },
  filterCont: {
    marginHorizontal: 7,
    marginTop: 7,
    marginBottom: 9,
  },
  filterView: {
    marginHorizontal: 3,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#212A37',
  },
  filterText: {
    color: '#959CA7',
    fontSize: 12,
    fontWeight: '500',
  },
  activeFilterText : {
    color: '#fff',
  },
  activeFilter: {
    backgroundColor: '#DAA520',
  },

});

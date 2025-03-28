import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const CasinoHeader = (props) => {
  const scrollViewRef = useRef();

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      scrollViewRef.current?.scrollTo(0, 0, true);
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal={true}
        style={styles.filterCont}
      >
        <TouchableOpacity
          style={[
            styles.filterView,
            props.gameFilter === "LIVECASINO" && styles.activeFilter,
          ]}
          onPress={() => {
            props.filterCasino("LIVECASINO");
          }}
        >
          <Text
            style={[
              styles.filterText,
              props.gameFilter === "LIVECASINO" && styles.activeFilterText,
            ]}
          >
            Live Casino
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterView,
            props.gameFilter === "INSTANTWIN" && styles.activeFilter,
          ]}
          onPress={() => {
            props.filterCasino("INSTANTWIN");
          }}
        >
          <Text
            style={[
              styles.filterText,
              props.gameFilter === "INSTANTWIN" && styles.activeFilterText,
            ]}
          >
            Instant Win
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterView,
            props.gameFilter === "TABLEGAME" && styles.activeFilter,
          ]}
          onPress={() => {
            props.filterCasino("TABLEGAME");
          }}
        >
          <Text
            style={[
              styles.filterText,
              props.gameFilter === "TABLEGAME" && styles.activeFilterText,
            ]}
          >
            Table Game
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterView,
            props.gameFilter === "VIRTUAL_SPORTS" && styles.activeFilter,
          ]}
          onPress={() => {
            props.filterCasino("VIRTUAL_SPORTS");
          }}
        >
          <Text
            style={[
              styles.filterText,
              props.gameFilter === "VIRTUAL_SPORTS" && styles.activeFilterText,
            ]}
          >
            Virtual Sports
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterView,
            props.gameFilter === "VIDEOPOKER" && styles.activeFilter,
          ]}
          onPress={() => {
            props.filterCasino("VIDEOPOKER");
          }}
        >
          <Text
            style={[
              styles.filterText,
              props.gameFilter === "VIDEOPOKER" && styles.activeFilterText,
            ]}
          >
            Video Pooker
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterView,
            props.gameFilter === "SHOOTING" && styles.activeFilter,
          ]}
          onPress={() => {
            props.filterCasino("SHOOTING");
          }}
        >
          <Text
            style={[
              styles.filterText,
              props.gameFilter === "SHOOTING" && styles.activeFilterText,
            ]}
          >
            Shooting
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterView,
            props.gameFilter === "SCRATCHCARD" && styles.activeFilter,
          ]}
          onPress={() => {
            props.filterCasino("SCRATCHCARD");
          }}
        >
          <Text
            style={[
              styles.filterText,
              props.gameFilter === "SCRATCHCARD" && styles.activeFilterText,
            ]}
          >
            Scretch Card
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterView,
            props.gameFilter === "SLOT" && styles.activeFilter,
          ]}
          onPress={() => {
            props.filterCasino("SLOT");
          }}
        >
          <Text
            style={[
              styles.filterText,
              props.gameFilter === "SLOT" && styles.activeFilterText,
            ]}
          >
            Slot
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CasinoHeader;

const styles = StyleSheet.create({
  container: {
    // margin: 10,
    // backgroundColor: 'red',
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
    backgroundColor: "#212A37",
  },
  filterText: {
    color: "#959CA7",
    fontSize: 12,
    fontWeight: "500",
  },

  activeFilterText: {
    color: "#fff",
  },

  activeFilter: {
    backgroundColor: "#DAA520",
  },
});

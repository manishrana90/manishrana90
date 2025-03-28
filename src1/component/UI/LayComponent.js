import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

const LayComponent = (props) => {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    setBlink(true);
    const timeout = setTimeout(() => {
      setBlink(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [props.layPrice]);

  return (
    <TouchableOpacity
      style={[styles.backlayView, blink && styles.blink]}
      onPress={() => {props.layPress();}}
    >
      <Text style={styles.backlayText}>{props.layPrice}</Text>

      <Text style={[styles.backlayText, { fontSize: 10 }]}>
        {props.layRate}
      </Text>
    </TouchableOpacity>
  );
};

export default React.memo(LayComponent);

const styles = StyleSheet.create({
  backlayView: {
    flex: 1,
    padding: 5,
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 2,
    backgroundColor: "#eeadba",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#eeadba",
  },
  backlayText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
  blink: {
    backgroundColor: "#ffff00",
  },
});

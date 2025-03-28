import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

const BackComponent = (props) => {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    setBlink(true);
    const timeout = setTimeout(() => {
      setBlink(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [props.backPrice]);

  return (
    <TouchableOpacity
      style={[styles.backlayView, blink && styles.blink]}
      onPress={() => {props.backPress();}}
    >
      <Text style={styles.backlayText}>{props.backPrice}</Text>

      <Text style={[styles.backlayText, { fontSize: 10 }]}>
        {props.backRate}
      </Text>
    </TouchableOpacity>
  );
};

export default React.memo(BackComponent);

const styles = StyleSheet.create({
  backlayView: {
    flex: 1,
    padding: 5,
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 2,
    backgroundColor: "#83b9ea",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#83b9ea",
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

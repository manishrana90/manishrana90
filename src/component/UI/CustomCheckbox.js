import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Icon from 'react-native-vector-icons/Fontisto';

const CheckBox = (props) => {
	const iconName = props.isChecked ?	"checkbox-active" : "checkbox-passive";

	return (
		<View style={styles.container}>
			<Pressable onPress={props.onPress}>
				<Icon name={iconName} size={18} color="#fff" />
			</Pressable>
			<Text style={styles.title}>{props.title}</Text>
		</View>
	);
};

export default CheckBox;

const styles = StyleSheet.create({
	container: {
		justifyContent: "flex-start",
		alignItems: "center",
		flexDirection: "row",
		width: 150,
		marginTop: 5,
		marginHorizontal: 5,
	},
	title: {
		fontSize: 12,
		color: "#fff",
		marginLeft: 10,
		
	},
});

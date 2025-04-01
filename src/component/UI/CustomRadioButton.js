import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const RadioButton = (props) => {
    return (
        <View style={styles.radioButtonContainer}>
            <TouchableOpacity onPress={() => {props.onPress(props.value);}} style={styles.radioButton}>
                {props.selected ? <View style={styles.radioButtonIcon} /> : null}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {props.onPress(props.value);}}>
                <Text style={styles.radioButtonText}>{props.title}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default RadioButton;

const styles = StyleSheet.create({
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioButton: {
        height: 20,
        width: 20,
        backgroundColor: '#F8F8F8',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E6E6E6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioButtonIcon: {
        height: 14,
        width: 14,
        borderRadius: 7,
        backgroundColor: '#f2b71a',
    },
    radioButtonText: {
        fontSize: 11,
        margin: 6,
        marginLeft: 16,
        color: '#fff',
    },
})
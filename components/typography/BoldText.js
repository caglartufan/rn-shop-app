import React from 'react';
import { Text, StyleSheet } from 'react-native';

const BoldText = props => {
    return (
        <Text style={{...styles.boldText, ...props.style}}>
            {props.children}
        </Text>
    );
};

const styles = StyleSheet.create({
    boldText: {
        fontFamily: 'open-sans-bold'
    }
});

export default BoldText;
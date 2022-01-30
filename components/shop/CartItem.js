import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import DefaultText from '../typography/DefaultText';
import BoldText from '../typography/BoldText';

const CartItem = props => {
    return (
        <View style={styles.cartItem}>
            <View style={styles.itemData}>
                <DefaultText style={styles.quantity}>{props.quantity}{' '}</DefaultText>
                <BoldText style={styles.text}>{props.productTitle}</BoldText>
            </View>
            <View style={styles.itemData}>
                <BoldText style={styles.text}>${props.sum.toFixed(2)}</BoldText>
                {props.deletable && (
                    <TouchableOpacity onPress={props.onRemove} style={styles.deleteButton}>
                        <Ionicons
                            name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
                            size={23}
                            color='red'
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cartItem: {
        padding: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20
    },
    itemData: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    quantity: {
        color: '#888',
        fontSize: 16
    },
    text: {
        fontSize: 16
    },
    deleteButton: {
        marginLeft: 20
    }
});

export default CartItem;
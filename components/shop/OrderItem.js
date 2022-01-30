import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

import CartItem from './CartItem';
import DefaultText from '../typography/DefaultText';
import BoldText from '../typography/BoldText';

import Colors from '../../constants/Colors';

const OrderItem = props => {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <View style={styles.orderItem}>
            <View style={styles.summary}>
                <BoldText style={styles.totalAmount}>${props.totalAmount.toFixed(2)}</BoldText>
                <DefaultText style={styles.date}>{props.date}</DefaultText>
            </View>
            <View>
                <Button
                    title={showDetails ? 'Hide Details' : 'Show Details'}
                    color={Colors.primary}
                    onPress={() => {
                        setShowDetails(prevState => !prevState);
                    }}
                />
            </View>
            {showDetails && (
                <View style={styles.detailItem}>
                    {props.items.map(cartItem => <CartItem {...cartItem} deletable={false} />)}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    orderItem: {
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: 'white',
        margin: 20,
        padding: 10,
        alignItems: 'center'
    },
    summary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10
    },
    totalAmount: {
        fontSize: 16
    },
    date: {
        fontSize: 16,
        color: '#888'
    },
    detailItem: {
        width: '100%'
    }
});

export default OrderItem;
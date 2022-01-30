import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import OrderItem from '../../components/shop/OrderItem';
import Spinner from '../../components/UI/Spinner';
import DefaultText from '../../components/typography/DefaultText';
import BoldText from '../../components/typography/BoldText';
import Colors from '../../constants/Colors';

import * as ordersActions from '../../store/actions/orders';

const OrdersScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();

    const orders = useSelector(state => state.orders.orders);
    const dispatch = useDispatch();

    const loadOrders = useCallback(async () => {
        setError(undefined);
        setIsRefreshing(true);
        try{
            await dispatch(ordersActions.fetchOrders());
        } catch(err) {
            setError(err.message);
        }
        setIsRefreshing(false);
    }, [dispatch, setIsRefreshing, setError]);

    useEffect(() => {
        const focusSubscription = props.navigation.addListener(
            'focus',
            loadOrders
        );

        return focusSubscription;
    }, [loadOrders]);

    useEffect(() => {
        const loadOrdersAsync = async () => {
            setIsLoading(true);
            await loadOrders();
            setIsLoading(false);
        };
        loadOrdersAsync();
    }, [loadOrders]);

    if(error) {
        return (
            <View style={styles.centered}>
                <BoldText style={styles.errorHeader}>An error occured</BoldText>
                <DefaultText style={styles.errorMessage}>{error}</DefaultText>
                <Button title='Try again' color={Colors.primary} onPress={loadOrders} />
            </View>
        );
    }

    if(isLoading) {
        return (
            <Spinner />
        );
    }

    if(!isLoading && !orders.length) {
        return (
            <View style={styles.centered}>
                <DefaultText>No orders found. Maybe start adding some!</DefaultText>
            </View>
        );
    }

    return (
        <View>
            <FlatList
                onRefresh={loadOrders}
                refreshing={isRefreshing}
                data={orders}
                renderItem={itemData =>
                    <OrderItem {...itemData.item} date={itemData.item.readableDate} />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorHeader: {
        fontSize: 18,
        color: 'crimson',
        marginBottom: 10,
        textTransform: 'uppercase'
    },
    errorMessage: {
        fontSize: 14,
        marginBottom: 10
    }
});

export default OrdersScreen;
import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import ProductItem from '../../components/shop/ProductItem';
import BoldText from '../../components/typography/BoldText';
import DefaultText from '../../components/typography/DefaultText';
import Colors from '../../constants/Colors';
import Spinner from '../../components/UI/Spinner';

import * as cartActions from '../../store/actions/cart';
import * as productsActions from '../../store/actions/products';

const ProductsOverviewScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();

    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();

    const loadProducts = useCallback(async () => {
        setError(undefined);
        setIsRefreshing(true);
        try{
            await dispatch(productsActions.fetchProducts());
        } catch(err) {
            setError(err.message);
        }
        setIsRefreshing(false);
    }, [dispatch, setIsRefreshing, setError]);

    useEffect(() => {
        const focusSubscription = props.navigation.addListener(
            'focus',
            loadProducts
        );

        return focusSubscription;
    }, [loadProducts]);

    useEffect(() => {
        const loadProductsAsync = async () => {
            setIsLoading(true);
            await loadProducts();
            setIsLoading(false);
        };
        loadProductsAsync();
    }, [loadProducts, setIsLoading]);

    const onSelectHandler = (id, title) => {
        props.navigation.navigate('ProductDetail', {
            productId: id,
            productTitle: title
        });
    };

    if(error) {
        return (
            <View style={styles.centered}>
                <BoldText style={styles.errorHeader}>An error occured</BoldText>
                <DefaultText style={styles.errorMessage}>{error}</DefaultText>
                <Button title='Try again' color={Colors.primary} onPress={loadProducts} />
            </View>
        );
    }

    if(isLoading) {
        return (
            <Spinner />
        );
    }

    if(!isLoading && !products.length) {
        return (
            <View style={styles.centered}>
                <DefaultText>No products found. Maybe start adding some!</DefaultText>
            </View>
        );
    }

    return (
        <FlatList
            onRefresh={loadProducts}
            refreshing={isRefreshing}
            data={products}
            renderItem={itemData => {
                return (
                    <ProductItem
                        {...itemData.item}
                        onSelect={onSelectHandler.bind(this, itemData.item.id, itemData.item.title)}
                    >
                        <Button
                            title='View Details'
                            color={Colors.primary}
                            onPress={onSelectHandler.bind(this, itemData.item.id, itemData.item.title)}
                        />
                        <Button
                            title='To Cart'
                            color={Colors.primary}
                            onPress={() => {
                                dispatch(cartActions.addToCart(itemData.item));
                            }}
                        />
                    </ProductItem>
                );
            }}
        />
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

export default ProductsOverviewScreen;
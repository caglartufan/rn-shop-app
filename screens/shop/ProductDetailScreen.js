import React from 'react';
import { View, ScrollView, Text, Image, Button, StyleSheet, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import Colors from '../../constants/Colors';
import DefaultText from '../../components/typography/DefaultText';
import BoldText from '../../components/typography/BoldText';

import * as cartActions from '../../store/actions/cart';

const window = Dimensions.get('window');

const ProductDetailScreen = props => {
    const { productId } = props.route.params;
    const selectedProduct = useSelector(state =>
        state.products.availableProducts.find(product => product.id === productId)
    );

    const dispatch = useDispatch();

    return (
        <ScrollView>
            <Image source={{ uri: selectedProduct.imageUrl }} style={styles.image} />
            <View style={styles.actions}>
                <Button title='Add to Cart' color={Colors.primary} onPress={() => {
                    dispatch(cartActions.addToCart(selectedProduct));
                }} />
            </View>
            <BoldText style={styles.price}>${selectedProduct.price.toFixed(2)}</BoldText>
            <DefaultText style={styles.description}>{selectedProduct.description}</DefaultText>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: window.height / 3
    },
    actions: {
        marginVertical: 10,
        alignItems: 'center'
    },
    price: {
        fontSize: 20,
        color: '#888',
        textAlign: 'center',
        marginVertical: 20
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 20
    }
});

export default ProductDetailScreen;
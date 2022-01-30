import React from 'react';
import { View, FlatList, Button, Alert, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import * as productsActions from '../../store/actions/products';

import DefaultText from '../../components/typography/DefaultText';
import ProductItem from '../../components/shop/ProductItem';
import Colors from '../../constants/Colors';

const UserProductsScreen = props => {
    const userProducts = useSelector(state => state.products.userProducts);
    const dispatch = useDispatch();

    const onSelectHandler = (id, title) => {
        props.navigation.navigate('EditProduct', {
            productId: id,
            productTitle: title
        });
    };

    const onDeleteHandler = id => {
        Alert.alert('Are you sure? ', 'Do you really want to delete this item?', [
            {
                text: 'No',
                style: 'default'
            },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: () => {
                    dispatch(productsActions.deleteProduct(id));
                }
            }
        ])
    };

    if(!userProducts.length) {
        return (
            <View style={styles.centered}>
                <DefaultText style={{ textAlign: 'center' }}>You don't have any products. Maybe start adding some!</DefaultText>
            </View>
        );
    }

    return (
        <FlatList
            data={userProducts}
            renderItem={itemData =>
                <ProductItem
                    {...itemData.item}
                    onSelect={onSelectHandler.bind(this, itemData.item.id, itemData.item.title)}
                >
                    <Button
                        title='Edit'
                        color={Colors.primary}
                        onPress={onSelectHandler.bind(this, itemData.item.id, itemData.item.title)}
                    />
                    <Button
                        title='Delete'
                        color={Colors.primary}
                        onPress={onDeleteHandler.bind(this, itemData.item.id)}
                    />
                </ProductItem>
            }
        />
    );
};
const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    }
});

export default UserProductsScreen;
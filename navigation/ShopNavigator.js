import React, { useState, useEffect } from 'react';
import { Platform, SafeAreaView, Button, View, StatusBar } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import UserProductsScreen from '../screens/user/UserProductsScreen';
import EditProductScreen from '../screens/user/EditProductScreen';
import AuthScreen from '../screens/user/AuthScreen';

import CustomHeaderButton from '../components/UI/HeaderButton';
import Spinner from '../components/UI/Spinner';
import Colors from '../constants/Colors';

import * as authActions from '../store/actions/auth';

const defaultNavOptions = {
    headerTitleStyle: {
        fontFamily: 'open-sans-bold'
    },
    headerBackTitleStyle: {
        fontFamily: 'open-sans'
    },
    headerStyle: {
        backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
    },
    headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
};

const ProductsNavigator = createStackNavigator();

const ProductsNavigationStack = () => {
    return (
        <ProductsNavigator.Navigator
            initialRouteName='ProductsOverview'
            screenOptions={defaultNavOptions}
        >
            <ProductsNavigator.Screen
                name='ProductsOverview'
                component={ProductsOverviewScreen}
                options={({ navigation }) => ({
                    title: 'All Products',
                    headerRight: () => (
                        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                            <Item
                                title='Cart'
                                iconName={
                                    Platform.OS === 'android'
                                        ? 'md-cart'
                                        : 'ios-cart'
                                }
                                onPress={() => {
                                    navigation.navigate('Cart');
                                }}
                            />
                        </HeaderButtons>
                    ),
                    headerLeft: () => (
                        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                            <Item
                                title='Menu'
                                iconName={
                                    Platform.OS === 'android'
                                        ? 'md-menu'
                                        : 'ios-meu'
                                }
                                onPress={() => {
                                    navigation.toggleDrawer();
                                }}
                            />
                        </HeaderButtons>
                    )
                })}
            />
            <ProductsNavigator.Screen
                name='ProductDetail'
                component={ProductDetailScreen}
                options={({ route }) => ({ title: route.params.productTitle })}
            />
            <ProductsNavigator.Screen
                name='Cart'
                component={CartScreen}
                options={{ title: 'Your Cart' }}
            />
        </ProductsNavigator.Navigator>
    );
};

const OrdersNavigator = createStackNavigator();

const OrdersNavigationStack = () => {
    return (
        <OrdersNavigator.Navigator
            initialRouteName='Orders'
            screenOptions={defaultNavOptions}
            
        >
            <OrdersNavigator.Screen
                name='Orders'
                component={OrdersScreen}
                options={({ navigation }) => ({
                    title: 'Your Orders',
                    headerLeft: () => (
                        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                            <Item
                                title='Menu'
                                iconName={
                                    Platform.OS === 'android'
                                        ? 'md-menu'
                                        : 'ios-meu'
                                }
                                onPress={() => {
                                    navigation.toggleDrawer();
                                }}
                            />
                        </HeaderButtons>
                    )
                })}
            />
        </OrdersNavigator.Navigator>
    );
};

const UserProductsNavigator = createStackNavigator();

const UserProductsNavigationStack = () => {
    return (
        <UserProductsNavigator.Navigator
            initialRouteName='UserProducts'
            screenOptions={defaultNavOptions}
        >
            <UserProductsNavigator.Screen
                name='UserProducts'
                component={UserProductsScreen}
                options={({ navigation }) => ({
                    title: 'Your Products',
                    headerLeft: () => (
                        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                            <Item
                                title='Menu'
                                iconName={
                                    Platform.OS === 'android'
                                        ? 'md-menu'
                                        : 'ios-menu'
                                }
                                onPress={() => {
                                    navigation.toggleDrawer();
                                }}
                            />
                        </HeaderButtons>
                    ),
                    headerRight: () => (
                        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                            <Item
                                title='Add'
                                iconName={
                                    Platform.OS === 'android'
                                        ? 'md-create'
                                        : 'ios-create'
                                }
                                onPress={() => {
                                    navigation.navigate('EditProduct');
                                }}
                            />
                        </HeaderButtons>
                    )
                })}
            />
            <UserProductsNavigator.Screen
                name='EditProduct'
                component={EditProductScreen}
                options={({ route, navigation }) => ({
                    title: route.params && route.params.productTitle
                        ? 'Edit Product'
                        : 'Add a Product',
                    headerRight: () => (
                        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                            <Item
                                title='Save'
                                iconName={
                                    Platform.OS === 'android'
                                        ? 'md-checkmark'
                                        : 'ios-checkmark'
                                }
                                onPress={() => {
                                    console.log(route.params);
                                }}
                            />
                        </HeaderButtons>
                    )
                })}
            />
        </UserProductsNavigator.Navigator>
    );
};

const AuthNavigator = createStackNavigator();

const AuthNavigationStack = () => {
    return (
        <AuthNavigator.Navigator
            initialRouteName='Auth'
            screenOptions={defaultNavOptions}
        >
            <AuthNavigator.Screen
                name='Auth'
                component={AuthScreen}
                options={{
                    title: 'Authenticate'
                }}
            />
        </AuthNavigator.Navigator>
    );
};

const Drawer = createDrawerNavigator();

const ShopNavigator = () => {
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const dispatch = useDispatch();

    const { token, userId } = useSelector(state => state.auth);

    useEffect(() => {
        const tryLogin = async () => {
            const userData = await AsyncStorage.getItem('userData');
            if(!userData) {
                setIsAuthenticating(false);
            }
            try {
                const transformedData = JSON.parse(userData);
                const { token, userId, expirationDate } = transformedData;
                const expDate = new Date(expirationDate);
    
                if(expDate <= new Date() || !token || !userId) {
                    setIsAuthenticating(false);
                }

                const expirationTime = expirationDate.getTime() - new Date().getTime;
    
                dispatch(authActions.authenticate(userId, token, expirationTime));
                setIsAuthenticating(false);
            } catch(err) {
                // do nothign with JSON parsing errors
            }
        }

        tryLogin();
    }, [dispatch]);

    if(isAuthenticating) {
        return (
            <Spinner />
        );
    }

    if(token && userId) {
        return (
            <NavigationContainer>
                <Drawer.Navigator
                    initialRouteName='Products'
                    screenOptions={{
                        drawerActiveTintColor: Colors.primary
                    }}
                    drawerContent={props => {
                        return (
                            <View style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
                                <SafeAreaView>
                                    <DrawerItemList {...props} />
                                    <Button
                                        title='Logout'
                                        color={Colors.primary}
                                        onPress={() =>
                                            dispatch(authActions.logout())
                                        }
                                    />
                                </SafeAreaView>
                            </View>
                        );
                    }}
                >
                    <Drawer.Screen
                        name='Products Tab'
                        component={ProductsNavigationStack}
                        options={{
                            headerShown: false,
                            title: 'Products',
                            drawerIcon: drawerConfig => (
                                <Ionicons
                                    name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
                                    size={23}
                                    color={drawerConfig.color}
                                />
                            )
                        }}
                    />
                    <Drawer.Screen
                        name='Orders Tab'
                        component={OrdersNavigationStack}
                        options={{
                            headerShown: false,
                            title: 'Orders',
                            drawerIcon: drawerConfig => (
                                <Ionicons
                                    name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                                    size={23}
                                    color={drawerConfig.color}
                                />
                            )
                        }}
                    />
                    <Drawer.Screen
                        name='User Products Tab'
                        component={UserProductsNavigationStack}
                        options={{
                            headerShown: false,
                            title: 'Admin',
                            drawerIcon: drawerConfig => (
                                <Ionicons
                                    name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                                    size={23}
                                    color={drawerConfig.color}
                                />
                            )
                        }}
                    />
                </Drawer.Navigator>
            </NavigationContainer>
        );
    } else {
        return (
            <NavigationContainer>
                <AuthNavigationStack />
            </NavigationContainer>
        );
    }
};

export default ShopNavigator;
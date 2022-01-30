import React, { useState, useEffect, useCallback, useReducer } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/HeaderButton';

import * as productsActions from '../../store/actions/products';
import Input from '../../components/UI/Input';
import Spinner from '../../components/UI/Spinner';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
    switch(action.type) {
        case FORM_INPUT_UPDATE:
            const updatedValues = {
                ...state.inputValues,
                [action.input]: action.value
            };
            const updatedValidites = {
                ...state.inputValidities,
                [action.input]: action.validity
            };
            let updatedIsFormValid = true;
            for(const key in updatedValidites) {
                updatedIsFormValid = updatedIsFormValid && updatedValidites[key].isValid;
            }
            return {
                inputValues: updatedValues,
                inputValidities: updatedValidites,
                isFormValid: updatedIsFormValid
            };
        default:
            return state;
    }
};

const EditProductScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(); 

    const prodId = props.route.params?.productId;
    const editedProduct = useSelector(state =>
        state.products.userProducts.find(product => product.id === prodId)
    );
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: editedProduct ? editedProduct.title : '',
            imageUrl: editedProduct ? editedProduct.imageUrl : '',
            price: '',
            description: editedProduct ? editedProduct.description : ''
        },
        inputValidities: {
            title: {
                isValid: editedProduct ? true : false,
                message: ''
            },
            imageUrl: {
                isValid: editedProduct ? true : false,
                message: ''
            },
            price : {
                isValid: editedProduct ? true : false,
                message: ''
            },
            description: {
                isValid: editedProduct ? true : false,
                message: ''
            }
        },
        isFormValid: editedProduct ? true : false
    });

    useEffect(() => {
        if(error) {
            Alert.alert('An error occured', error, [
                { text: 'OK' }
            ]);
        }
    }, [error]);

    const submitHandler = useCallback(async () => {
        if(!formState.isFormValid) {
            return Alert.alert('Wrong input!', 'Please check the errors in the form.', [
                { text: 'OK', style: 'cancel' }
            ]);
        }
        setError(undefined);
        setIsLoading(true);
        try {
            if(editedProduct) {
                await dispatch(productsActions.updateProduct(
                    prodId,
                    formState.inputValues.title,
                    formState.inputValues.imageUrl,
                    formState.inputValues.description
                ));
            } else {
                await dispatch(productsActions.createProduct(
                    formState.inputValues.title,
                    formState.inputValues.imageUrl,
                    Number(formState.inputValues.price),
                    formState.inputValues.description
                ));
            }
            props.navigation.goBack();
        } catch(err) {
            setError(err.message);
        }
        setIsLoading(false);
    }, [dispatch, prodId, formState]);

    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                    <Item
                        title='Save'
                        iconName={
                            Platform.OS === 'android'
                                ? 'md-checkmark'
                                : 'ios-checkmark'
                        }
                        onPress={submitHandler}
                    />
                </HeaderButtons>
            )
        });
    }, [submitHandler]);

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            validity: {
                isValid: inputValidity,
                message: ''
            },
            input: inputIdentifier
        });
    }, [dispatchFormState]);

    if(isLoading) {
        return (
            <Spinner />
        );
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'android' ? null : 'padding'}
            keyboardVerticalOffset={Platform.select({ android: 100, ios: 0 })}
        >
            <ScrollView>
                <View style={styles.form}>
                    <Input
                        label='Title'
                        name='title'
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.title : ''}
                        initiallyValid={editedProduct ? true : false}
                        keyboardType='default'
                        autoCapitalize='sentences'
                        autoCorrect
                        returnKeyType='next'
                        required
                    />
                    <Input
                        label='Image URL'
                        name='imageUrl'
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.imageUrl : ''}
                        initiallyValid={editedProduct ? true : false}
                        keyboardType='default'
                        returnKeyType='next'
                        required
                    />
                    {!editedProduct && (
                        <Input
                            label='Price'
                            name='price'
                            onInputChange={inputChangeHandler}
                            keyboardType='decimal-pad'
                            returnKeyType='next'
                            required
                            min={0.1}
                        />
                    )}
                    <Input
                        label='Description'
                        name='description'
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.description : ''}
                        initiallyValid={editedProduct ? true : false}
                        keyboardType='default'
                        autoCapitalize='sentences'
                        autoCorrect
                        multiline
                        numberOfLines={3}
                        returnKeyType='done'
                        required
                        minLength={5}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    form: {
        margin: 20
    }
});

export default EditProductScreen;
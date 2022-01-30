import React, { useState, useReducer, useCallback, useEffect } from 'react';
import {
    ScrollView,
    View,
    KeyboardAvoidingView,
    StyleSheet,
    Platform,
    Button,
    Alert,
    ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';

import BoldText from '../../components/typography/BoldText';
import DefaultText from '../../components/typography/DefaultText';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';

import * as authActions from '../../store/actions/auth';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
    switch(action.type) {
        case FORM_INPUT_UPDATE:
            const updatedValues = {
                ...state.inputValues,
                [action.input]: action.value
            };
            const updatedValidities = {
                ...state.inputValidities,
                [action.input]: action.validity
            };
            let updatedIsFormValid = true;
            for(const key in updatedValidities) {
                updatedIsFormValid = updatedIsFormValid && updatedValidities[key].isValid;
            }
            return {
                inputValues: updatedValues,
                inputValidities: updatedValidities,
                isFormValid: updatedIsFormValid
            };
        default:
            return state;
    }
};

const AuthScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [isSignup, setIsSignup] = useState(false);
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(
        formReducer,
        {
            inputValues: {
                email: '',
                password: ''
            },
            inputValidities: {
                email: {
                    isValid: false,
                    message: ''
                },
                password: {
                    isValid: false,
                    message: ''
                }
            },
            isFormValid: false
        }
    );

    useEffect(() => {
        if(error) {
            Alert.alert('An error occured!', error, [
                { text: 'OK' }
            ]);
        }
    }, [error]);
    

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

    const formSubmitHandler = useCallback(async () => {
        if(!formState.isFormValid) {
            return Alert.alert('Wrong input!', 'Please check the errors in the form.', [
                { text: 'OK', style: 'cancel' }
            ]);
        }
        setError(undefined);
        setIsLoading(true);
        try {
            let action;
            if(isSignup) {
                action = authActions.signup(
                    formState.inputValues.email,
                    formState.inputValues.password
                );
            } else {
                action = authActions.login(
                    formState.inputValues.email,
                    formState.inputValues.password
                );
            }
            await dispatch(action);
        } catch(err) {
            setError(err.message);
            setIsLoading(false);
        }
    }, [dispatch, formState]);

    return (
        <KeyboardAvoidingView
            style={styles.screen}
            behavior={Platform.OS === 'android' ? null : 'padding'}
            keyboardVerticalOffset={Platform.select({ android: 100, ios: 0 })}
        >
            <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
                <Card style={styles.authContainer}>
                    <ScrollView>
                        <Input
                            name='email'
                            label='E-mail'
                            keyboardType='email-address'
                            required
                            email
                            autoCapitalize='none'
                            onInputChange={inputChangeHandler}
                            initialValue=''
                        />
                        <Input
                            name='password'
                            label='Password'
                            keyboardType='default'
                            secureTextEntry
                            required
                            minLength={5}
                            autoCapitalize='none'
                            onInputChange={inputChangeHandler}
                            initialValue=''
                        />
                        <View style={styles.buttonContainer}>
                            {isLoading
                                ? <ActivityIndicator size='small' color={Colors.primary} />
                                : (<Button
                                    title={isSignup ? 'Sign Up' : 'Login'}
                                    color={Colors.primary}
                                    onPress={formSubmitHandler}
                                />)
                            }
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button
                                title={`Switch to ${isSignup ? 'Login' : 'Sign Up'}`}
                                color={Colors.secondary}
                                onPress={() => setIsSignup(prevState => !prevState)}
                            />
                        </View>
                    </ScrollView>
                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 20
    },
    buttonContainer: {
        marginTop: 10
    }
});

export default AuthScreen;
import AsyncStorage from '@react-native-async-storage/async-storage';

// export const SIGNUP = 'SIGNUP';
// export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

let timer;

export const authenticate = (userId, token, expiryTime) => {
    return dispatch => {
        dispatch(setLogoutTimer(expiryTime));
        dispatch({
            type: AUTHENTICATE,
            userId: userId,
            token: token
        });
    }
};

export const signup = (email, password) => {
    return async dispatch => {
        try {
            const APIKey = 'AIzaSyCdKSG_5Rr2EYJYuxMm5Ln2acvlUoImmHA';

            const response = await fetch(
                `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${APIKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                        returnSecureToken: true
                    })
                }
            );

            if(!response.ok) {
                const errorResData = await response.json();
                const errorId = errorResData.error.message;
                if(errorId === 'EMAIL_EXISTS') {
                    throw new Error('E-mail address is already in use.');
                } else if(errorId === 'TOO_MANY_ATTEMPTS_TRY_LATER') {
                    throw new Error('You have tried so many times. Try again later.');
                } else {
                    throw new Error('Something went wrong!');
                }
            }

            const resData = await response.json();

            dispatch(
                authenticate(
                    resData.localId,
                    resData.idToken,
                    parseInt(resData.expiresIn) * 1000
                )
            );
            const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
            saveDataToStorage(resData.idToken, resData.localId, expirationDate);
        } catch(err) {
            throw err;
        }
    };
};

export const login = (email, password) => {
    return async dispatch => {
        try {
            const APIKey = 'AIzaSyCdKSG_5Rr2EYJYuxMm5Ln2acvlUoImmHA';

            const response = await fetch(
                `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${APIKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                        returnSecureToken: true
                    })
                }
            );

            if(!response.ok) {
                const errorResData = await response.json();
                const errorId = errorResData.error.message;
                if(errorId === 'EMAIL_NOT_FOUND' || errorId === 'INVALID_PASSWORD') {
                    throw new Error('Invalid e-mail address or password.');
                } else {
                    throw new Error('Something went wrong!');
                }
            }

            const resData = await response.json();

            dispatch(
                authenticate(
                    resData.localId,
                    resData.idToken,
                    parseInt(resData.expiresIn) * 1000
                )
            );
            const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
            saveDataToStorage(resData.idToken, resData.localId, expirationDate);
        } catch(err) {
            throw err;
        }
    };
};

export const logout = () => {
    return async dispatch => {
        await AsyncStorage.removeItem('userData');
        clearLogoutTimer();

        dispatch({
            type: LOGOUT
        });
    }
};

const clearLogoutTimer = () => {
    if(timer) {
        clearTimeout(timer);
    }
};

const setLogoutTimer = expirationTime => {
    return dispatch => {
        timer = setTimeout(() => {
            dispatch(logout());
        }, expirationTime);
    };
};

const saveDataToStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem('userData', JSON.stringify({
        token: token,
        userId: userId,
        expirationDate: expirationDate.toISOString()
    }));
};

const clearStorage = () => {
    AsyncStorage.clear();
};
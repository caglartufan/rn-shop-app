import Product from "../../models/product";

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export const fetchProducts = () => {
    return async (dispatch, getState) => {
        try {
            const { token, userId } = getState().auth;

            const response = await fetch('https://rn-shop-app-c49cb-default-rtdb.europe-west1.firebasedatabase.app/products.json');

            if(!response.ok) {
                throw new Error('Something went wrong!');
            }
    
            const resData = await response.json();
    
            const loadedProducts = [];
    
            for(const key in resData) {
                loadedProducts.push(new Product(
                    key,
                    resData[key].ownerId,
                    resData[key].title,
                    resData[key].imageUrl,
                    resData[key].description,
                    resData[key].price
                ));
            }
    
            dispatch({
                type: SET_PRODUCTS,
                products: loadedProducts,
                userProducts: loadedProducts.filter(product => product.ownerId === userId)
            });
        } catch(err) {
            // send to custom analytics server
            throw err;
        }
    }
};

export const createProduct = (title, imageUrl, price, description) => {
    return async (dispatch, getState) => {
        const { token, userId } = getState().auth;

        const response = await fetch(`https://rn-shop-app-c49cb-default-rtdb.europe-west1.firebasedatabase.app/products.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                imageUrl,
                price,
                ownerId: userId
            })
        });

        const resData = await response.json();

        /**
         * Outputs the below object:
         * Object {
         *   "name": "-MuL0uCQ6uuF-18rU6DF",
         * }
         */
        // console.log(resData);

        dispatch({
            type: CREATE_PRODUCT,
            productData: {
                id: resData.name,
                title,
                imageUrl,
                price,
                description,
                ownerId: userId
            }
        });
    };
};

export const updateProduct = (id, title, imageUrl, description) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;

        const response = await fetch(
            `https://rn-shop-app-c49cb-default-rtdb.europe-west1.firebasedatabase.app/products/${id}.json?auth=${token}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    description,
                    imageUrl
                })
            }
        );

        if(!response.ok) {
            throw new Error('Something went wrong!');
        }

        dispatch({
            type: UPDATE_PRODUCT,
            pid: id,
            productData: {
                title,
                imageUrl,
                description
            }
        });
    };
};

export const deleteProduct = productId => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;

        const response = await fetch(
            `https://rn-shop-app-c49cb-default-rtdb.europe-west1.firebasedatabase.app/products/${productId}.json?auth=${token}`,
            {
                method: 'DELETE'
            }
        );

        if(!response.ok) {
            throw new Error('Something went wrong!');
        }

        dispatch({
            type: DELETE_PRODUCT,
            pid: productId
        });
    }
};
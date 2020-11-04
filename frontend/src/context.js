import React, {createContext, useReducer} from 'react';
import jwtDecode from 'jwt-decode';
import moment from "moment";

const token = localStorage.getItem('gql_token');
let isAuthenticated = false;
let decoded = {};

if (token) {
    decoded = jwtDecode(token);
    isAuthenticated = moment.unix(decoded.exp).format() < moment().format();
}

export const AuthContext = createContext({
    isLoggedIn: isAuthenticated,
    token: token,
    login: () => {
    },
    logout: () => {
    }
});

const initialState = {
    isAuthenticated: isAuthenticated,
    user: decoded,
    token: token || "",
    isLoading: false,
};

export const AuthContextProvider = (props) => {
    const [state, authDispatch] = useReducer((state, action) => {
    }, initialState);

    return (
        <AuthContext.Provider
            value={{
                state,
                authDispatch,
            }}>
            {props.children}
        </AuthContext.Provider>
    )
}
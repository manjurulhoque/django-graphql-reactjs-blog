/* eslint-disable */
import React, {createContext, useReducer} from 'react';
import jwtDecode from 'jwt-decode';
import moment from "moment";

const token = localStorage.getItem('gql_token');
let isAuthenticated = false;
let decoded = {};

if (token) {
    decoded = jwtDecode(token);
    isAuthenticated = moment.unix(decoded.exp).format() > moment().format();
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
    error: null,
};

// Handle dispatched actions
function AuthReducer(state, action) {
    switch (action.type) {
        case 'LOGIN_FETCHING':
            return {
                ...state,
                isLoading: true
            };
        case 'LOGIN_FETCH_SUCCESS':
            return {
                ...state,
                isLoading: false,
                isAuthenticated: true
            };
        case 'LOGIN_FETCH_FAILURE':
            return {
                ...state,
                isLoading: false,
                error: action.payload
            };
        case 'LOGOUT':
            localStorage.removeItem('gql_token');
            return {
                ...state,
                isLoading: false,
                error: null,
                token: "",
                user: {}
            };
        default:
            return state;
    }
}

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(AuthReducer, initialState);

    return (
        <AuthContext.Provider
            value={{
                state,
                dispatch,
            }}>
            {children}
        </AuthContext.Provider>
    )
}
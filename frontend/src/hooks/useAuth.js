import {useContext} from 'react';
import {AuthContext} from '../contexts/AuthContext'

export const useAuth = () => {
    const authContext = useContext(AuthContext);

    if (authContext === undefined) {
        throw new Error('useAuthState must be used with AuthContextProvider');
    }

    return authContext;
};
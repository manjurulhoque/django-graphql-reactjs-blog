/* eslint-disable */
import React, {useState} from 'react';
import {ApolloClient} from "apollo-client";
import {ApolloProvider} from 'react-apollo';
import {BrowserRouter as Router} from 'react-router-dom';
import BaseRouter from './routes';
import NavBar from "./components/NavBar";
import {createUploadLink} from "apollo-upload-client";
import {InMemoryCache} from "apollo-cache-inmemory";
import {AuthContextProvider} from "./contexts/AuthContext";
import {PostContextProvider} from "./contexts/PostContext";

const apolloCache = new InMemoryCache();

const uploadLink = createUploadLink({
    uri: 'http://127.0.0.1:8000/graphql',
});

const client = new ApolloClient({
    cache: apolloCache,
    link: uploadLink,
});

function App(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <ApolloProvider client={client}>
            <AuthContextProvider>
                <PostContextProvider>
                    <Router basename="/">
                        <NavBar/>
                        <div className="container">
                            <div className="mt-3">
                                <BaseRouter/>
                            </div>
                        </div>
                    </Router>
                </PostContextProvider>
            </AuthContextProvider>
        </ApolloProvider>
    );
}

export default App;

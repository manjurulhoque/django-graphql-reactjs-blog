import React from 'react';
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from 'react-apollo';
import {BrowserRouter as Router} from 'react-router-dom';
import BaseRouter from './routes';
import NavBar from "./components/NavBar";

const client = new ApolloClient({
    uri: 'http://127.0.0.1:8000/graphql'
});

function App() {
    return (
        <ApolloProvider client={client}>
            <Router basename="/">
                <NavBar/>
                <div className="container">
                    <div className="mt-3">
                        <BaseRouter/>
                    </div>
                </div>
            </Router>
        </ApolloProvider>
    );
}

export default App;

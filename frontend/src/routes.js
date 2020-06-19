import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Home from "./components/Home";
import CreatePost from "./components/CreatePost";

const BaseRouter = () => {
    return (
        <div>
            <Switch>
                <Route exact path='/' component={Home}/>
                <Route exact path='/create' component={CreatePost}/>
            </Switch>
        </div>
    )
}

export default BaseRouter;
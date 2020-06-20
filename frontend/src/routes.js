import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Home from "./components/Home";
import CreatePost from "./components/CreatePost";
import EditPost from "./components/EditPost";

const BaseRouter = () => {
    return (
        <div>
            <Switch>
                <Route exact path='/' component={Home}/>
                <Route exact path='/create' component={CreatePost}/>
                <Route exact path='/edit/:id' component={EditPost}/>
            </Switch>
        </div>
    )
}

export default BaseRouter;
import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Home from "./components/Home";
import CreatePost from "./components/CreatePost";
import EditPost from "./components/EditPost";
import Signup from "./components/Signup";
import Login from "./components/Login";
import NotFound from "./components/NotFound";

const BaseRouter = () => {
    return (
        <div>
            <Switch>
                <Route exact path='/' component={Home}/>
                <Route exact path='/signup' component={Signup}/>
                <Route exact path='/login' component={Login}/>
                <Route exact path='/create' component={CreatePost}/>
                <Route exact path='/edit/:id' component={EditPost}/>
                <Route path="*" component={NotFound} />
            </Switch>
        </div>
    )
}

export default BaseRouter;
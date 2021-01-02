/* eslint-disable */
import React, {useContext} from "react";
import {Link, NavLink} from 'react-router-dom';
import {AuthContext} from "../context";

function NavBar() {
    const {state: {isAuthenticated, user}} = useContext(AuthContext);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="#">Django React GraphQL Blog</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse"
                    data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                    aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"/>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <NavLink to="/" exact className="nav-link" activeClassName="active">Home</NavLink>
                    </li>
                    {isAuthenticated && (
                        <li className="nav-item">
                            <NavLink to="/create" exact className="nav-link" activeClassName="active">Create post</NavLink>
                        </li>
                    )}
                    {!isAuthenticated && (
                        <>
                            <li className="nav-item">
                                <NavLink to="/signup" exact className="nav-link" activeClassName="active">Signup</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/login" exact className="nav-link" activeClassName="active">Login</NavLink>
                            </li>
                        </>
                    )}
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {user && user.username}
                        </a>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <a className="dropdown-item" href="#">My Posts</a>
                            <div className="dropdown-divider"></div>
                            <a className="dropdown-item" href="#">Logout</a>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;
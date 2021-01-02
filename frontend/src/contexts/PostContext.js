/* eslint-disable */
import React, {createContext, useReducer} from "react";
import {useQuery} from "react-apollo";
import {POSTS_QUERY} from "../queries";
import {ContextDevTool} from "react-context-devtool";

export const PostContext = createContext({});

const initialState = {
    posts: [],
    post: {},
    isLoading: false,
    errors: null
};


export const PostContextProvider = ({children}) => {

    const {data, loading, error} = useQuery(
        POSTS_QUERY
    );

    const getPosts = async () => {

    }

    return (
        <PostContext.Provider
            value={{
                posts: data ? data.posts : []
            }}>
            <ContextDevTool context={PostContext} displayName="Posts context"/>
            {children}
        </PostContext.Provider>
    )
}
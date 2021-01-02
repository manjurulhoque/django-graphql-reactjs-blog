/* eslint-disable */
import React, {useState, useEffect, useContext} from "react";
import {useQuery, useMutation} from 'react-apollo';
import {CREATE_POST, CATEGORIES_QUERY} from '../queries';
import {AuthContext} from "../context";


function CreatePost({history}) {
    const {state: {isAuthenticated, user}} = useContext(AuthContext);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            history.push({
                pathname: "/",
            });
        }
    });

    const handleSubmit = (evt) => {
        evt.preventDefault();

        createPost({
            variables: {
                input: {
                    title: title,
                    description: description,
                    category: category,
                },
                file: image,
            }
        }).then(r => {
            history.push({
                pathname: "/",
            });
        }).catch(e => {
            console.log(e);
            // if (e.errors.length) {
            //     alert(e.errors[0].message);
            // }
            // alert("Something went wrong");
        });
    }

    const [createPost, result] = useMutation(CREATE_POST);
    const {data, loading, error} = useQuery(
        CATEGORIES_QUERY
    );

    if (loading) return <h4>Loading...</h4>;
    if (error) return <h4>{error}</h4>;

    return (
        <form onSubmit={handleSubmit} encType={'multipart/form-data'}>
            <div className="form-group">
                <label htmlFor="title">Title</label>
                <input type="text"
                       className="form-control"
                       id="title"
                       value={title}
                       required
                       onChange={e => setTitle(e.target.value)}
                       placeholder="Enter title"/>
            </div>
            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                    className="form-control"
                    id="description"
                    required
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Enter description"/>
            </div>

            <div className="form-group">
                <label htmlFor="category">Category</label>
                <select className="form-control" required id="category" onChange={e => setCategory(e.target.value)}>
                    <option value="">Choose category</option>
                    {
                        data.categories.map(({id, title}) => (
                            <option value={id} key={id}>{title}</option>
                        ))
                    }
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="description">Post Image</label>
                <input
                    type="file"
                    className="form-control"
                    id="image"
                    required
                    onChange={({
                                   target: {
                                       validity,
                                       files: [file]
                                   }
                               }) =>
                        validity.valid && setImage(file)
                    }/>
            </div>

            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    );
}

export default CreatePost;
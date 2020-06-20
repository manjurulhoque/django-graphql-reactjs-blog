import React, {useState, Fragment, useEffect} from "react";
import {useQuery, useMutation} from 'react-apollo';
import {useHistory} from "react-router";
import {useParams} from "react-router-dom";
import {CATEGORIES_QUERY, UPDATE_POST, GET_POST_QUERY} from '../queries';


function EditPost() {

    const history = useHistory();
    let {id} = useParams();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");

    const handleSubmit = (evt) => {
        evt.preventDefault();

        updatePost({
            variables: {
                id: id,
                input: {
                    title: title,
                    description: description,
                    category: category,
                }
            }
        }).then(r => {
            history.push({
                pathname: "/",
            });
        }).catch(e => {
            console.log(e);
            alert("Something went wrong");
        })
    }

    const [updatePost, result] = useMutation(UPDATE_POST);
    const {data, loading, error} = useQuery(
        CATEGORIES_QUERY
    );

    const post_data = useQuery(GET_POST_QUERY, {
        variables: {
            id: id
        }
    });

    useEffect(() => {
        if (post_data.data && post_data.data.post) {
            setTitle(post_data.data.post.title);
            setDescription(post_data.data.post.description);
            setCategory(post_data.data.post.category.id);
        }
    }, [post_data]);

    if (loading) return <h4>Loading...</h4>;
    if (error) return <h4>{error}</h4>;

    return (
        <Fragment>
            <h3>Edit post</h3>
            <form onSubmit={handleSubmit}>
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
                    <select className="form-control" value={category} required id="category" onChange={e => setCategory(e.target.value)}>
                        <option value="">Choose category</option>
                        {
                            data.categories.map(({id, title}) => (
                                <option value={id} key={id}>{title}</option>
                            ))
                        }
                    </select>
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </Fragment>
    );
}

export default EditPost;
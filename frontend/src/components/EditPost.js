/* eslint-disable */
import React, {useState, Fragment, useEffect, useContext} from "react";
import {useQuery, useMutation} from 'react-apollo';
import {useHistory} from "react-router";
import {useParams} from "react-router-dom";
import {CATEGORIES_QUERY, UPDATE_POST, GET_POST_QUERY} from '../queries';
import {AuthContext} from "../contexts/AuthContext";
import {Editor} from "@tinymce/tinymce-react";


function EditPost() {

    const {state: {isAuthenticated, user}} = useContext(AuthContext);
    const history = useHistory();
    let {id} = useParams();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState("");

    const handleSubmit = (evt) => {
        evt.preventDefault();

        updatePost({
            variables: {
                id: id,
                input: {
                    title: title,
                    description: description,
                    category: category,
                },
                // file: image,
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
        if (!isAuthenticated) {
            history.push({
                pathname: "/",
            });
        }

        if (post_data.data && post_data.data.post) {
            setTitle(post_data.data.post.title);
            // setImageUrl(post_data.data.post.imageUrl);
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
                    <Editor
                        tinymceScriptSrc='https://cdn.bootcdn.net/ajax/libs/tinymce/5.5.1//tinymce.min.js'
                        onEditorChange={(content, editor) => setDescription(content)}
                        initialValue={description}
                        init={{
                            height: 500,
                            menubar: false,
                            contextmenu: 'formats | link image table',
                            plugins: [
                                'advlist autolink lists link image charmap print preview anchor',
                                'searchreplace visualblocks code fullscreen',
                                'insertdatetime media table paste code wordcount imagetools'
                            ],
                            toolbar: 'uploadimage undo redo | formatselect | ' +
                                'link image code bold italic backcolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat',
                            paste_data_images: true,
                            image_caption: true,
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                            images_upload_url: 'postAcceptor.php',
                            /* we override default upload handler to simulate successful upload*/
                            images_upload_handler: function (blobInfo, success, failure) {
                                uploadImage({
                                    variables: {
                                        file: blobInfo.blob(),
                                    }
                                }).then(r => {
                                    console.log(r);
                                    success(r.data.uploadImage.path);
                                }).catch(e => {
                                    console.log(e);
                                });
                                // setTimeout(function () {
                                //     /* no matter what you upload, we will turn it into TinyMCE logo :)*/
                                //     success('http://moxiecode.cachefly.net/tinymce/v9/images/logo.png');
                                // }, 2000);
                            }
                        }}
                    />
                    {/*<textarea*/}
                    {/*    className="form-control"*/}
                    {/*    id="description"*/}
                    {/*    required*/}
                    {/*    value={description}*/}
                    {/*    onChange={e => setDescription(e.target.value)}*/}
                    {/*    placeholder="Enter description"/>*/}
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

                {/*<div className="form-group">*/}
                {/*    <div className="row">*/}
                {/*        <div className="col-md-6">*/}
                {/*            <label htmlFor="description">Post Image</label>*/}
                {/*            <input*/}
                {/*                type="file"*/}
                {/*                className="form-control"*/}
                {/*                id="image"*/}
                {/*                required*/}
                {/*                onChange={({*/}
                {/*                               target: {*/}
                {/*                                   validity,*/}
                {/*                                   files: [file]*/}
                {/*                               }*/}
                {/*                           }) =>*/}
                {/*                    validity.valid && setImage(file)*/}
                {/*                }/>*/}
                {/*        </div>*/}
                {/*        <div className="col-md-6">*/}
                {/*            <img className="img-fluid" src={imageUrl} alt=""/>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </Fragment>
    );
}

export default EditPost;
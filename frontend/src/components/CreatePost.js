/* eslint-disable */
import React, {useState, useEffect, useContext} from "react";
import {useQuery, useMutation} from 'react-apollo';
import {Editor} from '@tinymce/tinymce-react';
import {CREATE_POST, CATEGORIES_QUERY, UPLOAD_IMAGE} from '../queries';
import {AuthContext} from "../contexts/AuthContext";


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

        if (!title || !description || !category) {
            alert('All fields are required');
            return;
        }

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
    const [uploadImage, result2] = useMutation(UPLOAD_IMAGE);
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
                <Editor
                    tinymceScriptSrc='https://cdn.bootcdn.net/ajax/libs/tinymce/5.5.1//tinymce.min.js'
                    onEditorChange={(content, editor) => setDescription(content)}
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
                <select className="form-control" required id="category" onChange={e => setCategory(e.target.value)}>
                    <option value="">Choose category</option>
                    {
                        data.categories.map(({id, title}) => (
                            <option value={id} key={id}>{title}</option>
                        ))
                    }
                </select>
            </div>

            {/*<div className="form-group">*/}
            {/*    <label htmlFor="description">Post Image</label>*/}
            {/*    <input*/}
            {/*        type="file"*/}
            {/*        className="form-control"*/}
            {/*        id="image"*/}
            {/*        required*/}
            {/*        onChange={({*/}
            {/*                       target: {*/}
            {/*                           validity,*/}
            {/*                           files: [file]*/}
            {/*                       }*/}
            {/*                   }) =>*/}
            {/*            validity.valid && setImage(file)*/}
            {/*        }/>*/}
            {/*</div>*/}

            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    );
}

export default CreatePost;
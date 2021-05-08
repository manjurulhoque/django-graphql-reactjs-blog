/* eslint-disable */
import React from "react";
import {useQuery, useMutation} from 'react-apollo';
import {NavLink} from 'react-router-dom';
import {POSTS_QUERY, DELETE_POST} from '../queries';
import '../assets/css/home.css';


function Home({ history }) {

    const deletePost = id => {
        if (window.confirm("Are you sure?")) {
            deleteBlogPost({
                variables: {
                    id: id
                }
            }).then(res => {
                if (res.data && res.data.deletePost.success) {
                    window.location.reload();
                } else {
                    alert(res.data.deletePost.message);
                }
            }).catch(err => {
                alert(err.message);
            });
        }
    }

    const [deleteBlogPost, result] = useMutation(DELETE_POST);

    const {data, loading, error} = useQuery(
        POSTS_QUERY
    );

    if (loading) return <h4>Loading...</h4>;
    if (error) return <h4>{error}</h4>;

    return (
        <React.Fragment>
            {/*<ul className="list-group">
                {data.posts.map(({id, title}) => (
                    <li key={id} className="list-group-item d-flex justify-content-between">
                        <p className="p-0 m-0 flex-grow-1">{title}</p>
                        <NavLink exact to={`/edit/${id}`} className="btn btn-success mr-1">EDIT</NavLink>
                        <button className="btn btn-danger" onClick={() => deletePost(id)}>DELETE</button>
                    </li>
                ))}
            </ul>*/}
            <section className="blog-me pt-100 pb-100" id="blog">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-6 mx-auto text-center">
                            <div className="section-title mb-100">
                                <h4>latest blog</h4>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {data.posts.map(({id, title, description, category, imageUrl, user: {username}}) => (
                            <div className="col-lg-4 col-md-6" key={id} style={{marginTop: '20px'}}>
                                <div className="single-blog">
                                    <div className="blog-img">
                                        <img src={imageUrl} alt=""/>
                                        <div className="post-category">
                                            <a href="#">{category.title}</a>
                                        </div>
                                    </div>
                                    <div className="blog-content">
                                        <div className="blog-title">
                                            <h4><a href="#">{title}</a></h4>
                                            {/*<div className="meta">*/}
                                            {/*    <ul>*/}
                                            {/*        <li>04 June 2018</li>*/}
                                            {/*    </ul>*/}
                                            {/*</div>*/}
                                        </div>
                                        <small>posted by: {username}</small>
                                        <hr/>
                                        <NavLink exact to={`/edit/${id}`} className="btn btn-success mr-1">EDIT</NavLink>
                                        <button className="btn btn-danger" onClick={() => deletePost(id)}>DELETE</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </React.Fragment>
    )

    // return (
    //
    // < Fragment >
    // <Query query={POSTS_QUERY}>
    // {({loading, error, data}) => {
    //
    //                 if (error) console.log(error);
    //                 return (
    //                     <Fragment>
    //                         {/*{data.launches.map(launch => (*/}
    //                         {/*    <LaunchItem key={launch.flight_number} launch={launch}/>*/}
    //                         {/*))}*/}
    //                     </Fragment>
    //                 );
    //             }}
    //         </Query>
    //     </Fragment>
    // );
}

export default Home;
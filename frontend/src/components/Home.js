import React from "react";
import {useQuery, useMutation} from 'react-apollo';
import {NavLink} from 'react-router-dom';
import {POSTS_QUERY, DELETE_POST} from '../queries';
import {useHistory} from "react-router";


function Home() {

    const history = useHistory();

    const deletePost = id => {
        deleteBlogPost({
            variables: {
                id: id
            }
        }).then(res => {
            console.log(res);
            if (res.data && res.data.deletePost.ok) {
                alert(res.data.deletePost.message);
                window.location.reload();
            } else {
                alert(res.data.deletePost.message);
            }
        }).catch(err => {
            alert(err.message);
        })
    }

    const [deleteBlogPost, result] = useMutation(DELETE_POST);

    const {data, loading, error} = useQuery(
        POSTS_QUERY
    );

    if (loading) return <h4>Loading...</h4>;
    if (error) return <h4>{error}</h4>;

    return (
        <ul className="list-group">
            {data.posts.map(({id, title}) => (
                <li key={id} className="list-group-item d-flex justify-content-between">
                    <p className="p-0 m-0 flex-grow-1">{title}</p>
                    <NavLink exact to={`/edit/${id}`} className="btn btn-success mr-1">EDIT</NavLink>
                    <button className="btn btn-danger" onClick={() => deletePost(id)}>DELETE</button>
                </li>
            ))}
        </ul>
    )

    // return (
    //     <Fragment>
    //         <Query query={POSTS_QUERY}>
    //             {({loading, error, data}) => {
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
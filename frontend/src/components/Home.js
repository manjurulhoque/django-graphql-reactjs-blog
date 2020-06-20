import React from "react";
import {useQuery} from 'react-apollo';
import {NavLink} from 'react-router-dom';
import {POSTS_QUERY} from '../queries';


function Home() {
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
                    <button className="btn btn-danger">DELETE</button>
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
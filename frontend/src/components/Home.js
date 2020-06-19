import React, {Fragment} from "react";
import gql from 'graphql-tag';
import {Query, useQuery} from 'react-apollo';

const POSTS_QUERY = gql`
  query posts {
    posts {
      id
      title
    }
  }
`;

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
                    <button className="btn-success">EDIT</button>
                    <button className="btn-danger">DELETE</button>
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
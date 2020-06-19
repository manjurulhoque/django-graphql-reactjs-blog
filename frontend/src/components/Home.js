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
    const {data, loading} = useQuery(
        POSTS_QUERY
    );

    if (loading) return <h4>Loading...</h4>;

    return data.posts.map(({id, title}) => (
        <div key={id}>
            <p>
                Post - {id}: {title}
            </p>
        </div>
    ));

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
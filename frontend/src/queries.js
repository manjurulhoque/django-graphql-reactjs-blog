import gql from "graphql-tag";

const POSTS_QUERY = gql`
  query posts {
    posts {
      id
      title
    }
  }
`;

const CREATE_POST = gql`
    mutation createPost($input: PostInput!) {
        createPost(input: $input) {
            ok
        }
    }
`;

const UPDATE_POST = gql`
    mutation updatePost($id: Int!, $input: PostInput!) {
        updatePost(id: $id, input: $input) {
            ok
        }
    }
`;

const CATEGORIES_QUERY = gql`
    query categories {
        categories {
          id
          title
        }
    }
`;

const GET_POST_QUERY = gql`
    query post($id: Int!) {
        post(id: $id) {
            id
            title
            description
            category {
                id
                title
            }
        }
    }
`;

export {
    POSTS_QUERY,
    CREATE_POST,
    UPDATE_POST,
    CATEGORIES_QUERY,
    GET_POST_QUERY,
}
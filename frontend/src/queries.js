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

const DELETE_POST = gql`
    mutation deletePost($id: Int!) {
        deletePost(id: $id) {
            ok
            message
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

const USER_CREATE_QUERY = gql`
  mutation createUser($username: String!, $email: String!, $password: String!) { 
      createUser(username: $username, email: $email, password: $password) {
         ok
         user {
           username
           email
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
    DELETE_POST,
    USER_CREATE_QUERY,
}
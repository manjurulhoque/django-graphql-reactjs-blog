import gql from "graphql-tag";

const POSTS_QUERY = gql`
  query posts {
    posts {
      id
      title
      description
      imageUrl
      category {
        title
      }
      user {
        username
      }
    }
  }
`;

const CREATE_POST = gql`
    mutation createPost($input: PostInput!, $file: Upload) {
        createPost(input: $input, file: $file) {
            success
            errors
        }
    }
`;

const UPLOAD_IMAGE = gql`
    mutation uploadImage($file: Upload!) {
        uploadImage(file: $file) {
            success
            path
        }
    }
`;

const UPDATE_POST = gql`
    mutation updatePost($id: Int!, $input: PostInput!, $file: Upload) {
        updatePost(id: $id, input: $input, file: $file) {
            success
            errors
            post {
              title
              imageUrl
            }
        }
    }
`;

const DELETE_POST = gql`
    mutation deletePost($id: Int!) {
        deletePost(id: $id) {
            success
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
            imageUrl
            category {
                id
                title
            }
        }
    }
`;

const USER_REGISTER_QUERY = gql`
  mutation register($username: String!, $email: String!, $password1: String!, $password2: String!) { 
      register(username: $username, email: $email, password1: $password1, password2: $password2) {
         success
         errors
      }
  }
`;

const USER_LOGIN_MUTATION = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            token
            payload
            refreshExpiresIn
        }
    }
`;

export {
    POSTS_QUERY,
    CREATE_POST,
    UPLOAD_IMAGE,
    UPDATE_POST,
    CATEGORIES_QUERY,
    GET_POST_QUERY,
    DELETE_POST,
    USER_REGISTER_QUERY,
    USER_LOGIN_MUTATION,
}
import React, {useState} from 'react';
import '../auth.css';
import {useHistory} from "react-router";
import {useMutation} from "react-apollo";
import {USER_LOGIN_MUTATION} from "../queries";

function Login(props) {

    const history = useHistory();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState([]);

    const [loginUser, result] = useMutation(USER_LOGIN_MUTATION, {
        variables: {
            username: username,
            password: password,
        }
    });

    const handleSubmit = e => {
        e.preventDefault();
        let my_errors = [];

        loginUser()
            .then(r => {
                my_errors = [];
                if (r.data.login.token) {
                    localStorage.setItem("gql_token", r.data.login.token);
                    setSuccess(true);
                } else {
                    r.errors.map((error, index) => {
                        my_errors.push(error.message);
                    });
                }

                setErrors(my_errors);
            })
            .catch(err => {
                err.graphQLErrors.map((error, index) => {
                    my_errors.push(error.message);
                });

                setErrors(my_errors);
            });
    }

    return (
        <div className="container register">
            <div className="row">
                <div className="col-md-3 register-left">
                    <img src="https://image.ibb.co/n7oTvU/logo_white.png" alt=""/>
                    <h3>Welcome</h3>
                    <p>You are 30 seconds away from writing blog post!</p>
                </div>
                <div className="col-md-9 register-right">
                    <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                        <h3 className="register-heading">Login</h3>
                        {
                            success ? <div className="alert alert-success" role="alert">Login successful!</div> : ''
                        }
                        {
                            errors.length > 0 ?
                                (
                                    errors.map((error, index) =>
                                        <div className="alert alert-danger" key={index} role="alert">{error}</div>
                                    )
                                ) : ''
                        }
                        <div className="row register-form">
                            <div className="col-md-12">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <input type="text"
                                               value={username}
                                               required
                                               onChange={e => setUsername(e.target.value)}
                                               className="form-control"
                                               placeholder="Username"/>
                                    </div>
                                    <div className="form-group">
                                        <input type="password"
                                               value={password}
                                               required
                                               onChange={e => setPassword(e.target.value)}
                                               className="form-control"
                                               placeholder="Password"/>
                                    </div>
                                    <input type="submit" className="btnRegister" value="Login"/>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;
import React, {useState} from 'react';
import '../auth.css';
import {USER_CREATE_QUERY} from '../queries';
import {useMutation} from "react-apollo";
import {useHistory} from "react-router";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup(props) {

    const history = useHistory();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = e => {
        e.preventDefault();

        createUser().then(r => {
            history.push({
                pathname: "/",
            });
        });

        // if (result.error) {
        //     result.error.graphQLErrors.map(error => {
        //         console.log(error);
        //         toast(`${error.message}`);
        //         // if (error.extensions.code === "constraint-violation")
        //         //     toast(`${error.message}`);
        //     });
        // }
    }

    const [createUser, result] = useMutation(USER_CREATE_QUERY, {
        variables: {
            username: username,
            email: email,
            password: password,
        }
    });

    return (
        <div className="container register">
            <div className="row">
                <div className="col-md-3 register-left">
                    <img src="https://image.ibb.co/n7oTvU/logo_white.png" alt=""/>
                    <h3>Welcome</h3>
                    <p>You are 30 seconds away from writing blog post!</p>
                </div>
                <div className="col-md-9 register-right">
                    <div className="tab-pane fade show active">
                        <h3 className="register-heading">Register</h3>
                        <div className="row register-form">
                            <div className="col-md-12">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={email}
                                            required
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="Your Email"/>
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={username}
                                            required
                                            onChange={e => setUsername(e.target.value)}
                                            placeholder="Username"/>
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={password}
                                            required
                                            onChange={e => setPassword(e.target.value)}
                                            placeholder="Password"/>
                                    </div>
                                    <input type="submit" className="btnRegister" value="Register"/>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </div>
    )
}

export default Signup;
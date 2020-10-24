import React, {useState} from 'react';
import '../auth.css';
import {USER_REGISTER_QUERY} from '../queries';
import {useMutation} from "react-apollo";
import {useHistory} from "react-router";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup(props) {

    const history = useHistory();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [passwordOne, setPasswordOne] = useState("");
    const [passwordTwo, setPasswordTwo] = useState("");
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState([]);

    const handleSubmit = e => {
        e.preventDefault();
        let my_errors = [];

        register().then(r => {
            if (r.data.register.success) {
                setSuccess(true);
                my_errors = [];
                setTimeout(() => {
                    history.push({
                        pathname: "/",
                    });
                }, 1000);
            } else {
                for (let [key, errors] of Object.entries(r.data.register.errors)) {
                    errors.map((error, index) => {
                        my_errors.push(error.message);
                    });
                }

                setErrors(my_errors);
            }
        });
    }

    const [register, result] = useMutation(USER_REGISTER_QUERY, {
        variables: {
            username: username,
            email: email,
            password1: passwordOne,
            password2: passwordTwo,
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
                        {
                            success ? <div className="alert alert-success" role="alert">Registration successful. Login now!</div> : ''
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
                                            value={passwordOne}
                                            required
                                            onChange={e => setPasswordOne(e.target.value)}
                                            placeholder="Password"/>
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={passwordTwo}
                                            required
                                            onChange={e => setPasswordTwo(e.target.value)}
                                            placeholder="Confirm Password"/>
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
import React from 'react';
import '../auth.css';

function Login(props) {
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
                        <div className="row register-form">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <input type="text" className="form-control" placeholder="Username"/>
                                </div>
                                <div className="form-group">
                                    <input type="password" className="form-control" placeholder="Password"/>
                                </div>
                                <input type="submit" className="btnRegister" value="Register"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;
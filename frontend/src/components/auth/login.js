import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLoginMutation } from '../../redux/api/authApi';
import toast from 'react-hot-toast';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [login, {isLoading,error,data }]  = useLoginMutation();

    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.auth);
    useEffect(() => {
        if (isAuthenticated) {
          navigate("/");
        }
        if (error) {
          toast.error(error?.data?.message);
        }
      }, [error, isAuthenticated]);
    

    const submitHandler = (e) => {
        e.preventDefault();
        const loginData = {email,password};
        login(loginData);
    }

    return (
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form className="shadow-lg" onSubmit={submitHandler}>
                    <h1 className="mb-3">Login</h1>
                    <div className="form-group">
                        <label htmlFor="email_field">Email</label>
                        <input
                            type="email"
                            id="email_field"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password_field">Password</label>
                        <input
                            type="password"
                            id="password_field"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <Link to="/password/forgot" className="float-right mb-4">Forgot Password?</Link>

                    <button id="login_button" type="submit" className="btn w-100 py-2" disabled={isLoading}>
                       {isLoading? "Authenticating...":"LOGIN"} 
                    </button>

                    <div className="my-3">
                        <Link to="/register" className="float-right mt-3">New User?</Link>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default Login
import React, {useState} from 'react';
import {Link, Navigate, useNavigate} from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
    const navigate = useNavigate();
    const isAuthorized = false;
    const [userData, setUserData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    })

    const handleChangeData = (e) => {
        setUserData({
            ...userData,
            [e.currentTarget.name]: e.currentTarget.value
        })
    }


    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('/api/users/', userData).then(() => {
            navigate('/login', {state: {
                email: userData.email,
                password: userData.password
            }})
        })
        // .catch(({response}) => {
        //     let error = response.data;
        //     if(error?.email) {
        //         error = `Email: ${error.email[0].toLowerCase()}`
        //     }
        //     else if (error?.password) {
        //         error = `Password: ${error.password[0].toLowerCase()}`
        //     }
        //     else {
        //         error = "Something went wrong"
        //     }
        //     dispatch(setRegisterError(error));
        // })
    }

    return isAuthorized ?
        <Navigate to='/' replace/>
        :
        <div className="authorization-container-wrapper">

            <div className="authorization-container">
                <p className="form-header">Sign Up</p>
                <form method="post"
                      onSubmit={handleSubmit}
                      className="authorization-form"
                >
                    <input type="email"
                           name="email"
                           onChange={handleChangeData}
                           placeholder="Email Address"
                    />
                    <input type="password"
                           name="password"
                           onChange={handleChangeData}
                           placeholder="Enter password"
                    />
                    <input type="password"
                           name="confirmPassword"
                           onChange={handleChangeData}
                           placeholder="Re-enter password"
                    />
                    <input type="submit" className="submit-button"/>
                    <p className="form-footer">
                        Already have an account? <Link to={{pathname: '/login/'}}>Log in</Link>
                    </p>
                </form>
            </div>
        </div>
};

export default RegisterPage;
import React, {useState} from 'react';
import {Link, Navigate, useNavigate} from "react-router-dom";
import axios from "axios";
import RegisterForm from "../components/register-form/RegisterForm";

const RegisterPage = () => {
    const navigate = useNavigate();
    const isAuthorized = false;
    const [userData, setUserData] = useState({
        email: '',
        password: '',
        isEmployee: false,
        confirmPassword: ''
    });
    const [companyData, setCompanyData] = useState({
        title: undefined
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        let { email, password } = userData;
        if (!userData.isEmployee) {
            axios.post('/api/users/', {email, password}).then(() => {
                navigate('/login', {
                    state: {
                        email: userData.email,
                        password: userData.password
                    }
                })
            })
        } else {
            axios.post('/api/companies/', {email, password, ...companyData})
                .then(({ data }) => {
                    const companyId = data?.id;
                    axios.post('/login/', { email, password })
                        .then(({ data }) => {
                            localStorage.setItem('access_token', data.access);
                            localStorage.setItem('refresh_token', data.refresh);
                            navigate(`/companies/${companyId}`);
                            window.location.reload();
                        })

            })
        }



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
                <RegisterForm className='authorization-form'
                              userData={userData}
                              setUserData={setUserData}
                              companyData={companyData}
                              setCompanyData={setCompanyData}
                              onSubmit={handleSubmit}>
                </RegisterForm>
                <p className="form-footer">
                    Already have an account? <Link to={{pathname: '/login'}}>Log in</Link>
                </p>
            </div>
        </div>
};

export default RegisterPage;
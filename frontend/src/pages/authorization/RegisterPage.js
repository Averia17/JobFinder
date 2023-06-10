import React, {useState} from 'react';
import {Link, Navigate, useNavigate} from "react-router-dom";
import axios from "axios";
import RegisterForm from "../../components/register-form/RegisterForm";
import ErrorAlert from "../../components/alerts/ErrorAlert";
import './style.css'

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
    const [signupError, setSignupError] = useState(undefined);

    const handleSubmit = (e) => {
        e.preventDefault();
        let { email, password, confirmPassword } = userData;
        if (password !== confirmPassword) {
            setSignupError('Your passwords are not equal');
            return;
        }
        if (!userData.isEmployee) {
            axios.post('/api/users/', {email, password}).then(() => {
                navigate('/login', {
                    state: {
                        email: userData.email,
                        password: userData.password
                    }
                })
            }).catch(({ response }) => {
                if (response.data.email)
                    setSignupError(`Email: ${response.data.email}`)
                else if(response.data.password)
                    setSignupError(`Password: ${response.data.password}`)
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

            }).catch(({ response }) => {
                if (response.data.email)
                    setSignupError(`Email: ${response.data.email[0]}`)
                else if(response.data.password)
                    setSignupError(`Password: ${response.data.password}`)
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
                <p className="form-header">Регистрация</p>
                <RegisterForm className='authorization-form'
                              userData={userData}
                              setUserData={setUserData}
                              companyData={companyData}
                              setCompanyData={setCompanyData}
                              onSubmit={handleSubmit}>
                </RegisterForm>
                <p className="form-footer">
                    У Вас уже есть аккаунт? <Link to={{pathname: '/login'}}>Войти</Link>
                </p>
            </div>
            {signupError && <ErrorAlert error={signupError} setError={setSignupError}/>}
        </div>
};

export default RegisterPage;
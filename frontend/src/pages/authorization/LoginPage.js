import React, {useCallback, useEffect, useState} from 'react';
import {Navigate, useLocation} from "react-router-dom";
import {Link} from "react-router-dom";
import axios from "axios";
import {useNavigate} from "react-router";
import ErrorAlert from "../../components/alerts/ErrorAlert";
import './style.css'
import GoogleLogin from "react-google-login";
import {gapi} from "gapi-script";
import Input from "../../components/inputs/Input";

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthorized = false;
    const [userData, setUserData] = useState({
        email: '',
        password: '',
    })
    const [loginError, setLoginError] = useState(undefined);

    useEffect(() => {
        if (location?.state?.email) {
            setUserData({email: location?.state?.email, password: location?.state?.password})
        }
    }, [])

    useEffect(() => {
        gapi.load("client:auth2", () => {
            gapi.client.init({
                clientId: '62994257140-7f4g98j9a2q67vg88n2fgmb74fkd4202.apps.googleusercontent.com',
                plugin_name: "chat",
            });
        });
    }, [])

    const handleChangeData = (e) => {
        setUserData({
            ...userData,
            [e.currentTarget.name]: e.currentTarget.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/login/', userData).then(({ data }) => {
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
        }).then(() => {
            navigate("/");
            window.location.reload();
        }).catch(({ response }) => {
            setLoginError(response.data.detail);
        })
    }

    const Login = () => {
        return (
            <GoogleLogin
                clientId='62994257140-7f4g98j9a2q67vg88n2fgmb74fkd4202.apps.googleusercontent.com' // your Google app client ID
                buttonText="Войти через Google"
                onSuccess={onGoogleLoginSuccess} // perform your user logic here
                onFailure={onGoogleLoginFailure} // handle errors here
            />
        );
    };

    const onGoogleLoginFailure = useCallback(
        response => {
            console.log(response)
        }, []);

    const onGoogleLoginSuccess = useCallback(
        response => {
            const idToken = response.tokenId;
            const data = {
                email: response.profileObj.email,
                first_name: response.profileObj.givenName,
                last_name: response.profileObj.familyName
            };
            validateTokenAndObtainSession({data, idToken})
                .then(response => {
                    localStorage.setItem('access_token', response.data.access_token);
                    localStorage.setItem('refresh_token', response.data.refresh_token);
                }).then(() => {
                    navigate("/");
                    window.location.reload();
                })
                .catch(err => console.log(err));
        }, []
    );

    const validateTokenAndObtainSession = ({data, idToken}) => {
        const headers = {
            Authorization: idToken,
            'Content-Type': 'application/json'
        };
        return axios.post('/login/google/', data, {headers});
    };

    return isAuthorized ?
        <Navigate to='/' replace/>
        :
        <div className="authorization-container-wrapper">
            <div className="authorization-container">
                <p className="form-header">Авторизация</p>
                <form method="post"
                      onSubmit={handleSubmit}
                      className="authorization-form"
                >
                    <Input type="email"
                           name="email"
                           defaultValue={userData.email ? userData.email : null}
                           onChange={handleChangeData}
                           placeholder="Email"
                    />
                    <Input type="password"
                           name="password"
                          defaultValue={userData.password ? userData.password : null}
                           onChange={handleChangeData}
                           placeholder="Пароль"
                    />
                    <input type="submit"
                           value='Войти'
                           className="submit-button"
                    />
                    <Login/>
                    <p className="form-footer">
                        Ещё нет аккаунта? <Link to={{pathname: '/register/'}}>Регистрация</Link>
                    </p>
                </form>
            </div>
            {/*<div className="error-alert">*/}
            {/*    {*/}
            {/*        loginError?*/}
            {/*            <Alert onClose={() => {dispatch(setLoginErrorNull())}} variant="outlined" severity="error" >*/}
            {/*                { loginError}*/}
            {/*            </Alert>*/}
            {/*            :*/}
            {/*            null*/}
            {/*    }*/}
            {/*</div>*/}
            {loginError && <ErrorAlert error={loginError} setError={setLoginError}/>}
        </div>
};

export default LoginPage;
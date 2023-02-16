import React, {useCallback, useEffect, useState} from 'react';
import {Navigate, useLocation} from "react-router-dom";
import {Link} from "react-router-dom";
import axios from "axios";
import {useNavigate} from "react-router";
// import GoogleLogin from "react-google-login";
// import {gapi} from "gapi-script";

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthorized = false;
    const [userData, setUserData] = useState({
        email: '',
        password: '',
    })
    useEffect(() => {
        if (location?.state?.email) {
            setUserData({email: location?.state?.email, password: location?.state?.password})
        }
    }, [])
    //
    // useEffect(() => {
    //     gapi.load("client:auth2", () => {
    //         gapi.client.init({
    //             clientId: '62994257140-7f4g98j9a2q67vg88n2fgmb74fkd4202.apps.googleusercontent.com',
    //             plugin_name: "chat",
    //         });
    //     });
    // }, [])
    //
    const handleChangeData = (e) => {
        setUserData({
            ...userData,
            [e.currentTarget.name]: e.currentTarget.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/login/', userData).then(response => {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
        }).then(() => {
            navigate("/");
        })
    }
    //
    // const Login = () => {
    //     return (
    //         <GoogleLogin
    //             clientId='62994257140-7f4g98j9a2q67vg88n2fgmb74fkd4202.apps.googleusercontent.com' // your Google app client ID
    //             buttonText="Sign in with Google"
    //             onSuccess={onGoogleLoginSuccess} // perform your user logic here
    //             onFailure={onGoogleLoginFailure} // handle errors here
    //         />
    //     );
    // };

    // const onGoogleLoginFailure = useCallback(
    //     response => {
    //         console.log(response)
    //     }, []);
    //
    // const onGoogleLoginSuccess = useCallback(
    //     response => {
    //         const idToken = response.tokenId;
    //         const data = {
    //             email: response.profileObj.email,
    //             first_name: response.profileObj.givenName,
    //             last_name: response.profileObj.familyName
    //         };
    //         validateTokenAndObtainSession({data, idToken})
    //             .then(response => {
    //                 localStorage.setItem('access_token', response.data.access);
    //                 localStorage.setItem('refresh_token', response.data.refresh);
    //                 localStorage.setItem('user', response.data.id);
    //             })
    //             .catch(err => console.log(err));
    //     }, []
    // );
    //
    // const validateTokenAndObtainSession = ({data, idToken}) => {
    //     const headers = {
    //         Authorization: idToken,
    //         'Content-Type': 'application/json'
    //     };
    //     return axios.post('/login/google/', data, {headers});
    // };


    return isAuthorized ?
        <Navigate to='/' replace/>
        :
        <div className="authorization-container-wrapper">
            <div className="authorization-container">
                {/*<Login/>*/}
                <form method="post"
                      onSubmit={handleSubmit}
                      className="authorization-form"
                >
                    <input type="email"
                           name="email"
                           defaultValue={userData.email ? userData.email : null}
                           onChange={handleChangeData}
                           placeholder="Email"
                    />
                    <input type="password"
                           name="password"
                          defaultValue={userData.password ? userData.password : null}
                           onChange={handleChangeData}
                           placeholder="Password"
                    />
                    <input type="submit"
                           className="submit-button"
                    />
                    {/*<button className="forgot-button" onClick={handleClickShowModal}>Forgot password</button>*/}
                    <p className="form-footer">
                        If you haven't an account click to <b><Link to={{pathname: '/register/'}}>Register</Link></b>
                    </p>
                </form>
                {/*<ForgotPasswordModal/>*/}
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
        </div>
};

export default LoginPage;
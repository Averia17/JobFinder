import React, {useState} from 'react';
import Input from "../../components/inputs/Input";
import {useNavigate, useSearchParams} from "react-router-dom";
import axios from "axios";
import ErrorAlert from "../../components/alerts/ErrorAlert";

const RegisterManagerPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const [managerPasswords, setManagerPasswords] = useState({ password: undefined, confirmPassword: undefined });
    const [signupError, setSignupError] = useState(undefined);

    const handleChangePasswords = event => {
        setManagerPasswords({
            ...managerPasswords,
            [event.currentTarget.name]: event.currentTarget.value
        })
    }

    const handleSubmitRegisterManager = event => {
        event.preventDefault();
        const { password, confirmPassword } = managerPasswords;
        if (password !== confirmPassword) {
            setSignupError('Your passwords are not equal');
            return;
        }
        if (token && email) {
            axios.post('/api/managers/accept_invite/', { token, email, new_password: managerPasswords.password })
                .then(() => {
                    axios.post('/login/', { email, password: managerPasswords.password })
                        .then(({ data }) => {
                            localStorage.setItem('access_token', data.access);
                            localStorage.setItem('refresh_token', data.refresh);
                        })
                        .then(() => {
                            navigate("/");
                            window.location.reload();
                        })
                })
                .catch(({ response }) => {
                    setSignupError(`Password: ${response.data.password}`)
                })
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmitRegisterManager}>
                <label htmlFor='password'>Password</label>
                <Input type='password' name='password' onChange={handleChangePasswords} required/>
                <label htmlFor='confirmPassword'>Confirm password</label>
                <Input type='password' name='confirmPassword' onChange={handleChangePasswords} required/>
                <input type='submit'/>
            </form>
            {signupError && <ErrorAlert error={signupError} setError={setSignupError}/>}
        </div>
    );
};

export default RegisterManagerPage;
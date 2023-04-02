import React, {useState} from 'react';
import Input from "../../components/inputs/Input";
import {useNavigate, useSearchParams} from "react-router-dom";
import axios from "axios";

const RegisterManagerPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const [managerPasswords, setManagerPasswords] = useState({ password: undefined, confirmPassword: undefined });

    const handleChangePasswords = event => {
        setManagerPasswords({
            ...managerPasswords,
            [event.currentTarget.name]: event.currentTarget.value
        })
    }

    const handleSubmitRegisterManager = event => {
        event.preventDefault();
        if (token && email && managerPasswords.password === managerPasswords.confirmPassword) {
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

        </div>
    );
};

export default RegisterManagerPage;
import React, {useState} from 'react';
import Input from "../../components/inputs/Input";
import {useNavigate, useSearchParams} from "react-router-dom";
import axios from "axios";
import ErrorAlert from "../../components/alerts/ErrorAlert";
import './style.css'

const RegisterManagerPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const [managerPasswords, setManagerPasswords] = useState({password: undefined, confirmPassword: undefined});
    const [signupError, setSignupError] = useState(undefined);

    const handleChangePasswords = event => {
        setManagerPasswords({
            ...managerPasswords,
            [event.currentTarget.name]: event.currentTarget.value
        })
    }

    const handleSubmitRegisterManager = event => {
        event.preventDefault();
        const {password, confirmPassword} = managerPasswords;
        if (password !== confirmPassword) {
            setSignupError('Your passwords are not equal');
            return;
        }
        if (token && email) {
            axios.post('/api/managers/accept_invite/', {token, email, new_password: managerPasswords.password})
                .then(() => {
                    axios.post('/login/', {email, password: managerPasswords.password})
                        .then(({data}) => {
                            localStorage.setItem('access_token', data.access);
                            localStorage.setItem('refresh_token', data.refresh);
                        })
                        .then(() => {
                            navigate("/");
                            window.location.reload();
                        })
                })
                .catch(({response}) => {
                    let error = response.data;
                    if (response.data.new_password)
                        error = `Password: ${response.data.new_password}`
                    setSignupError(error)
                })
        }
    }

    return (
        <div className='authorization-container-wrapper'>
            <div className="authorization-container">
                <p className="form-header">Создайте пароль</p>
                <form onSubmit={handleSubmitRegisterManager} className='authorization-form'>
                        <Input placeholder="Пароль" type='password' name='password' onChange={handleChangePasswords} required/>
                        <Input placeholder="Повторите пароль" type='password' name='confirmPassword' onChange={handleChangePasswords} required/>
                        <input className="submit-button" type='submit'/>
                </form>
            </div>
            {signupError && <ErrorAlert error={signupError} setError={setSignupError}/>}
        </div>
    );
};

export default RegisterManagerPage;
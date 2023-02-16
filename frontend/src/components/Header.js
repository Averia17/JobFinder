import React, {useEffect, useState} from 'react';

import logo from '../assets/logo.jpg'
import {Link} from "react-router-dom";
import jwt_decode from "jwt-decode";
import {useNavigate} from "react-router";
import axios from "axios";

const Header = () => {
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    // const isAdmin = false;
    // const { isAdmin } = useSelector(state => state.admin);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            const decodedToken = jwt_decode(token);
            if (decodedToken.exp * 1000 < new Date().getTime()) {
                axios.post('/refresh-token/', localStorage.getItem("refresh_token"))
                .then(({data}) => {
                    localStorage.setItem('access_token', data.access)
                })
            }
            else {
                setIsAuthorized(true)
            }
        }
    }, [localStorage.getItem("access_token")]);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setIsAuthorized(false)
        setIsAdmin(false)
    }

    return (
        <div className='header-container'>
            <div className='header-logo-container'>
                <img src={logo}/>
            </div>
            <div className='header-links'>
                <div className='head'>
                    <div className='tours'>Резюме</div>
                    <div className='hotels'>Отклики</div>
                    {
                        isAuthorized ?
                            (isAdmin ?
                                <div className='authentication'><Link to={{pathname: '/admin'}}>Admin Panel</Link></div>
                                :
                                <div className='authentication'><Link to={{pathname: '/profile'}}>Profile</Link></div>)
                            :
                            null
                    }
                </div>
                {
                    isAuthorized ?
                        <div className='authentication' onClick={handleLogout}>Logout</div>
                        :
                        <div className='authentication'>
                            <Link to={{pathname: '/login/'}}>Log in</Link>
                            &nbsp;or&nbsp;
                            <Link to={{pathname: '/register/'}}>Sign up</Link>
                        </div>
                }
            </div>
        </div>
    );
};

export default Header;
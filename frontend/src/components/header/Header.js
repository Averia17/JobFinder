import React, {useEffect, useState} from 'react';

import logo from '../../assets/logo.svg'
import {Link} from "react-router-dom";
import jwt_decode from "jwt-decode";
import {useNavigate} from "react-router";
import axios from "axios";
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";

const Header = () => {
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const tokenInfo = useGetInfoFromToken();

    useEffect(() => {
        if (tokenInfo?.accessToken) {
            if (tokenInfo.exp * 1000 < new Date().getTime()) {
                console.log(tokenInfo.exp * 1000 < new Date().getTime())
                axios.post('/refresh-token/', { refresh: localStorage.getItem("refresh_token") })
                    .then(({data}) => {
                        localStorage.setItem('access_token', data.access)
                    })
                    .catch(() => {
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                    })
            } else {
                setIsAuthorized(true)
            }
        }
    }, [tokenInfo?.accessToken]);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setIsAuthorized(false)
        window.location.reload();
    }

    return (
        <div className='header-container'>
            <div className='header-logo-container'>
                <img src={logo}/>
            </div>
            <div className='header-links'>
                <div className='head'>
                    <div className='vacancies'><Link to={{pathname: '/vacancies'}}>Vacancies</Link></div>
                    { isAuthorized &&
                        <>
                            <div className='authentication'><Link to={{pathname: '/profile'}}>Profile</Link></div>
                            <div className='authentication'><Link to={{pathname: '/favorites'}}>Favorites</Link></div>
                        </>
                    }
                    {
                        isAuthorized ?
                            (tokenInfo?.company ?
                                    <>
                                    <div className='authentication'><Link to={{pathname: '/resumes'}}>Resumes</Link></div>
                                    <div className='authentication'><Link to={{pathname: '/company'}}>Company</Link>
                                    </div>
                                    </>
                                    :
                                    <>
                                        <div className='authentication'><Link to={{pathname: '/resumes/my'}}>Resumes</Link></div>
                                        <div className='authentication'><Link to={{pathname: '/responses'}}>Responses</Link></div>
                                    </>
                            )
                            :
                            null
                    }
                </div>
                {
                    isAuthorized ?
                        <div className='authentication' onClick={handleLogout}>Logout</div>
                        :
                        <div className='authentication'>
                            <Link to={{pathname: '/login'}}>Log in</Link>
                            &nbsp;or&nbsp;
                            <Link to={{pathname: '/register'}}>Sign up</Link>
                        </div>
                }
            </div>
        </div>
    );
};

export default Header;
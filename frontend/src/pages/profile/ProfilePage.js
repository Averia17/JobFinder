import React, {useEffect, useState} from 'react';
import axios from "axios";

import './style.css'

const ProfilePage = ({props}) => {
    const accessToken = localStorage.getItem('access_token');
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        axios.get('/api/users/my', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(({data}) => setUserInfo(data))
    }, [accessToken])

    const { id } = userInfo;

    return (
        <div key={ id } className='profile__container'>
            {
                Object.entries(userInfo).map((entry, index) => (
                    <div key={index} className='profile__field'>
                        <h4>{entry[0]}</h4>
                        <p>{entry[1]}</p>
                    </div>
                ))
            }
        </div>
    );
};

export default ProfilePage;
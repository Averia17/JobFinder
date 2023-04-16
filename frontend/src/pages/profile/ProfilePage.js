import React, {useEffect, useState} from 'react';
import axios from "axios";

import './style.css'
import Input from "../../components/inputs/Input";
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import ErrorAlert from "../../components/alerts/ErrorAlert";

const ProfilePage = () => {
    const tokenInfo = useGetInfoFromToken();
    const [userInfo, setUserInfo] = useState({});
    const [updatedProfileInfo, setUpdatedProfileInfo] = useState({});
    const [isUpdated, setUpdated] = useState(false);
    const [phoneError, setPhoneError] = useState(undefined);

    const handleChangeProfileInfo = event => {
        setUpdatedProfileInfo({
            ...updatedProfileInfo,
            [event.target.name]: event.target.value
        })
    }

    const handleSubmitUpdate = event => {
        event.preventDefault();
        axios.patch(`/api/users/my/`, updatedProfileInfo, {
            headers: { Authorization: `Bearer ${tokenInfo.accessToken}` }
        }).then(() => setUpdated(false))
          .catch(({ response }) => {
              setPhoneError(response.data.phone);
          })
    }

    useEffect(() => {
        setUpdated(Object.keys(updatedProfileInfo).length > 0)
    }, [updatedProfileInfo])

    useEffect(() => {
        axios.get('/api/users/my', {
            headers: {
                Authorization: `Bearer ${tokenInfo.accessToken}`
            }
        }).then(({data}) => setUserInfo(data))
    }, [tokenInfo.accessToken])

    const { id } = userInfo;

    return (
        <div key={ id } className='profile__container'>
            {/*{*/}
            {/*    Object.entries(userInfo).map((entry, index) => (*/}
            {/*        <div key={index} className='profile__field'>*/}
            {/*            <h4>{entry[0]}</h4>*/}
            {/*            <p>{entry[1]}</p>*/}
            {/*        </div>*/}
            {/*    ))*/}
            <div className='profile__field'>
                <h4>Id</h4>
                <p>{userInfo?.id}</p>
            </div>
            <div className='profile__field'>
                <h4>Email</h4>
                <p>{userInfo?.email}</p>
            </div>
            <form onSubmit={handleSubmitUpdate}>
                <div className='profile__field'>
                    <h4><label htmlFor='phone'>Phone</label></h4>
                    <Input className="profile__input" placeholder="+375293332211" type='text' name='phone' value={userInfo?.phone} onChange={handleChangeProfileInfo}/>
                </div>
                <div  className='profile__field'>
                    <h4><label htmlFor='name'>Name</label></h4>
                    <Input className="profile__input" type='text' name='name' value={userInfo?.name} onChange={handleChangeProfileInfo} />
                </div>
                <div>{isUpdated && <input className="submit__button" type='submit'/>}</div>
            </form>
            {phoneError && <ErrorAlert error={phoneError} setError={setPhoneError}/>}
        </div>
    );
};

export default ProfilePage;
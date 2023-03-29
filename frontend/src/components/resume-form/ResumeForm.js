import React, {useState} from 'react';
import Input from "../inputs/Input";
import axios from "axios";
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";

const ResumeForm = () => {
    const {accessToken} = useGetInfoFromToken();
    const [userInfo, setUserInfo] = useState({});

    const handleSubmit = () => {
        axios.post(`/api/resumes/`, {userInfo}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    }

    const handleChange = event => {
        setUserInfo({
            ...userInfo,
            [event.currentTarget.name]: event.currentTarget.value
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <h4>Contact info</h4>
                <label htmlFor='name'>Name</label>
                <Input type='text' name='name' onChange={handleChange}/>
                <label htmlFor='surname'>Surname</label>
                <Input type='text' name='surname' onChange={handleChange}/>
                <label htmlFor='city'>City</label>
                <select name='city' onChange={handleChange}>
                    <option value='Minsk'>Minsk</option>
                </select>
            </div>
            <div>
                <h4>Main info</h4>
                <label htmlFor='birthdate'>Birthdate</label>
                <Input type='text' name='birthdate' onChange={handleChange}/>
                <label htmlFor='sex'>Sex</label>
                <input name='sex' type='radio' value='female' onChange={handleChange}/>
                <input name='sex' type='radio' value='male' onChange={handleChange}/>
                <label htmlFor='experience'>Experience</label>
                <input name='experience' type='radio' value={true} onChange={handleChange}/>
                <input name='experience' type='radio' value={false} onChange={handleChange}/>
            </div>
            <input type='submit'/>
        </form>
    );
};

export default ResumeForm;
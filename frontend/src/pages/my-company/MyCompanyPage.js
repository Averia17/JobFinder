import React, {useEffect, useState} from 'react';
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import axios from "axios";
import {Input} from "@mui/material";

const MyCompanyPage = () => {
    const { company, accessToken } = useGetInfoFromToken();
    const [companyInfo, setCompanyInfo] = useState({});
    const [managerInfo, setManagerInfo] = useState({ name: undefined, email: undefined });

    useEffect(() => {
        axios.get(`/api/companies/${company}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        }).then(({ data }) => setCompanyInfo(data))
    }, [company])

    const { id, title } = companyInfo;

    const handleChangeManagerInfo = event => {
        setManagerInfo({
            ...managerInfo,
            [event.target.name]: event.target.value
        })
    }

    const handleSubmitAddManager = event => {
        event.preventDefault();
        axios.post('/api/managers/', managerInfo, {
            headers: { Authorization: `Bearer ${accessToken}`}
        }).then()
    }

    return (
        <div key={id}>
            <h1>{title}</h1>
            <form onSubmit={handleSubmitAddManager}>
                <label htmlFor="name">Name </label>
                <Input type='text' name='name' onChange={handleChangeManagerInfo}/>
                <label htmlFor="email">Email </label>
                <Input type='email' name='email' onChange={handleChangeManagerInfo}/>
                <Input type='submit'></Input>
            </form>
        </div>
    );
};

export default MyCompanyPage;
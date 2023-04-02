import React, {useEffect, useState} from 'react';
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import axios from "axios";
import {Input} from "@mui/material";
import Vacancy from "../../components/vacancy/Vacancy";

const MyCompanyPage = () => {
    const { company, accessToken } = useGetInfoFromToken();
    const [companyInfo, setCompanyInfo] = useState({});
    const [managerInfo, setManagerInfo] = useState({ name: undefined, email: undefined });
    const [resultMessage, setResultMessage] = useState(undefined);

    useEffect(() => {
        axios.get(`/api/companies/${company}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        }).then(({ data }) => setCompanyInfo(data))
    }, [company])

    const { id, title, vacancies } = companyInfo;

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
        }).then(({ data }) => setResultMessage(data))
            .catch(({ response }) => setResultMessage(response.data.user.email))
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
            <p>{resultMessage}</p>
            <div>
                {
                    vacancies?.map(vacancy => (
                        <Vacancy key={vacancy.id} {...vacancy}/>
                    ))
                }
            </div>
        </div>
    );
};

export default MyCompanyPage;
import React, {useEffect, useState} from 'react';
import Tab from "../Tab";
import {Input} from "@mui/material";
import axios from "axios";
import {useGetInfoFromToken} from "../../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import ManagerBlock from "./ManagerBlock";
import './style.css'
import ErrorAlert from "../../alerts/ErrorAlert";


const ManagersTab = () => {
    const { accessToken } = useGetInfoFromToken();
    const [managers, setManagers] = useState([]);
    const [managerInfo, setManagerInfo] = useState({ name: undefined, email: undefined });
    const [resultMessage, setResultMessage] = useState(undefined);
    const [error, setError] = useState(undefined);


    useEffect(() => {
        axios.get('/api/managers', {
            headers: { Authorization: `Bearer ${accessToken}`}
        }).then(({ data }) => setManagers(data))
            .catch(({ response }) => {
                let error = response.data;
                if ("detail" in response.data)
                    error = response.data.detail
                setError(error)
            })
    }, [])

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
            .catch(({ response }) => {
                let error = response.data;
                if ("user" in response.data)
                    error = "User with this email have already received email"
                if ("detail" in response.data)
                    error = response.data.detail
                setError(error)
            })
    }

    return (
        <Tab>
            <form onSubmit={handleSubmitAddManager}>
                <label htmlFor="name">Name </label>
                <Input type='text' name='name' onChange={handleChangeManagerInfo}/>
                <label htmlFor="email">Email </label>
                <Input type='email' name='email' onChange={handleChangeManagerInfo}/>
                <Input type='submit'></Input>
            </form>
            <div>
                {
                    managers?.map(({ user }) => (
                        <ManagerBlock {...user}/>
                    ))
                }
            </div>
            {error && <ErrorAlert error={error} setError={setError}/>}
            <p>{resultMessage}</p>
        </Tab>
    );
};

export default ManagersTab;
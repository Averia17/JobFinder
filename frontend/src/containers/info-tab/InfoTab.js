import React, {useEffect, useState} from 'react';
import Tab from "../../components/tabs/Tab";
import Input from "../../components/inputs/Input";
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import axios from "axios";
import './style.css'
import {TextField} from "@mui/material";

const InfoTab = ({ setError, company }) => {
    const { address, description, director, phone, email, employees_number, site } = company;
    const tokenInfo = useGetInfoFromToken();
    const [updatedCompanyInfo, setUpdatedCompanyInfo] = useState({});
    const [isUpdated, setUpdated] = useState(false);


    const handleChangeCompanyInfo = event => {
        setUpdatedCompanyInfo({
            ...updatedCompanyInfo,
            [event.target.name]: event.target.value
        })
    }

    const handleSubmitUpdate = event => {
        event.preventDefault();
        axios.patch(`/api/companies/${company.id}/`, updatedCompanyInfo, {
            headers: { Authorization: `Bearer ${tokenInfo.accessToken}` }
        }).then(() => setUpdated(false))
            .catch(({ response }) => {
                let error = response.data;
                if ("phone" in response.data)
                    error = response.data.phone
                if ("detail" in response.data)
                    error = response.data.detail
                setError(error)
            })
    }

    useEffect(() => {
        setUpdated(Object.keys(updatedCompanyInfo).length > 0)
    }, [updatedCompanyInfo])

    return (
        <Tab>
            <form className='infoTab__container' onSubmit={handleSubmitUpdate}>
                <div>
                    <label htmlFor='address'>Address</label>
                    <Input type='text' name='address' defaultValue={address} onChange={handleChangeCompanyInfo} disabled={!tokenInfo?.is_director}/>
                </div>
                <div>
                    <label htmlFor='director'>Director</label>
                    <Input type='text' name='director' defaultValue={director} onChange={handleChangeCompanyInfo} disabled/>
                </div>
                <div>
                    <label htmlFor='description'>Description</label>
                    <TextField multiline rows={2} maxRows={4} type='text' name='description' defaultValue={description} onChange={handleChangeCompanyInfo} disabled={!tokenInfo?.is_director}/>
                </div>
                <div>
                    <label htmlFor='phone'>Phone</label>
                    <Input type='text' name='phone' defaultValue={phone} onChange={handleChangeCompanyInfo} disabled={!tokenInfo?.is_director}/>
                </div>
                <div>
                    <label htmlFor='site'>Site</label>
                    <Input type='url' name='site' defaultValue={site} onChange={handleChangeCompanyInfo} disabled={!tokenInfo?.is_director}/>
                </div>
                <div>
                    <label htmlFor='employees_number'>Employees number</label>
                    <Input type='number' name='employees_number' min='0' defaultValue={employees_number} onChange={handleChangeCompanyInfo} disabled={!tokenInfo?.is_director}/>
                </div>
                <div>
                    <label htmlFor='email'>Email</label>
                    <Input type='email' name='email' defaultValue={email} onChange={handleChangeCompanyInfo} disabled={!tokenInfo?.is_director}/>
                </div>
                <div>{isUpdated && <input className="submit__button" type='submit'/>}</div>
            </form>
        </Tab>
    );
};

export default InfoTab;
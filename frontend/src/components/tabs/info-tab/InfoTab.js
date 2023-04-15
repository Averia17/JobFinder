import React, {useEffect, useState} from 'react';
import Tab from "../Tab";
import Input from "../../inputs/Input";
import {useGetInfoFromToken} from "../../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import axios from "axios";
import './style.css'

const InfoTab = ({ company }) => {
    const { address, description, director } = company;
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
    }

    useEffect(() => {
        setUpdated(Object.keys(updatedCompanyInfo).length > 0)
    }, [updatedCompanyInfo])

    return (
        <Tab>
            <form className='infoTab__container' onSubmit={handleSubmitUpdate}>
                <div>
                    <label htmlFor='address'>Address</label>
                    <Input type='text' name='address' value={address} onChange={handleChangeCompanyInfo} required disabled={!tokenInfo?.is_director}/>
                </div>
                <div>
                    <label htmlFor='director'>Director</label>
                    <Input type='text' name='director' value={director} onChange={handleChangeCompanyInfo} disabled/>
                </div>
                <div>
                    <label htmlFor='description'>Description</label>
                    <Input type='text' name='description' value={description} onChange={handleChangeCompanyInfo} required disabled={!tokenInfo?.is_director}/>
                </div>
                <div>{isUpdated && <input type='submit'/>}</div>
            </form>
        </Tab>
    );
};

export default InfoTab;
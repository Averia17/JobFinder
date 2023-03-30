import React, {useState} from 'react';
import Input from "../inputs/Input";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const CompanyForm = ({companyData, setCompanyData}) => {
    const handleChangeData = event => {
        let {value, name} = event.currentTarget;
        setCompanyData({
            ...companyData,
            [name]: value
        })
    }

    return (
        <>
            <Input type='text' name='title' required placeholder='Company title' onChange={handleChangeData}/>
        </>
    );
};

export default CompanyForm;
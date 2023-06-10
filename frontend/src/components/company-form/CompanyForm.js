import React, {useState} from 'react';
import Input from "../inputs/Input";


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
            <Input type='text' name='title' required placeholder='Название компании' onChange={handleChangeData}/>
        </>
    );
};

export default CompanyForm;
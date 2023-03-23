import React from 'react';
import Input from "../inputs/Input";
import {Link} from "react-router-dom";
import CompanyForm from "../company-form/CompanyForm";

const RegisterForm = ({onSubmit, userData, setUserData, companyData, setCompanyData}) => {
    const handleChangeData = event => {
        let {value, name, className} = event.currentTarget;
        if (className === 'checkbox-field')
            event.currentTarget.checked ? value = true : value = false
        setUserData({
            ...userData,
            [name]: value
        })
    }

    return (
        <form method='post' onSubmit={onSubmit}>
            <Input type='email' name='email' placeholder='Email' required handleChange={handleChangeData}/>
            <Input type='password' name='password' placeholder='Password' required handleChange={handleChangeData}/>
            <Input type='password' name='confirmPassword' placeholder='Re-enter password' required handleChange={handleChangeData}/>
            <input type='checkbox' name='isEmployee' className='checkbox-field' onChange={handleChangeData}/>
            {
                userData.isEmployee ?
                    <CompanyForm companyData={companyData} setCompanyData={setCompanyData}/>
                    : null
            }
            <input type='submit'/>
        </form>
    );
};

export default RegisterForm;
import React from 'react';
import Input from "../inputs/Input";
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
            <Input type='email' name='email' placeholder='Email' required onChange={handleChangeData}/>
            <Input type='password' name='password' placeholder='Пароль' required onChange={handleChangeData}/>
            <Input type='password' name='confirmPassword' placeholder='Повторите пароль' required onChange={handleChangeData}/>
            <div className='director__checkbox__container'>
                Я ищу сотрудника
                <input type='checkbox' name='isEmployee' className='checkbox-field' onChange={handleChangeData}/>
            </div>
            {
                userData.isEmployee ?
                    <CompanyForm companyData={companyData} setCompanyData={setCompanyData}/>
                    : null
            }
            <input type='submit' value='Зарегистрироваться' className='submit-button'/>
        </form>
    );
};

export default RegisterForm;
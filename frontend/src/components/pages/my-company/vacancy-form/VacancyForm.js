import React, {useEffect, useState} from 'react';
import Input from "../../../inputs/Input";
import axios from "axios";
import {useGetInfoFromToken} from "../../../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import {employmentTypes, experienceOptions} from "./utils";
import {useSearchParams} from "react-router-dom";
import {TextField} from "@mui/material";
import ErrorAlert from "../../../alerts/ErrorAlert";
import {useNavigate} from "react-router";
import './style.css'
import SimpleMDE from "react-simplemde-editor";

const VacancyForm = () => {
    const {accessToken} = useGetInfoFromToken();
    const navigate = useNavigate();
    const [vacancy, setVacancy] = useState({});
    const [defaultVacancy, setDefaultVacancy] = useState({});
    const [managers, setManagers] = useState([]);
    const [searchParams] = useSearchParams();
    const vacancyId = searchParams.get('vacancy');
    const [error, setError] = useState(undefined);

    useEffect(() => {
        if (vacancyId) {
            axios.get(`/api/vacancies/${vacancyId}`)
                .then(({data}) => {
                    setDefaultVacancy(data);
                    setVacancy({ ...vacancy, description: data?.description })
                })
        }
    }, [vacancyId])

    useEffect(() => {
        axios.get('/api/managers', {
            headers: {Authorization: `Bearer ${accessToken}`}
        }).then(({data}) => setManagers(data));
    }, [])

    const handleChange = event => {
        const value = event.currentTarget.className === 'booleanField' ? event.currentTarget.checked : event.currentTarget.value
        setVacancy({
            ...vacancy,
            [event.currentTarget.name]: value,
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (vacancyId) {
            axios.patch(`/api/vacancies/${vacancyId}/`, {...vacancy}, {
                headers: {Authorization: `Bearer ${accessToken}`}
            }).then(() => {
                navigate(`/vacancies/${vacancyId}`)
            }).catch(()=>{setError("Error updating vacancy")})
        } else {
            axios.post(`/api/vacancies/`, {...vacancy}, {
                headers: {Authorization: `Bearer ${accessToken}`}
            }).then(({data}) => {
                navigate(`/vacancies/${data.id}`)
            }).catch(()=>{setError("Error creating vacancy")})
        }
    }
    const handleChangeDescription = text => {
        setVacancy({
            ...vacancy,
            description: text,
        })
    };
    return (
        <div className='vacancy__form'>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='title'>Название вакансии</label>
                    <Input name='title' defaultValue={defaultVacancy?.title} type='text' onChange={handleChange}
                           required/>
                </div>
                <div>
                    <label htmlFor='city'>Город</label>
                    <Input name='city' defaultValue={defaultVacancy?.city} type='text' onChange={handleChange}
                           required/>
                </div>
                <div>
                    <label htmlFor='min_salary'>Минимальная зарплата</label>
                    <Input name='min_salary' defaultValue={defaultVacancy?.min_salary} type='number'
                           onChange={handleChange}/>
                </div>
                <div>
                    <label htmlFor='max_salary'>Максимальная зарплата</label>
                    <Input name='max_salary' defaultValue={defaultVacancy?.max_salary} type='number'
                           onChange={handleChange}/>
                </div>
                {!vacancyId && <div>
                    <p>Менеджер</p>
                    <select name='manager' onChange={handleChange} required>
                        <option value=""></option>
                        {managers.map(({user}) => (
                            <option key={user.id} value={user.id}>{user.email}</option>
                        ))}
                    </select>
                </div>}
                <div>
                    <p>Активная ли вакансия?</p>
                    <input name='is_active' defaultChecked={defaultVacancy?.is_active} className='booleanField'
                           type='checkbox' onChange={handleChange}/>
                </div>
                <div>
                    <p>Обязательный опыт</p>
                    <select name='experience_option' onChange={handleChange}>
                        {experienceOptions.map((experience, index) => (
                            <option key={index}
                                    selected={experience[1] === defaultVacancy?.experience_option}
                                    value={experience[0]}>{experience[1]}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <p>Тип занятости</p>
                    <select name='employment_type' onChange={handleChange}>
                        {employmentTypes.map((type, index) => (
                            <option selected={type[1] === defaultVacancy?.employment_type} key={index}
                                    value={type[0]}>{type[1]}</option>
                        ))}
                    </select>
                </div>
                <div className='vacancy__description'>
                    <label htmlFor='description'>Описание</label>
                    <div >
                        <SimpleMDE
                            style={{"padding": "5px 10px", "font-size": "17px"}}
                            value={vacancy?.description}
                            onChange={(text) => handleChangeDescription(text)}/>
                    </div>
                    {/*<TextField multiline minRows={10} fullWidth name='description' value={vacancy?.description} onChange={handleChange}/>*/}
                </div>
                <input className='vacancy__submit__button' type='submit'/>
            </form>
            {error && <ErrorAlert error={error} setError={setError}/>}
        </div>
    );
};

export default VacancyForm;
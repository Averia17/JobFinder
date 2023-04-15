import React, {useEffect, useState} from 'react';
import Input from "../../../inputs/Input";
import axios from "axios";
import {useGetInfoFromToken} from "../../../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import {employmentTypes, experienceOptions} from "./utils";
import {useSearchParams} from "react-router-dom";

const VacancyForm = () => {
    const { accessToken } = useGetInfoFromToken();
    const [vacancy, setVacancy] = useState({});
    const [managers, setManagers] = useState([]);
    const [searchParams] = useSearchParams();
    const vacancyId = searchParams.get('vacancy');

    useEffect(() => {
        if (vacancyId) {
            axios.get(`/api/vacancies/${vacancyId}`)
                .then(({ data }) => setVacancy(data))
        }
    }, [vacancyId])

    useEffect(() => {
        axios.get('/api/managers', {
            headers: { Authorization: `Bearer ${accessToken}`}
        }).then(({ data }) => setManagers(data));
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
            axios.patch(`/api/vacancies/`, {...vacancy}, {
                headers: { Authorization: `Bearer ${accessToken}`}
            }).then()
        } else {
            axios.post(`/api/vacancies/`, {...vacancy}, {
                headers: { Authorization: `Bearer ${accessToken}`}
            }).then()
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{display:"flex", flexDirection: "column"}}>
            <div>
                <label htmlFor='title'>Vacancy title</label>
                <Input name='title' defaultValue={vacancy?.title} type='text' onChange={handleChange} required/>
            </div>
            <div>
                <label htmlFor='min_salary'>Min salary</label>
                <Input name='min_salary' defaultValue={vacancy?.min_salary} type='number' onChange={handleChange}/>
            </div>
            <div>
                <label htmlFor='max_salary'>Max salary</label>
                <Input name='max_salary' defaultValue={vacancy?.max_salary} type='number' onChange={handleChange}/>
            </div>
            {!vacancyId && <div>
                <p>Managers</p>
                <select name='manager' onChange={handleChange} required>
                    {managers.map(({ user }) => (
                        <option key={user.id} value={user.id}>{user.email}</option>
                    ))}
                </select>
            </div>}
            <div>
                <p>Is vacancy active?</p>
                <input name='is_active' defaultValue={vacancy?.is_active} className='booleanField' type='checkbox' onChange={handleChange} required/>
            </div>
            <div>
                <p>Required experience</p>
                <select name='experience_option' onChange={handleChange} required>
                    {experienceOptions.map((experience) => (
                        <option selected={experience === vacancy?.experience_option} key={experience} value={experience}>{experience}</option>
                    ))}
                </select>
            </div>
            <div>
                <p>Employment type</p>
                <select name='employment_type' onChange={handleChange} required>
                    {employmentTypes.map((type) => (
                        <option selected={type === vacancy?.employment_type?.toUpperCase()} key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>
            <input type='submit'/>
        </form>
    );
};

export default VacancyForm;
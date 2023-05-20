import React, {useEffect, useState} from 'react';
import Input from "../../../inputs/Input";
import axios from "axios";
import {useGetInfoFromToken} from "../../../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import {employmentTypes, experienceOptions} from "./utils";
import {useSearchParams} from "react-router-dom";
import {TextField} from "@mui/material";
import ErrorAlert from "../../../alerts/ErrorAlert";

const VacancyForm = () => {
    const {accessToken} = useGetInfoFromToken();
    const [vacancy, setVacancy] = useState({});
    const [defaultVacancy, setDefaultVacancy] = useState({});
    const [managers, setManagers] = useState([]);
    const [searchParams] = useSearchParams();
    const vacancyId = searchParams.get('vacancy');
    const [error, setError] = useState(undefined);

    useEffect(() => {
        if (vacancyId) {
            axios.get(`/api/vacancies/${vacancyId}`)
                .then(({data}) => setDefaultVacancy(data))
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
            }).then().catch(()=>{setError("Error updating vacancy")})
        } else {
            axios.post(`/api/vacancies/`, {...vacancy}, {
                headers: {Authorization: `Bearer ${accessToken}`}
            }).then().catch(()=>{setError("Error creating vacancy")})
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column"}}>
                <div>
                    <label htmlFor='title'>Vacancy title</label>
                    <Input name='title' defaultValue={defaultVacancy?.title} type='text' onChange={handleChange}
                           required/>
                </div>
                <div>
                    <label htmlFor='city'>City</label>
                    <Input name='city' defaultValue={defaultVacancy?.city} type='text' onChange={handleChange}
                           required/>
                </div>
                <div>
                    <label htmlFor='min_salary'>Min salary</label>
                    <Input name='min_salary' defaultValue={defaultVacancy?.min_salary} type='number'
                           onChange={handleChange}/>
                </div>
                <div>
                    <label htmlFor='max_salary'>Max salary</label>
                    <Input name='max_salary' defaultValue={defaultVacancy?.max_salary} type='number'
                           onChange={handleChange}/>
                </div>
                <div>
                    <label htmlFor='description'>Description</label>
                    <TextField name='description' defaultValue={defaultVacancy?.description} onChange={handleChange}/>
                </div>
                {!vacancyId && <div>
                    <p>Managers</p>
                    <select name='manager' onChange={handleChange} required>
                        <option value=""></option>
                        {managers.map(({user}) => (
                            <option key={user.id} value={user.id}>{user.email}</option>
                        ))}
                    </select>
                </div>}
                <div>
                    <p>Is vacancy active?</p>
                    <input name='is_active' defaultChecked={defaultVacancy?.is_active} className='booleanField'
                           type='checkbox' onChange={handleChange}/>
                </div>
                <div>
                    <p>Required experience</p>
                    <select name='experience_option' onChange={handleChange}>
                        {experienceOptions.map((experience) => (
                            <option selected={experience === defaultVacancy?.experience_option} key={experience}
                                    value={experience}>{experience}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <p>Employment type</p>
                    <select name='employment_type' onChange={handleChange}>
                        {employmentTypes.map((type, index) => (
                            <option selected={type[1] === defaultVacancy?.employment_type} key={index}
                                    value={type[0]}>{type[1]}</option>
                        ))}
                    </select>
                </div>
                <input type='submit'/>
            </form>
            {error && <ErrorAlert error={error} setError={setError}/>}

        </div>
    );
};

export default VacancyForm;
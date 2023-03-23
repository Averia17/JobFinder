import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import axios from "axios";

const VacancyPage = () => {
    const {id} = useParams();
    const [vacancyInfo, setVacancyInfo] = useState({});

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        axios.get(`/api/vacancies/${id}`, accessToken ? {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        } : null)
            .then(({data}) => setVacancyInfo(data))
    }, []);

    const {title, company} = vacancyInfo;

    const respondToVacancy = () => {
        const accessToken = localStorage.getItem('access_token');
        axios.post('/api/responses/', {vacancy: id}, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    return (
        <div>
            <h1>{title}</h1>
            <h2>{company}</h2>
            <button onClick={respondToVacancy} disabled={vacancyInfo?.is_responded}>Respond</button>
        </div>
    );
};

export default VacancyPage;
import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import axios from "axios";
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";

const VacancyPage = () => {
    const {id} = useParams();
    const tokenInfo = useGetInfoFromToken();
    const [vacancyInfo, setVacancyInfo] = useState({});

    useEffect(() => {
        axios.get(`/api/vacancies/${id}`, tokenInfo?.accessToken && {
            headers: {
                'Authorization': `Bearer ${tokenInfo?.accessToken}`
            }
        })
            .then(({data}) => setVacancyInfo(data))
    }, []);

    const {title, company} = vacancyInfo;

    const respondToVacancy = () => {
        axios.post('/api/responses/', {vacancy: id}, {
            headers: {
                'Authorization': `Bearer ${tokenInfo?.accessToken}`
            }
        })
    }

    return (
        <div>
            <h1>{title}</h1>
            <h2>{company?.title}</h2>
            { !tokenInfo?.company && <button onClick={respondToVacancy} disabled={vacancyInfo?.is_responded}>Respond</button> }

        </div>
    );
};

export default VacancyPage;
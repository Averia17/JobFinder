import React, {useEffect, useState} from 'react';
import axios from "axios";
import Vacancy from "../../components/vacancy/Vacancy";
import './styles.css'

const VacanciesPage = () => {
    const [vacancies, setVacancies] = useState([]);

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        axios.get('/api/vacancies', accessToken ? {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        } : null)
            .then(({data}) => setVacancies(data));
    }, [])

    return (
        <div className='vacancies-page-container'>
            <div className='filters'>filters</div>
            <div className='vacancies-container'>
                {
                    vacancies.map(vacancy => (
                        <Vacancy {...vacancy}/>
                    ))
                }
            </div>
        </div>
    );
};

export default VacanciesPage;
import React, {useEffect, useState} from 'react';
import axios from "axios";
import Vacancy from "../../components/vacancy/Vacancy";
import './style.css'
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";

const FavoritesPage = () => {
    const tokenInfo = useGetInfoFromToken();
    const [vacancies, setVacancies] = useState([]);

    useEffect(() => {
        axios.get('/api/vacancies/favorites', {
            headers: {
                'Authorization': `Bearer ${tokenInfo?.accessToken}`
            }
        })
            .then(({data}) => setVacancies(data));
    }, [])

    return (
        <div className='vacancies-page-container'>
            <div className='filters'>filters</div>
            <div className='vacancies-container'>
                {
                    vacancies.map(vacancy => (
                        <Vacancy key={vacancy.id} {...vacancy}/>
                    ))
                }
            </div>
        </div>
    );
};

export default FavoritesPage;
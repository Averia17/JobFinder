import React, {useEffect, useState} from 'react';
import axios from "axios";
import Vacancy from "../../components/vacancy/Vacancy";
import './style.css'
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import Filters from "../../components/pages/vacancies/Filters";

const VacanciesPage = () => {
    const tokenInfo = useGetInfoFromToken();
    const [vacancies, setVacancies] = useState([]);
    const [filters, setFilters] = useState({});
    const [search, setSearch] = useState(undefined);


    const formatQueryParams = () => {
        let resultQueryString = '';
        Object.entries(filters).forEach((entry, index, array) => {
            resultQueryString += `&${entry[0]}=${entry[1]}`
        })
        if (search) resultQueryString += `&search=${search}`
        return resultQueryString;
    }

    useEffect(() => {
        axios.get(`/api/vacancies?is_active=true${formatQueryParams()}`, tokenInfo?.accessToken && {
            headers: {
                'Authorization': `Bearer ${tokenInfo?.accessToken}`
            }
        })
            .then(({data}) => setVacancies(data));
    }, [])

    const handleSearch = (e) => {
        e.preventDefault();
        axios.get(`/api/vacancies?is_active=true${formatQueryParams()}`, tokenInfo?.accessToken && {
            headers: {
                'Authorization': `Bearer ${tokenInfo?.accessToken}`
            }
        })
            .then(({data}) => setVacancies(data));
    }

    return (
        <div className='vacancies-page-container'>
            <div className='filters'>
                <Filters filters={filters} setFilters={setFilters} setSearch={setSearch} handleSearch={handleSearch}/>
            </div>
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

export default VacanciesPage;
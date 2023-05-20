import React, {useEffect, useState} from 'react';
import axios from "axios";
import Vacancy from "../../components/vacancy/Vacancy";
import './style.css'
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import Filters from "../../components/pages/vacancies/Filters";
import {useSearchParams} from "react-router-dom";

const VacanciesPage = () => {
    const tokenInfo = useGetInfoFromToken();
    const [vacancies, setVacancies] = useState([]);
    const [filters, setFilters] = useState({});
    const [search, setSearch] = useState(undefined);
    const [loading, setLoading] = useState(true);


    const formatQueryParams = () => {
        const searchParams = new URLSearchParams();

        Object.entries(filters).forEach((entry, index, array) => {
            searchParams.append(entry[0], entry[1]);
        })
        if (search) searchParams.append("search", search);
        return searchParams.toString();
    }

    useEffect(() => {
        setLoading(true)
        axios.get(`/api/vacancies?is_active=true`, tokenInfo?.accessToken && {
            headers: {
                'Authorization': `Bearer ${tokenInfo?.accessToken}`
            }
        })
            .then(({data}) => {
                setVacancies(data)
            });
        setLoading(false)
    }, [])

    const handleSearch = (e) => {
        setLoading(true)
        e.preventDefault();
        axios.get(`/api/vacancies?is_active=true&${formatQueryParams()}`, tokenInfo?.accessToken && {
            headers: {
                'Authorization': `Bearer ${tokenInfo?.accessToken}`
            }
        })
            .then(({data}) => {
                setVacancies(data)
            });
        setLoading(false)
    }

    return (
        <div className='vacancies-page-container'>
            <div className='filters'>
                <Filters filters={filters} setFilters={setFilters} setSearch={setSearch} handleSearch={handleSearch}/>
            </div>
            <div className='vacancies-container'>
                { !loading ?
                    vacancies.length > 0 ?
                    vacancies.map(vacancy => (
                        <Vacancy key={vacancy.id} {...vacancy}/>
                    ))
                    : <div> There are no vacancies</div>
                    : <div> Loading...</div>
                }
            </div>
        </div>
    );
};

export default VacanciesPage;
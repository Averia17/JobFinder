import React, {useEffect, useState} from 'react';
import axios from "axios";
import Vacancy from "../../containers/vacancy/Vacancy";
import './style.css'
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import VacanciesFilters from "../../containers/filters/VacanciesFilters";
import {useLocation} from "react-router-dom";
import {CircularProgress} from "@mui/material";

const VacanciesPage = () => {
    const { state } = useLocation();
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
            }).then(() => setLoading(false));
    }, [])

    useEffect(() => {
        if (state?.company) {
            setLoading(true);
            axios.get(`/api/vacancies?company=${state?.company}&is_active=true`, tokenInfo?.accessToken && {
                headers: {
                    'Authorization': `Bearer ${tokenInfo?.accessToken}`
                }
            })
                .then(({data}) => {
                    setVacancies(data)
                }).then(() => setLoading(false));
        }
    }, [state])

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
            }).then(() => setTimeout(() => setLoading(false)));
    }

    return (
        <div className='vacancies-page-container'>
            <div className='filters'>
                <VacanciesFilters filters={filters} setFilters={setFilters} setSearch={setSearch} handleSearch={handleSearch}/>
            </div>
            <div className='vacancies-container'>
                { loading ? <div className="loading-spinner"><CircularProgress color="inherit" /></div> :
                    vacancies.length > 0 ?
                        vacancies.map(vacancy => (
                            <Vacancy key={vacancy.id} {...vacancy}/>
                        ))
                        : <div>Найдено 0 вакансий</div>
                }
            </div>
        </div>
    );
};

export default VacanciesPage;
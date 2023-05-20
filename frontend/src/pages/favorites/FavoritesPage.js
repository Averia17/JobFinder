import React, {useEffect, useState} from 'react';
import axios from "axios";
import Vacancy from "../../components/vacancy/Vacancy";
import './style.css'
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import Resume from "../../components/resume/Resume";

const FavoritesPage = () => {
    const tokenInfo = useGetInfoFromToken();
    const [vacancies, setVacancies] = useState([]);
    const [loading, setLoading] = useState(true);
    let url = "vacancies"
    if(tokenInfo?.company)
        url = "resumes"
    useEffect(() => {

        axios.get(`/api/${url}/favorites`, {
            headers: {
                'Authorization': `Bearer ${tokenInfo?.accessToken}`
            }
        })
            .then(({data}) => {
                setVacancies(data)
            });
        setLoading(false)
    }, [])

    return (
        <div className='vacancies-page-container'>
            <div className='vacancies-container'>
                { !loading ?
                    vacancies.length > 0 ?
                    vacancies.map(vacancy => (<>{
                        tokenInfo?.company ?
                        <Resume key={vacancy.id} {...vacancy}/>
                        :<Vacancy key={vacancy.id} {...vacancy}/>
                    }</>))
                    : <div> You don't have favorites {url}</div>
                    : <div> Loading...</div>
                }
            </div>
        </div>
    );
};

export default FavoritesPage;
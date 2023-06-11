import React, {useEffect, useState} from 'react';
import axios from "axios";
import Vacancy from "../../containers/vacancy/Vacancy";
import './style.css'
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import Resume from "../../containers/resume/Resume";
import ResponsesTab from "../../components/pages/my-company/vacancy/ResponsesTab";
import ViewsTab from "../../components/pages/my-company/vacancy/ViewsTab";
import FavoritesResumesTab from "../../containers/favorites/favorites-resumes-tab/FavoritesResumesTab";
import FavoritesVacanciesTab from "../../containers/favorites/favorites-vacancies-tab/FavoritesVacanciesTab";
import Navbar from "../../containers/favorites/navbar/Navbar";

const FavoritesPage = () => {
    const tokenInfo = useGetInfoFromToken();
    const [vacancies, setVacancies] = useState([]);
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);

    const tabs = {
        resumes: <FavoritesResumesTab resumes={resumes}/>,
        vacancies: <FavoritesVacanciesTab vacancies={vacancies}/>,
    }

    const [currentTab, setCurrentTab] = useState('resumes');

    const renderTab = () => {
        let tab = Object.keys(tabs).find(key => key === currentTab);
        return tabs[tab];
    }

    useEffect(() => {
        axios.get(`/api/vacancies/favorites`, {
            headers: {
                'Authorization': `Bearer ${tokenInfo?.accessToken}`
            }
        })
            .then(({data}) => {
                setVacancies(data)
            });
        setLoading(false)
    }, [])

    useEffect(() => {
        if (tokenInfo?.company) {
            axios.get(`/api/resumes/favorites`, {
                headers: {
                    'Authorization': `Bearer ${tokenInfo?.accessToken}`
                }
            })
                .then(({data}) => {
                    setResumes(data)
                });
            setLoading(false)
        }
    }, [])

    return (
        <div className='vacancies-page-container'>
            <div className='vacancies-container'>
                { !loading ?
                        tokenInfo?.company ?
                            <>
                                <Navbar setCurrentTab={setCurrentTab}/>
                                {renderTab()}
                            </>
                            :
                            <FavoritesVacanciesTab vacancies={vacancies}/>
                    : <div> Загрузка...</div>
                }
            </div>
        </div>
    );
};

export default FavoritesPage;
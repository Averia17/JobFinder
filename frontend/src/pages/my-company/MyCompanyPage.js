import React, {useEffect, useState} from 'react';
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import axios from "axios";
import VacanciesTab from "../../components/tabs/vacancies-tab/VacanciesTab";
import ManagersTab from "../../components/tabs/managers-tab/ManagersTab";
import Navbar from "../../components/pages/my-company/navbar/Navbar";
import './style.css'

const MyCompanyPage = () => {
    const { company, accessToken } = useGetInfoFromToken();
    const [companyInfo, setCompanyInfo] = useState({});

    useEffect(() => {
        axios.get(`/api/companies/${company}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        }).then(({ data }) => setCompanyInfo(data))
    }, [company])

    const { id, title, vacancies } = companyInfo;

    const tabs = {
        vacancies: <VacanciesTab vacancies={vacancies}/>,
        managers: <ManagersTab/>,
    }

    const [currentTab, setCurrentTab] = useState('vacancies');

    const renderTab = () => {
        let tab = Object.keys(tabs).find(key => key === currentTab);
        return tabs[tab]
    }

    return (
        <div key={id} className='myCompany__container'>
            <h1>{title}</h1>
            <Navbar setCurrentTab={setCurrentTab}/>
            { renderTab() }
        </div>
    );
};

export default MyCompanyPage;
import React, {useEffect, useState} from 'react';
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import axios from "axios";
import VacanciesTab from "../../components/tabs/vacancies-tab/VacanciesTab";
import ManagersTab from "../../components/tabs/managers-tab/ManagersTab";
import Navbar from "../../components/pages/my-company/navbar/Navbar";
import './style.css'
import ConfirmModal from "../../modal/ConfirmModal";
import {useSearchParams} from "react-router-dom";

const MyCompanyPage = () => {
    const tokenInfo = useGetInfoFromToken();
    const [companyInfo, setCompanyInfo] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();
    const [isModalVisible, setModalVisible] = useState(!!searchParams.get('manager'));

    useEffect(() => {
        axios.get(`/api/companies/${tokenInfo.company}`, {
            headers: { Authorization: `Bearer ${tokenInfo.accessToken}` }
        }).then(({ data }) => setCompanyInfo(data))
    }, [tokenInfo.company])

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

    const handleClickHideModal = () => {
        searchParams.delete('manager');
        setSearchParams(searchParams)
        setModalVisible(false);
    }

    useEffect(() => {
        setModalVisible(!!searchParams.get('manager'))
    }, [searchParams])

    const handleConfirmDeleteManager = () => {
        let managerId = searchParams.get('manager');
        axios.delete(`/api/managers/${managerId}/`, {
            headers: { Authorization: `Bearer ${tokenInfo.accessToken}`}
        }).then(() => {
            searchParams.delete('manager');
            setModalVisible(false);
        })
    }

    return (
        <div key={id} className='myCompany__container'>
            <h1>{title}</h1>
            <Navbar setCurrentTab={setCurrentTab}/>
            { tokenInfo?.is_director ? renderTab() : <VacanciesTab vacancies={vacancies}/> }
            <ConfirmModal isActive={isModalVisible} handleClickHideModal={handleClickHideModal}
                          handleConfirm={handleConfirmDeleteManager} title='Are you sure you want to delete this manager?'/>
        </div>
    );
};

export default MyCompanyPage;
import React, {useEffect, useState} from 'react';
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import axios from "axios";
import VacanciesTab from "../../components/tabs/vacancies-tab/VacanciesTab";
import ManagersTab from "../../components/tabs/managers-tab/ManagersTab";
import Navbar from "../../components/pages/my-company/navbar/Navbar";
import './style.css'
import ConfirmModal from "../../components/modal/ConfirmModal";
import {useSearchParams} from "react-router-dom";
import InfoTab from "../../components/tabs/info-tab/InfoTab";
import VacancyModal from "../../components/pages/my-company/vacancy-form/VacancyModal";

const MyCompanyPage = () => {
    const tokenInfo = useGetInfoFromToken();
    const [companyInfo, setCompanyInfo] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(!!searchParams.get('manager'));
    const [isVacancyModalVisible, setVacancyModalVisible] = useState(false);

    useEffect(() => {
        axios.get(`/api/companies/${tokenInfo.company}`, {
            headers: { Authorization: `Bearer ${tokenInfo.accessToken}` }
        }).then(({ data }) => setCompanyInfo(data))
    }, [tokenInfo.company])

    const { id, title, vacancies } = companyInfo;

    const tabs = {
        vacancies: <VacanciesTab vacancies={vacancies} setModalVisible={setVacancyModalVisible}/>,
        managers: <ManagersTab/>,
        info: <InfoTab company={companyInfo}/>,
    }

    const [currentTab, setCurrentTab] = useState('vacancies');

    const renderTab = () => {
        let tab = Object.keys(tabs).find(key => key === currentTab);
        return tabs[tab]
    }

    const handleClickHideModal = () => {
        searchParams.delete('manager');
        setSearchParams(searchParams);
        setDeleteModalVisible(false);
    }

    const handleClickHideVacancyModal = () => {
        searchParams.delete('vacancy');
        setSearchParams(searchParams);
        setVacancyModalVisible(false);
    }

    useEffect(() => {
        setDeleteModalVisible(!!searchParams.get('manager'))
    }, [searchParams])

    const handleConfirmDeleteManager = () => {
        let managerId = searchParams.get('manager');
        axios.delete(`/api/managers/${managerId}/`, {
            headers: { Authorization: `Bearer ${tokenInfo.accessToken}`}
        }).then(() => {
            searchParams.delete('manager');
            setDeleteModalVisible(false);
        })
    }

    return (
        <div key={id} className='myCompany__container'>
            <h1>{title}</h1>
            <Navbar isDirector={tokenInfo?.is_director} setCurrentTab={setCurrentTab}/>
            { tokenInfo?.company && renderTab()}
            <ConfirmModal isActive={isDeleteModalVisible} handleClickHideModal={handleClickHideModal}
                          handleConfirm={handleConfirmDeleteManager} title='Are you sure you want to delete this manager?'/>
            <VacancyModal isActive={isVacancyModalVisible} handleClickHideModal={handleClickHideVacancyModal}/>
        </div>
    );
};

export default MyCompanyPage;
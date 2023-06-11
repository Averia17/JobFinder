import React, {useEffect, useState} from 'react';
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import axios from "axios";
import VacanciesTab from "../../containers/vacancies-tab/VacanciesTab";
import ManagersTab from "../../containers/managers-tab/ManagersTab";
import Navbar from "../../components/pages/my-company/navbar/Navbar";
import './style.css'
import ConfirmModal from "../../components/modal/ConfirmModal";
import {useSearchParams} from "react-router-dom";
import InfoTab from "../../containers/info-tab/InfoTab";
import VacancyModal from "../../components/pages/my-company/vacancy-form/VacancyModal";
import ErrorAlert from "../../components/alerts/ErrorAlert";

const MyCompanyPage = () => {
    const tokenInfo = useGetInfoFromToken();
    const [companyInfo, setCompanyInfo] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(!!searchParams.get('manager'));
    const [isVacancyModalVisible, setVacancyModalVisible] = useState(false);
    const [companyError, setCompanyError] = useState(undefined);

    useEffect(() => {
        axios.get(`/api/companies/my`, {
            headers: { Authorization: `Bearer ${tokenInfo.accessToken}` }
        }).then(({ data }) => setCompanyInfo(data))
    }, [tokenInfo.company])

    const { id, title, vacancies, is_active } = companyInfo;

    const tabs = {
        vacancies: <VacanciesTab isActive={is_active} vacancies={vacancies} setModalVisible={setVacancyModalVisible}/>,
        managers: <ManagersTab/>,
        info: <InfoTab setError={setCompanyError} company={companyInfo}/>,
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
        }).catch(() => setCompanyError('Manager have filters, you cannot delete him'))
    }

    const handleLogoChange = event => {
        if (event.target.files) {
            axios.patch(`/api/companies/${companyInfo.id}/`, {
            image: event.target.files[0]
        }, {
            headers: {
                Authorization: `Bearer ${tokenInfo.accessToken}`,
                "Content-Type": "multipart/form-data"}
        }).then(({data}) => {
                setCompanyInfo({...companyInfo, image: data.image});
            })
        }
    };
    return (
        <div key={id} className='myCompany__container'>
            {companyInfo?.image && <div className="logo__container"><img src={companyInfo?.image} alt=""/></div>}
            {tokenInfo?.is_director && <div className="upload-logo__container">
                <label htmlFor="formId" className="upload-logo__button">
                     <input onChange={handleLogoChange}  name="" type="file" id="formId" hidden />
                      Загрузить аватар компании
                 </label>
            </div>}
            <h1>{title}</h1>
            {!is_active && <p className='myCompany__notActive'>Ваша компания не активна</p>}
            <Navbar isDirector={tokenInfo?.is_director} setCurrentTab={setCurrentTab}/>
            {tokenInfo?.company && renderTab()}
            <ConfirmModal isActive={isDeleteModalVisible} handleClickHideModal={handleClickHideModal}
                          handleConfirm={handleConfirmDeleteManager} title='Вы уверены, что хотите удалить этого менеджера?'/>
            <VacancyModal isActive={isVacancyModalVisible} handleClickHideModal={handleClickHideVacancyModal}/>
            {companyError && <ErrorAlert error={companyError} setError={setCompanyError}/>}
        </div>
    );
};

export default MyCompanyPage;
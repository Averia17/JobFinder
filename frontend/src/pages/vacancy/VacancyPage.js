import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import axios from "axios";
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import {renderSalaryIfExists} from "../../components/vacancy/Vacancy";
import FavoriteButton from "../../components/buttons/FavoriteButton";
import ResponsesTab from "../../components/pages/my-company/vacancy/ResponsesTab";
import ViewsTab from "../../components/pages/my-company/vacancy/ViewsTab";
import Navbar from "../../components/pages/my-company/vacancy/Navbar";
import './style.css';
import AcceptModal from "../../components/modal/AcceptModal";
import {useNavigate, useSearchParams} from "react-router-dom";
import RejectModal from "../../components/modal/RejectModal";

import ChatModal from "../../components/chat-modal/ChatModal";
import dayjs from "dayjs";

const VacancyPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const tokenInfo = useGetInfoFromToken();
    const [searchParams, setSearchParams] = useSearchParams();
    const responseId = searchParams.get('responseId');
    const [vacancyInfo, setVacancyInfo] = useState({});
    const [isVacancyFavorite, setVacancyFavorite] = useState(vacancyInfo.is_favorite);
    const [isAcceptModalVisible, setAcceptModalVisible] = useState(false);
    const [isRejectModalVisible, setRejectModalVisible] = useState(false);
    const [isChatModalVisible, setChatModalVisible] = useState(false);
    const [acceptMessage, setAcceptMessage] = useState(undefined);
    const [rejectMessage, setRejectMessage] = useState(undefined);

    const tabs = {
        responses:
            <ResponsesTab
                setAcceptModalVisible={setAcceptModalVisible}
                setRejectModalVisible={setRejectModalVisible}
                setChatModalVisible={setChatModalVisible}
                responses={vacancyInfo?.responses}/>,
        views: <ViewsTab views={vacancyInfo?.views}/>,
    }

    const [currentTab, setCurrentTab] = useState('responses');

    const renderTab = () => {
        let tab = Object.keys(tabs).find(key => key === currentTab);
        return tabs[tab];
    }


    useEffect(() => {
        axios.get(`/api/vacancies/${id}`, tokenInfo?.accessToken && {
            headers: {
                'Authorization': `Bearer ${tokenInfo?.accessToken}`
            }
        })
            .then(({data}) => setVacancyInfo(data))
    }, []);

    const {title, company} = vacancyInfo;

    const respondToVacancy = () => {
        axios.post('/api/responses/', {vacancy: id}, {
            headers: {
                'Authorization': `Bearer ${tokenInfo?.accessToken}`
            }
        }).catch(({response}) => {
            if(response.status === 401) {
               navigate('/login')
            }
        })
    }

    const handleClickChangeFavoriteStatus = (event) => {
        axios.post('/api/favorite_vacancies/', {vacancy: id}, {
            headers: {Authorization: `Bearer ${tokenInfo?.accessToken}`}
        }).then(() => setVacancyFavorite(!isVacancyFavorite))
    }

    const handleClickHideAcceptModal = () => {
        searchParams.delete('responseId');
        setSearchParams(searchParams);
        setAcceptModalVisible(false);
    }

    const handleClickHideRejectModal = () => {
        searchParams.delete('responseId');
        setSearchParams(searchParams);
        setRejectModalVisible(false);
    }

    const handleConfirmAccept = () => {
        axios.post(`/api/responses/${responseId}/messages/`, {text: acceptMessage}, {
            headers: {
                Authorization: `Bearer ${tokenInfo?.accessToken}`
            }
        }).then(() => {
            searchParams.delete('responseId');
            setSearchParams(searchParams);
            setAcceptModalVisible(false)
        }).then(() => axios.patch(`/api/responses/${responseId}/`, {status: "INVITE"}, {
            headers: {
                Authorization: `Bearer ${tokenInfo?.accessToken}`
            }
        }))
    }

    const handleConfirmReject = () => {
        axios.post(`/api/responses/${responseId}/messages/`, {text: rejectMessage}, {
            headers: {
                Authorization: `Bearer ${tokenInfo?.accessToken}`
            }
        }).then(() => {
            searchParams.delete('responseId');
            setSearchParams(searchParams);
            setRejectModalVisible(false)
        }).then(() => axios.patch(`/api/responses/${responseId}/`, {status: "REJECT"}, {
            headers: {
                Authorization: `Bearer ${tokenInfo?.accessToken}`
            }
        }))
    }

    return (
        <div className='vacancyPage__container'>
            <div className='vacancyPage__header'>
                <h1>{title}</h1>
                {tokenInfo?.user_id &&
                    <FavoriteButton onClick={handleClickChangeFavoriteStatus} is_favorite={isVacancyFavorite}/>}
            </div>
            <h2>{company?.title}</h2>
            {!vacancyInfo.is_active && <b>
                <div style={{color: "red"}}>Vacancy is not active</div>
            </b>}
            <div>{renderSalaryIfExists(vacancyInfo.min_salary, vacancyInfo.max_salary)}</div>
            <p>Created {vacancyInfo?.created && dayjs(vacancyInfo?.created).format("DD.MM.YYYY")}</p>
            <div>{vacancyInfo.employment_type}</div>
            <div>Required experience {vacancyInfo.experience_option} years</div>
            {vacancyInfo.description &&
                <div>
                    <hr/>
                    <div style={{whiteSpace: "pre-line"}}>{vacancyInfo.description}</div>
                    <hr/>
                </div>
            }
            {!tokenInfo?.company && <button onClick={respondToVacancy}
                                            disabled={vacancyInfo?.is_responded || !vacancyInfo?.is_active}>Respond</button>}
            {tokenInfo?.company && <Navbar setCurrentTab={setCurrentTab}/>}
            {tokenInfo?.company ? renderTab() : null}
            <AcceptModal
                isActive={isAcceptModalVisible}
                handleClickHideModal={handleClickHideAcceptModal}
                handleConfirm={handleConfirmAccept}
                setAcceptMessage={setAcceptMessage}/>
            <RejectModal
                isActive={isRejectModalVisible}
                handleClickHideModal={handleClickHideRejectModal}
                handleConfirm={handleConfirmReject}
                setRejectReason={setRejectMessage}/>
            {isChatModalVisible && <ChatModal setChatModalVisible={setChatModalVisible}/>}
        </div>
    );
};

export default VacancyPage;
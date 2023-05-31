import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import axios from "axios";
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import {renderSalaryIfExists} from "../../containers/vacancy/Vacancy";
import FavoriteButton from "../../components/buttons/FavoriteButton";
import ResponsesTab from "../../components/pages/my-company/vacancy/ResponsesTab";
import ViewsTab from "../../components/pages/my-company/vacancy/ViewsTab";
import Navbar from "../../components/pages/my-company/vacancy/Navbar";
import './style.css';
import AcceptModal from "../../components/modal/AcceptModal";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import RejectModal from "../../components/modal/RejectModal";

import ChatModal from "../../containers/chat-modal/ChatModal";
import dayjs from "dayjs";
import ErrorAlert from "../../components/alerts/ErrorAlert";
import Button from "../../components/buttons/Button";

const VacancyPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const tokenInfo = useGetInfoFromToken();
    const [searchParams, setSearchParams] = useSearchParams();
    const responseId = searchParams.get('responseId');
    const [vacancyInfo, setVacancyInfo] = useState({});
    const [error, setError] = useState(undefined);
    const [isVacancyFavorite, setVacancyFavorite] = useState(vacancyInfo.is_favorite);
    const [isAcceptModalVisible, setAcceptModalVisible] = useState(false);
    const [isRejectModalVisible, setRejectModalVisible] = useState(false);
    const [isChatModalVisible, setChatModalVisible] = useState(false);
    const [acceptMessage, setAcceptMessage] = useState(undefined);
    const [rejectMessage, setRejectMessage] = useState(undefined);
    const [responseStatus, setResponseStatus] = useState(undefined);
    const formattedResponses = vacancyInfo?.responses?.map(response => {
                    delete response.vacancy.title
                    return response
                })
    const tabs = {
        responses:
            <ResponsesTab
                setAcceptModalVisible={setAcceptModalVisible}
                setRejectModalVisible={setRejectModalVisible}
                setChatModalVisible={setChatModalVisible}
                setResponseStatus={setResponseStatus}
                responses={formattedResponses}/>,
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
        })).catch(({response}) => {
                const error = response.data
                let message = "Message cannot be sent";
                if(typeof error === 'object'  && "error" in error)
                    message = error["error"];
                if(Array.isArray(error))
                    message = error[0]
                setError(message)
            })
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
        })).catch(({response}) => {
                const error = response.data
                let message = "Message cannot be sent";
                if(typeof error === 'object'  && "error" in error)
                    message = error["error"];
                if(Array.isArray(error))
                    message = error[0]
                setError(message)
            })
    }

    return (
        <div className='vacancyPage__container'>
            <div className='vacancyPage__header__container'>
                <div className='header__title__container'>
                    <div className='header__title'>
                        <h1>{title}</h1>
                        <h2><Link className="company__link" to={`/companies/${company?.id}`}>{company?.title}</Link></h2>
                        {!vacancyInfo.is_active && <b>
                            <div style={{color: "red"}}>Вакансия находится в архиве</div>
                        </b>}
                        <p className='vacancy__salary'>{renderSalaryIfExists(vacancyInfo.min_salary, vacancyInfo.max_salary)}</p>
                        <div>{vacancyInfo.employment_type}</div>
                        <div>Требуемый опыт работы: {vacancyInfo.experience_option?.includes('0') ? 'не требуется'
                                : vacancyInfo.experience_option}
                        </div>
                        <p>Создана {vacancyInfo?.created && dayjs(vacancyInfo?.created).format("DD.MM.YYYY")}</p>
                        {tokenInfo?.user_id && <div className='vacancyPage__header__buttons'>
                            {!tokenInfo?.company && <Button onClick={respondToVacancy}
                                                            disabled={vacancyInfo?.is_responded || !vacancyInfo?.is_active}>Откликнуться</Button>}
                            <FavoriteButton onClick={handleClickChangeFavoriteStatus} is_favorite={isVacancyFavorite}/>
                        </div>}
                    </div>
                    {company?.image && <div className='company__logo'><img src={`http://localhost:8000/${company?.image}`} alt=""/></div>}
                </div>
            </div>
            {vacancyInfo.description &&
                <div>
                    <div style={{whiteSpace: "pre-line"}}>{vacancyInfo.description}</div>
                </div>
            }

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
            {error && <ErrorAlert error={error} setError={setError}/>}

        </div>
    );
};

export default VacancyPage;
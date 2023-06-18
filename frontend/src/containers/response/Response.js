import React, {useState} from 'react';
import {Link, useSearchParams} from "react-router-dom";
import Button from "../../components/buttons/Button";
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import './style.css'
import ImageButton from "../../components/buttons/ImageButton";
import messageIcon from '../../assets/message.png'
import acceptIcon from '../../assets/accept-button.png'
import cancelIcon from '../../assets/cancel-button.png'
import {useNavigate} from "react-router";
import dayjs from "dayjs";
import axios from "axios";
import {formatDate} from "../../services/services";


const Response = (props) => {
    const {id, status} = props;
    const navigate = useNavigate();
    const tokenInfo = useGetInfoFromToken();
    const [searchParams, setSearchParams] = useSearchParams();

    const handleClick = (event) => {
        event.stopPropagation();
        searchParams.set('responseId', id);
        setSearchParams(searchParams);
        props.setChatModalVisible(true);
    }

    const handleClickAccept = (event) => {
        event.stopPropagation();
        searchParams.set('responseId', id);
        setSearchParams(searchParams);
        props.setAcceptModalVisible(true);
        props?.setResponseStatus("INVITE");
    }

    const handleClickReject = (event) => {
        event.stopPropagation();
        searchParams.set('responseId', id);
        setSearchParams(searchParams);
        props.setRejectModalVisible(true);
        props?.setResponseStatus("REJECT");
    }

    const handleLinkToResumes = () => {
        if (tokenInfo?.company) {
            axios.get(`/api/responses/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${tokenInfo?.accessToken}`
                }
            })
            navigate(`/resumes/${props?.user?.resume}`)
        } else
            navigate(`/vacancies/${props?.vacancy?.id}`)

    }

    // const navigateToUserResume = () => {
    //     if (props?.user__resume) {
    //         navigate(`/resumes/${props?.user__resume}`);
    //     }
    // }

    return (
        <div className='responseBlock__container' onClick={handleLinkToResumes}>
            <Link to={{pathname: `/vacancies/${props?.vacancy?.id}`}}><h2 className="responseBlock__container__company__name">{props?.vacancy?.title}</h2></Link>
            {!tokenInfo?.company && <p>{props?.vacancy?.company}</p>}
            {(props?.user?.name || props?.user?.email) && tokenInfo?.company && <p>{props?.user?.name} {props?.user?.email}</p>}
            <p style={{ color: `${status === "Отказ" && "red" || status === "Приглашение" && "green"}`}}>{status}</p>
            <p>{props?.created && formatDate(props?.created)}</p>
            <div className="messages_icon">
                {props?.count_new_messages > 0 && <div className="count__new__notification_messages">{props?.count_new_messages}</div>}
                <ImageButton src={messageIcon} onClick={handleClick}/>
            </div>
            {tokenInfo?.company && <>
                <ImageButton src={acceptIcon} onClick={handleClickAccept}>Accept</ImageButton>
                <ImageButton src={cancelIcon} onClick={handleClickReject}>Reject</ImageButton>
            </>}
        </div>
    );
};

export default Response;
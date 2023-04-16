import React, {useState} from 'react';
import {Link, useSearchParams} from "react-router-dom";
import Button from "../buttons/Button";
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import './style.css'
import ImageButton from "../buttons/ImageButton";
import messageIcon from '../../assets/message.png'
import acceptIcon from '../../assets/accept-button.png'
import cancelIcon from '../../assets/cancel-button.png'
import {useNavigate} from "react-router";
import dayjs from "dayjs";
import axios from "axios";


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
        props.setResponseStatus(status);
    }

    const handleClickAccept = (event) => {
        event.stopPropagation();
        searchParams.set('responseId', id);
        setSearchParams(searchParams);
        props.setAcceptModalVisible(true);
    }

    const handleClickReject = (event) => {
        event.stopPropagation();
        searchParams.set('responseId', id);
        setSearchParams(searchParams);
        props.setRejectModalVisible(true);
    }

    const handleLinkToResumes = () => {
        if (tokenInfo?.company) {
            axios.get(`/api/responses/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${tokenInfo?.accessToken}`
                }
            })
            navigate(`/resumes?user=${props?.user?.id}`)
        } else
            navigate(`/vacancies/${props?.vacancy?.id}`)

    }

    return (
        <div className='responseBlock__container' onClick={handleLinkToResumes}>
            <Link to={{pathname: `/vacancies/${props?.vacancy?.id}`}}><h1>{props?.vacancy?.title}</h1></Link>
            {props?.user?.name || props?.user?.email && <p>{props?.user?.name} {props?.user?.email}</p>}
            <p>{status}</p>
            <p>{props?.created && dayjs(props?.created).format("DD.MM.YYYY")}</p>
            <ImageButton src={messageIcon} onClick={handleClick}/>
            {tokenInfo?.company && <>
                <ImageButton src={acceptIcon} onClick={handleClickAccept}>Accept</ImageButton>
                <ImageButton src={cancelIcon} onClick={handleClickReject}>Reject</ImageButton>
            </>}
        </div>
    );
};

export default Response;
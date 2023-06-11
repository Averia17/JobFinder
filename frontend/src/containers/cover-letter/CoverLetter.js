import React, {useEffect, useState} from 'react';
import'./style.css'
import {TextField} from "@mui/material";
import Button from "../../components/buttons/Button";
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import axios from "axios";

const CoverLetter = ({ responseId, ref }) => {
    const { accessToken } = useGetInfoFromToken();
    const [coverLetter, setCoverLetter] = useState(undefined);
    const [isMessageSent, setMessageSent] = useState(false);
    const handleChangeCoverLetter = (event) => {
        setCoverLetter(event.target.value);
    }

    const sendCoverLetter = () => {
        axios.post(`/api/responses/${responseId}/messages/`, { text: coverLetter }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(() => {
            setMessageSent(true);
        })
    }

    return (
        <div className='coverLetter__container' ref={ref}>
            {!isMessageSent ?
                <>
                    <h3>Хотите отправить сопроводительное письмо?</h3>
                    <TextField multiline maxRows={7} fullWidth onChange={handleChangeCoverLetter}/>
                    <Button disabled={!(!!coverLetter)} onClick={sendCoverLetter}>Отправить</Button>
                </>
                :
                <h3>Сопроводительное письмо было отправлено</h3>}
        </div>
    );
};

export default CoverLetter;
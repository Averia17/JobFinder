import React, {useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import './style.css'
import {useSearchParams} from "react-router-dom";
import axios from "axios";
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import dayjs from "dayjs";

const ChatModal = () => {
    const accessToken = localStorage.getItem('access_token');
    const {user_id} = useGetInfoFromToken();
    const [searchParams] = useSearchParams();
    const [responseId, setResponseId] = useState(undefined);
    const [message, setMessage] = useState(undefined);
    const [messages, setMessages] = useState([]);
    const [time, setTime] = useState(Date.now());

    useEffect(() => {
        setResponseId(searchParams.get('responseId'))
    }, [searchParams])

    const handleChangeMessage = event => {
        setMessage(event.target.value);
    }

    useEffect(() => {
        setResponseId(searchParams.get('responseId'));
        axios.get(`/api/responses/${responseId}/messages/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(({data}) => setMessages(data))
    }, [])

    const handleSendMessage = () => {
        axios.post(`/api/responses/${responseId}/messages/`, {text: message}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(() => setMessage(''))
    }

    useEffect(() => {
        axios.get(`/api/responses/${responseId}/messages/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(({data}) => setMessages(data))
        const interval = setInterval(() => setTime(Date.now()), 5000);
        return () => {
            clearInterval(interval);
        };
    }, [time])

    return searchParams.get('responseId') && (
        <div className='chat__container'>
            <div className='chat__messages'>
                {
                    messages.map(({user, text, created}) => {
                        let time = dayjs(created).format("HH:mm");
                        return <div
                            className={`chat__message__container ${user_id === user ? 'myMessage' : 'companionMessage'}`}>
                            {/*<p className='message__username'>{user}</p>*/}
                            <p className='message__text'>{text}</p>
                            <p className='message__time'>{time}</p>
                        </div>
                    })
                }
            </div>
            <div className='chat__textField__container'>
                <TextField
                    onChange={handleChangeMessage}
                    value={message}
                    id="standard-textarea"
                    placeholder="Write there"
                    multiline
                    rows={2}
                    variant="filled"
                    InputProps={{ disableUnderline: true, style: {
                            paddingRight: 50
                        } }}
                    className='chat__textField'
                />
                <button className='chat__button' onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatModal;
import React, {useEffect, useState} from 'react';
import axios from "axios";
import Response from "../../containers/response/Response";
import ChatModal from "../../containers/chat-modal/ChatModal";
import {useSearchParams} from "react-router-dom";

const ResponsesPage = () => {
    const [responses, setResponses] = useState([]);
    const [isChatModalVisible, setChatModalVisible] = useState(false);
    const [responseStatus, setResponseStatus] = useState(undefined);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        axios.get('/api/responses', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(({data}) => setResponses(data))
    }, [])


    return (
        <div>
            {
                responses.map(response => (
                    <Response key={response.id} setResponseStatus={setResponseStatus} {...response} setChatModalVisible={setChatModalVisible} />
                ))
            }
            {isChatModalVisible &&
                <ChatModal
                    setResponseStatus={setResponseStatus}
                    responseStatus={responseStatus}
                    setChatModalVisible={setChatModalVisible}/>}
        </div>
    );
};

export default ResponsesPage;
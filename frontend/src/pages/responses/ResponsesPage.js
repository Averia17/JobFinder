import React, {useEffect, useState} from 'react';
import axios from "axios";
import Response from "../../components/response/Response";
import ChatModal from "../../components/chat-modal/ChatModal";

const ResponsesPage = () => {
    const [responses, setResponses] = useState([]);

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
                    <Response {...response}/>
                ))
            }
            <ChatModal/>
        </div>
    );
};

export default ResponsesPage;
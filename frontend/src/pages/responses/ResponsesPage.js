import React, {useEffect, useState} from 'react';
import axios from "axios";
import Response from "../../components/response/Response";

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
        </div>
    );
};

export default ResponsesPage;
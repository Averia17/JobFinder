import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import axios from "axios";

const CompanyPage = () => {
    const { id } = useParams();
    const [companyInfo, setCompanyInfo] = useState({});
    const accessToken = localStorage.getItem('access_token');

    useEffect(() => {
        axios.get(`/api/companies/${id}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(({data}) => setCompanyInfo(data));
    }, [])

    return (
        <div>
            {companyInfo.title}
        </div>
    );
};

export default CompanyPage;
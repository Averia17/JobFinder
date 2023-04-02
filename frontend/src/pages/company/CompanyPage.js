import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import axios from "axios";
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";

const CompanyPage = () => {
    const {id} = useParams();
    const [companyInfo, setCompanyInfo] = useState({});
    const tokenInfo = useGetInfoFromToken();

    useEffect(() => {
        axios.get(`/api/companies/${id}`, {
            headers: {
                'Authorization': `Bearer ${tokenInfo?.accessToken}`
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
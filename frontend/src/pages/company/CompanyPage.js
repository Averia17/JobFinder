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
        <div className="company__container">
            <h1>{companyInfo.title}</h1>
            {companyInfo?.image && <div className="logo__container"><img src={companyInfo?.image} alt=""/></div>}
            <div className="company__info__item">
                <div className="company__info__item__title">Address</div>
                <div type='text' name='address'>{companyInfo?.address}
                    <div/>
                </div>
            </div>
            <div className="company__info__item">
                <div className="company__info__item__title">Phone</div>
                <div type='text' name='phone'>{companyInfo?.phone}
                    <div/>
                </div>
            </div>
            <div className="company__info__item">
                <div className="company__info__item__title">Site</div>
                <div>{companyInfo?.site}
                    <div/>
                </div>
            </div>
            <div className="company__info__item">
                <div className="company__info__item__title">Employees number</div>
                <div>{companyInfo?.employees_number}
                    <div/>
                </div>
            </div>
            <div className="company__info__item">
                <div className="company__info__item__title">Contact email</div>
                <div>{companyInfo?.email}
                    <div/>
                </div>
            </div>
            <div className="company__info__item">
                <div className="company__info__item__title">Description</div>
                <div name='description'>{companyInfo?.description}
                    <div/>
                </div>
            </div>
        </div>

    );
};
export default CompanyPage;
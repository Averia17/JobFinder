import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router";
import axios from "axios";
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import './style.css'
import Vacancy from "../../containers/vacancy/Vacancy";
import {useLocation} from "react-router-dom";

const CompanyPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [companyInfo, setCompanyInfo] = useState({});
    const [activeVacancies, setActiveVacancies] = useState([]);
    const tokenInfo = useGetInfoFromToken();

    useEffect(() => {
        axios.get(`/api/companies/${id}`)
            .then(({ data }) => setCompanyInfo(data));
    }, []);

    useEffect(() => {
        axios.get(`/api/vacancies?company=${id}&is_active=true`)
            .then(({ data }) => setActiveVacancies(data));
    }, []);

    const linkToCompanyVacancies = () => {
        navigate('/vacancies', { state: { company: id }})
    }

    return (
        <div className="companyPage__container">
            <div className='companyPage__header'>
                <div className='companyPage__info'>
                    <h1>{companyInfo.title}</h1>
                    <div className="company__info__item">
                        <div className="company__info__item__title">Адрес</div>
                        <div type='text' name='address'>{companyInfo?.address}</div>
                    </div>
                    <div className="company__info__item">
                        <div className="company__info__item__title">Номер телефона</div>
                        <div type='text' name='phone'>{companyInfo?.phone}</div>
                    </div>
                    <div className="company__info__item">
                        <div className="company__info__item__title">Сайт</div>
                        <div>{companyInfo?.site}</div>
                    </div>
                    <div className="company__info__item">
                        <div className="company__info__item__title">Количество сотрудников</div>
                        <div>{companyInfo?.employees_number || 0}</div>
                    </div>
                    <div className="company__info__item">
                        <div className="company__info__item__title">Электронная почта</div>
                        <div>{companyInfo?.email}</div>
                    </div>
                </div>
                {companyInfo?.image && <div className="logo__container"><img src={companyInfo?.image} alt=""/></div>}
            </div>
            {companyInfo?.description && <div className="companyPage__description company__info__item">
                {companyInfo?.description}
            </div>}
            {activeVacancies?.length > 0 && <div className="companyPage__vacancies">
                <h1>Активные вакансии компании ({activeVacancies?.length})</h1>
                {activeVacancies?.slice(0, 5).map(vacancy => <Vacancy {...vacancy} />)}
                {activeVacancies?.length > 4 &&
                    <div className='companyPage__link' onClick={linkToCompanyVacancies}>Посмотреть больше вакансий</div>}
            </div>}
        </div>

    );
};
export default CompanyPage;
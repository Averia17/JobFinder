import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import axios from "axios";
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import {renderSalaryIfExists} from "../../components/vacancy/Vacancy";
import FavoriteButton from "../../components/buttons/FavoriteButton";
import Response from "../../components/response/Response";

const VacancyPage = () => {
    const {id} = useParams();
    const tokenInfo = useGetInfoFromToken();
    const [vacancyInfo, setVacancyInfo] = useState({});
    const [isVacancyFavorite, setVacancyFavorite] = useState(vacancyInfo.is_favorite);

    useEffect(() => {
        axios.get(`/api/vacancies/${id}`, tokenInfo?.accessToken && {
            headers: {
                'Authorization': `Bearer ${tokenInfo?.accessToken}`
            }
        })
            .then(({data}) => setVacancyInfo(data))
    }, []);

    const {title, company} = vacancyInfo;

    const respondToVacancy = () => {
        axios.post('/api/responses/', {vacancy: id}, {
            headers: {
                'Authorization': `Bearer ${tokenInfo?.accessToken}`
            }
        })
    }

    const handleClickChangeFavoriteStatus = (event) => {
        axios.post('/api/favorite_vacancies/', {vacancy: id}, {
            headers: {Authorization: `Bearer ${tokenInfo?.accessToken}`}
        }).then(() => setVacancyFavorite(!isVacancyFavorite))
    }

    return (
        <div>
            <div>
                <h1>{title}</h1>
                {tokenInfo?.user_id &&
                    <FavoriteButton onClick={handleClickChangeFavoriteStatus} is_favorite={isVacancyFavorite}/>}
            </div>
            <h2>{company?.title}</h2>

            {!vacancyInfo.is_active && <b>
                <div style={{color: "red"}}>Vacancy is not active</div>
            </b>}
            <div>{renderSalaryIfExists(vacancyInfo.min_salary, vacancyInfo.max_salary)}</div>
            <div>{vacancyInfo.employment_type}</div>
            <div>Required experience {vacancyInfo.experience_option} years</div>
            {vacancyInfo.description &&
                <div>
                    <hr/>
                    <div style={{whiteSpace: "pre-line"}}>{vacancyInfo.description}</div>
                    <hr/>
                </div>
            }
            {!tokenInfo?.company && <button onClick={respondToVacancy}
                                            disabled={vacancyInfo?.is_responded || !vacancyInfo?.is_active}>Respond</button>}
            {vacancyInfo?.responses?.map(response => (
                <Response {...response}/>
            ))}
        </div>
    );
};

export default VacancyPage;
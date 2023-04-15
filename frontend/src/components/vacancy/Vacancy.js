import React, {useState} from 'react';
import {useNavigate} from "react-router";
import axios from "axios";
import './style.css'
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import FavoriteButton from "../buttons/FavoriteButton";
import Button from "../buttons/Button";
import {useSearchParams} from "react-router-dom";

export const renderSalaryIfExists = (min_salary, max_salary,) => {
    if (min_salary && max_salary) {
        return <div className='salary'>{min_salary} - {max_salary}$</div>
    } else if (min_salary && !max_salary) {
        return <div className='salary'>from {min_salary}$</div>
    } else if (!min_salary && max_salary) {
        return <div className='salary'>to {max_salary}$</div>
    }
}

const Vacancy = (props) => {
    const {id, title, company, is_favorite} = props;
    const [isVacancyFavorite, setVacancyFavorite] = useState(is_favorite);
    const tokenInfo = useGetInfoFromToken();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const linkToVacancyPage = () => {
        navigate(`/vacancies/${id}`);
    }

    const respondToVacancy = () => {
        const accessToken = localStorage.getItem('access_token');
        axios.post('/api/responses/', {vacancy: id}, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    const handleClickChangeFavoriteStatus = (event) => {
        event.stopPropagation();
        axios.post('/api/favorite_vacancies/', {vacancy: id}, {
            headers: {Authorization: `Bearer ${tokenInfo?.accessToken}`}
        }).then(() => setVacancyFavorite(!isVacancyFavorite))
    }

    const handleClickChangeVacancy = (event) => {
        event.stopPropagation();
        searchParams.set('vacancy', id);
        setSearchParams(searchParams);
        props.setModalVisible(true);
    }

    return (
        <div onClick={linkToVacancyPage} className='vacancy-container'>
            <div className='vacancy__header'>
                <h2>{title}</h2>
                {tokenInfo?.user_id && <FavoriteButton onClick={handleClickChangeFavoriteStatus} is_favorite={isVacancyFavorite}/>}
                {(tokenInfo?.company || tokenInfo?.is_director) && props.companyMembersPermissions &&
                    <Button onClick={handleClickChangeVacancy}>Change</Button>}
            </div>
            {props.min_salary || props.max_salary ? renderSalaryIfExists(props.min_salary, props.max_salary) : null}
            {!props?.companyMembersPermissions && <div>{company?.title}</div>}
            {tokenInfo?.company && <div>{props?.manager?.email} {props?.manager?.name}</div>}
            {
                !tokenInfo?.company && <Button onClick={respondToVacancy}
                                               className={props.is_responded || !props.is_active? 'respond-button__disabled' : 'respond-button'}
                                               disabled={props.is_responded}>Respond</Button>
            }
        </div>
    );
};

export default Vacancy;
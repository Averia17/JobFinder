import React, {useState} from 'react';
import {useNavigate} from "react-router";
import axios from "axios";
import './style.css'
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import FavoriteButton from "../buttons/FavoriteButton";
import Button from "../buttons/Button";

const Vacancy = (props) => {
    const { id, title, company, is_favorite } = props;
    const [isVacancyFavorite, setVacancyFavorite] = useState(is_favorite);
    const tokenInfo = useGetInfoFromToken();
    const navigate = useNavigate();

    const renderSalaryIfExists = () => {
        if (props.min_salary && props.max_salary) {
            return <div className='salary'>{props.min_salary} - {props.max_salary}$</div>
        } else if (props.min_salary && !props.max_salary) {
            return <div className='salary'>from {props.min_salary}$</div>
        } else if (!props.min_salary && props.max_salary) {
            return <div className='salary'>to {props.max_salary}$</div>
        }
    }

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
        axios.post('/api/favorite_vacancies/', { vacancy: id }, {
            headers: { Authorization: `Bearer ${tokenInfo?.accessToken}` }
        }).then(() => setVacancyFavorite(!isVacancyFavorite))
    }

    return (
        <div onClick={linkToVacancyPage} className='vacancy-container'>
            <div className='vacancy__header'>
                <h2>{title}</h2>
                {tokenInfo?.user_id && <FavoriteButton onClick={handleClickChangeFavoriteStatus} is_favorite={isVacancyFavorite}/>}
            </div>
            {
                props.min_salary || props.max_salary ?
                    renderSalaryIfExists() : null
            }
            <div>{company?.title}</div>
            {
                !tokenInfo?.company && <Button onClick={respondToVacancy}
                                              className={props.is_responded ? 'respond-button__disabled' : 'respond-button'}
                                              disabled={props.is_responded}>Respond</Button>
            }
        </div>
    );
};

export default Vacancy;
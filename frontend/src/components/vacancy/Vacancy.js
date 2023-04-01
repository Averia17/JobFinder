import React from 'react';
import {useNavigate} from "react-router";
import axios from "axios";
import './style.css'

const Vacancy = (props) => {
    const {id, title, company} = props;
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

    return (
        <div onClick={linkToVacancyPage} className='vacancy-container'>
            <h2>{title}</h2>
            {
                props.min_salary || props.max_salary ?
                    renderSalaryIfExists() : null
            }
            <div>{company?.title}</div>
            <button onClick={respondToVacancy}
                    className={props.is_responded ? 'respond-button__disabled' : 'respond-button'}
                    disabled={props.is_responded}>Respond</button>
        </div>
    );
};

export default Vacancy;
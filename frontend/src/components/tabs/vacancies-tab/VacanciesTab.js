import React from 'react';
import Vacancy from "../../vacancy/Vacancy";
import Tab from "../Tab";
import Button from "../../buttons/Button";
import {useNavigate} from "react-router-dom";

const VacanciesTab = ({ vacancies }) => {
    const navigate = useNavigate();

    const handleClickLinkToForm = () => {
        navigate('/create-vacancy')
    }

    return (
        <Tab>
            <Button onClick={handleClickLinkToForm}>New vacancy</Button>
            {
                vacancies?.map(vacancy => (
                    <Vacancy key={vacancy.id} {...vacancy}/>
                ))
            }
        </Tab>
    );
};

export default VacanciesTab;
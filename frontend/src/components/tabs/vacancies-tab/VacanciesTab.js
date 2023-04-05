import React from 'react';
import Vacancy from "../../vacancy/Vacancy";
import Tab from "../Tab";

const VacanciesTab = ({ vacancies }) => {

    return (
        <Tab>
            {
                vacancies?.map(vacancy => (
                    <Vacancy key={vacancy.id} {...vacancy}/>
                ))
            }
        </Tab>
    );
};

export default VacanciesTab;
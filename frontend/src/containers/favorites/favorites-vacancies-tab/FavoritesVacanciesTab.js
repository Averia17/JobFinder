import React from 'react';
import Tab from "../../../components/tabs/Tab";
import Vacancy from "../../vacancy/Vacancy";

const FavoritesVacanciesTab = ({ vacancies }) => {
    return (
        <Tab>
            {vacancies?.length > 0 ?
                <div>{vacancies?.map(vacancy => <Vacancy {...vacancy} />)}</div>
                :
                <div>У Вас нет избранных вакансий</div>
            }
        </Tab>
    );
};

export default FavoritesVacanciesTab;
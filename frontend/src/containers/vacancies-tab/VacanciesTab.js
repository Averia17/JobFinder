import React from 'react';
import Vacancy from "../vacancy/Vacancy";
import Tab from "../../components/tabs/Tab";
import Button from "../../components/buttons/Button";

const VacanciesTab = ({ vacancies, setModalVisible }) => {
    return (
        <Tab>
            <Button onClick={() => setModalVisible(true)}>Создать новую вакансию</Button>
            {
                vacancies?.map(vacancy => (
                    <Vacancy key={vacancy.id} {...vacancy} companyMembersPermissions setModalVisible={setModalVisible}/>
                ))
            }
        </Tab>
    );
};

export default VacanciesTab;
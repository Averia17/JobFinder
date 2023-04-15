import React from 'react';
import Vacancy from "../../vacancy/Vacancy";
import Tab from "../Tab";
import Button from "../../buttons/Button";

const VacanciesTab = ({ vacancies, setModalVisible }) => {
    return (
        <Tab>
            <Button onClick={() => setModalVisible(true)}>New vacancy</Button>
            {
                vacancies?.map(vacancy => (
                    <Vacancy key={vacancy.id} {...vacancy} companyMembersPermissions setModalVisible={setModalVisible}/>
                ))
            }
        </Tab>
    );
};

export default VacanciesTab;
import React from 'react';
import Modal from "../../../modal/Modal";
import VacancyForm from "./VacancyForm";

const VacancyModal = ({ isActive, handleClickHideModal }) => {
    return (
        <Modal isActive={isActive} handleClickHideModal={handleClickHideModal}>
            <VacancyForm/>
        </Modal>
    );
};

export default VacancyModal;
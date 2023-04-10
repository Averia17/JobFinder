import React from 'react';
import Modal from "./Modal";
import Button from "../components/buttons/Button";

const ConfirmModal = ({ isActive, handleClickHideModal, title, handleConfirm }) => {
    return (
        <Modal isActive={isActive} handleClickHideModal={handleClickHideModal}>
            <h2>{title}</h2>
            <div className='form-button-group'>
                <Button onClick={handleClickHideModal}>Cancel</Button>
                <Button type='danger' onClick={handleConfirm}>Yes</Button>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
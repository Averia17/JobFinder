import React from 'react';
import Modal from "./Modal";
import {TextField} from "@mui/material";
import Button from "../buttons/Button";

const RejectModal = ({ isActive, handleClickHideModal, setRejectReason, handleConfirm }) => {
    return (
        <Modal isActive={isActive} handleClickHideModal={handleClickHideModal}>
            <h2>Пожалуйста, укажите причину отказа</h2>
            <TextField onChange={e => setRejectReason(e.target.value)}/>
            <Button onClick={handleConfirm}>Отправить</Button>
        </Modal>
    );
};

export default RejectModal;
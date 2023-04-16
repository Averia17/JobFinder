import React from 'react';
import Modal from "./Modal";
import {TextField} from "@mui/material";
import Button from "../buttons/Button";

const RejectModal = ({ isActive, handleClickHideModal, setRejectReason, handleConfirm }) => {
    return (
        <Modal isActive={isActive} handleClickHideModal={handleClickHideModal}>
            <h2>Please, let respondent know a reason</h2>
            <TextField onChange={e => setRejectReason(e.target.value)}/>
            <Button onClick={handleConfirm}>Send</Button>
        </Modal>
    );
};

export default RejectModal;
import React from 'react';
import Modal from "./Modal";
import {TextField} from "@mui/material";
import Button from "../buttons/Button";

const AcceptModal = ({ isActive, handleClickHideModal, setAcceptMessage, handleConfirm }) => {
    return (
        <Modal isActive={isActive} handleClickHideModal={handleClickHideModal}>
            <h2>Please, enter next steps</h2>
            <TextField onChange={e => setAcceptMessage(e.target.value)}/>
            <Button onClick={handleConfirm}>Send</Button>
        </Modal>
    );
};

export default AcceptModal;
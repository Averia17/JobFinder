import React, {useState} from 'react';
import Modal from "../../../modal/Modal";
import axios from "axios";
import {useGetInfoFromToken} from "../../../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import './style.css';
import Input from "../../../inputs/Input";

const AddManagerModal = ({ isActive, hideModal, setError, setResultMessage}) => {
    const { accessToken } = useGetInfoFromToken();
    const [managerInfo, setManagerInfo] = useState({ name: undefined, email: undefined });

    const handleChangeManagerInfo = event => {
        setManagerInfo({
            ...managerInfo,
            [event.target.name]: event.target.value
        })
    }

    const handleSubmitAddManager = event => {
        event.preventDefault();
        axios.post('/api/managers/', managerInfo, {
            headers: { Authorization: `Bearer ${accessToken}`}
        }).then(({ data }) => setResultMessage(data))
            .catch(({ response }) => {
                let error = response.data;
                if ("user" in response.data)
                    error = "Пользователь с этой электронной почтой уже получил сообщение"
                if ("detail" in response.data)
                    error = response.data.detail
                setError(error)
            })
    }

    return (
        <Modal isActive={isActive} handleClickHideModal={hideModal}>
            <form className='addManager__modal' onSubmit={handleSubmitAddManager}>
                <Input placeholder='Имя менеджера' type='text' name='name' onChange={handleChangeManagerInfo}/>
                <Input placeholder='Email' type='email' name='email' onChange={handleChangeManagerInfo}/>
                <input className='submit-button' type='submit' value="Добавить"></input>
            </form>
        </Modal>
    );
};

export default AddManagerModal;
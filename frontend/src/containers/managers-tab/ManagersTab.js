import React, {useEffect, useState} from 'react';
import Tab from "../../components/tabs/Tab";
import {Input} from "@mui/material";
import axios from "axios";
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import ManagerBlock from "./ManagerBlock";
import './style.css'
import ErrorAlert from "../../components/alerts/ErrorAlert";
import Button from "../../components/buttons/Button";
import AddManagerModal from "../../components/pages/my-company/add-manager-modal/AddManagerModal";


const ManagersTab = () => {
    const { accessToken } = useGetInfoFromToken();
    const [managers, setManagers] = useState([]);
    const [error, setError] = useState(undefined);
    const [resultMessage, setResultMessage] = useState(undefined);
    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        axios.get('/api/managers', {
            headers: { Authorization: `Bearer ${accessToken}`}
        }).then(({ data }) => setManagers(data))
            .catch(({ response }) => {
                let error = response.data;
                if ("detail" in response.data)
                    error = response.data.detail
                setError(error)
            })
    }, [])

    const showManagerModal = () => {
        setModalVisible(true);
    }

    const hideManagerModal = () => {
        setModalVisible(false);
    }


    return (
        <Tab>
            <Button onClick={showManagerModal}>Добавить менеджера</Button>
            <div>
                {
                    managers?.map(({ user }) => (
                        <ManagerBlock {...user}/>
                    ))
                }
            </div>
            <AddManagerModal isActive={isModalVisible} hideModal={hideManagerModal} setError={setError} setResultMessage={setResultMessage}/>
            {error && <ErrorAlert error={error} setError={setError}/>}
            <p>{resultMessage}</p>
        </Tab>
    );
};

export default ManagersTab;
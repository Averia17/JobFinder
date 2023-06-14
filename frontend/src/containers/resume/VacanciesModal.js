import Modal from "../../components/modal/Modal";
import {Select, TextField} from "@mui/material";
import {useEffect, useState} from "react";
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import axios from "axios";
import Button from "../../components/buttons/Button";
import {useNavigate} from "react-router";

const VacanciesModal = ({ isActive, hideModal, userId }) => {
    const tokenInfo = useGetInfoFromToken();
    const [vacancies, setVacancies] = useState([]);
    const [selectedVacancy, setSelectedVacancy] = useState(undefined);
    const [message, setMessage] = useState(undefined);
    const navigate = useNavigate();

    console.log(userId)

    useEffect(() => {
        axios.get(`/api/vacancies?company=${tokenInfo?.company}&user_id=${userId}`, {
            headers: {
                Authorization: `Bearer ${tokenInfo?.accessToken}`
            }
        })
            .then(({data}) => {
                setVacancies(data);
            })
    }, [isActive])

    const invitePerson = () => {
        const accessToken = localStorage.getItem('access_token');
        axios.post('/api/responses/', { vacancy: selectedVacancy, user: userId }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then(({data}) => {
            axios.post(`/api/responses/${data?.id}/messages/`, { text: message }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }).then(() => hideModal())
        })
            .catch(({response}) => {
            if(response.status === 401) {
                navigate('/login')
            }
        })
    }

    return (
        <Modal isActive={isActive} handleClickHideModal={hideModal}>
            <h1>Выберете вакансию</h1>
            <select onChange={(e) => setSelectedVacancy(e.target.value)}
                    defaultValue={vacancies?.length > 0 ? vacancies[0]?.id : null}>
                {vacancies?.map(({id, title}) => (
                    <option value={id}>{title}</option>
                ))}
            </select>
            <TextField placeholder='Введите текст Вашего приглашения' multiline rows={5}
                       fullWidth onChange={(e) => setMessage(e.target.value)}/>
            <Button onClick={invitePerson}>Подтвердить</Button>
        </Modal>
    );
};

export default VacanciesModal;
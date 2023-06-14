import React, {useState} from 'react';
import "./style.css"
import FavoriteButton from "../../components/buttons/FavoriteButton";
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import axios from "axios";
import Button from "../../components/buttons/Button";
import {formatExperience} from "../../services/services";
import {useNavigate} from "react-router";

const Resume = (props) => {
    const {
        id,
        title,
        city,
        user,
        experience,
        salary,
        is_favorite,
        is_active,
        setVacanciesModalVisible,
        setInviteUserId,
        is_responded
    } = props;
    const navigate = useNavigate();
    const tokenInfo = useGetInfoFromToken();
    const [isResumeFavorite, setResumeFavorite] = useState(is_favorite);

    const handleClickChangeFavoriteStatus = (event) => {
        event.stopPropagation();
        axios.post('/api/favorite_resumes/', {resume: id}, {
            headers: {Authorization: `Bearer ${tokenInfo?.accessToken}`}
        }).then(() => setResumeFavorite(!isResumeFavorite))
    }

    const showVacanciesModal = (event) => {
        event.stopPropagation();
        setInviteUserId(user.id);
        setVacanciesModalVisible(true);
    }
    const navigateToResume = () => {
        navigate(`/resumes/${id}`);
    }

    return (
        <div className="resume__container" onClick={navigateToResume}>
            <div className='resume__header__container'>
                <h2>{title}</h2>
                {tokenInfo?.company &&
                    <FavoriteButton onClick={handleClickChangeFavoriteStatus} is_favorite={isResumeFavorite}/>}
            </div>
            {user?.name && <p>{user?.name}</p>}
            <p className="resume__field">Расположение: {city}</p>
            <p className="resume__field">Опыт работы: {+experience} {formatExperience(+experience)}</p>
            {salary && <p className="resume__field">Ожидаемая зарплата : {salary}$</p>}
            {
                tokenInfo?.company && <Button onClick={showVacanciesModal}
                                              disabled={is_responded}
                                              className={is_active ? 'respond-button__disabled button__disabled' : 'respond-button'}
                >Пригласить</Button>
            }
        </div>
    );
};

export default Resume;
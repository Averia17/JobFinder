import React, {useState} from 'react';
import "./style.css"
import {Link} from "react-router-dom";
import FavoriteButton from "../../components/buttons/FavoriteButton";
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import axios from "axios";

const Resume = ({id, title, city, user, experience, salary, is_favorite}) => {
    const tokenInfo = useGetInfoFromToken();
    const [isResumeFavorite, setResumeFavorite] = useState(is_favorite);

    const handleClickChangeFavoriteStatus = (event) => {
        event.stopPropagation();
        axios.post('/api/favorite_resumes/', {resume: id}, {
            headers: {Authorization: `Bearer ${tokenInfo?.accessToken}`}
        }).then(() => setResumeFavorite(!isResumeFavorite))}

    return (
        <div className="resume__container">
            <Link to={{pathname: `/resumes/${id}`}}>
                <div className='resume__header__container'>
                    <h2>{title}</h2>
                    {tokenInfo?.company && <FavoriteButton onClick={handleClickChangeFavoriteStatus} is_favorite={isResumeFavorite}/>}
                </div>
                <p>{user?.name} {user?.email} </p>
                <p className="resume__field">Location: {city}</p>
                <p className="resume__field">Work experience: {experience} years</p>
                {salary && <p className="resume__field">Expected salary : {salary}$</p>}
            </Link>
        </div>
    );
};

export default Resume;
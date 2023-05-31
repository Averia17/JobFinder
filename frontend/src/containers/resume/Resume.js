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
            {tokenInfo?.company && <FavoriteButton onClick={handleClickChangeFavoriteStatus} is_favorite={isResumeFavorite}/>}
            <Link to={{pathname: `/resumes/${id}`}}>
                <h2>{title}</h2>
                <p>{user?.name} {user?.email} </p>
                <p className="resume__field">Location: {city}</p>
                <p className="resume__field">Work experience: {experience} years</p>
                <p className="resume__field">Expected salary : {salary}$</p>
            </Link>
        </div>
    );
};

export default Resume;
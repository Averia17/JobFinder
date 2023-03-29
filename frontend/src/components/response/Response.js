import React from 'react';
import {Link, useSearchParams} from "react-router-dom";
import {useParams} from "../../hooks/useParams/useParams";

const Response = (props) => {
    const {id, vacancy, status} = props;
    const [searchParams, setSearchParams] = useSearchParams();

    const handleClick = () => {
        searchParams.set('responseId', id);
        setSearchParams(searchParams);
    }

    return (
        <div>
            <Link to={{pathname: `/vacancies/${vacancy.id}`}}>
            <h1>{vacancy.title}</h1>
            </Link>
            <p>{status}</p>
            <button onClick={handleClick}>Send a message</button>
        </div>
    );
};

export default Response;
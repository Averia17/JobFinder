import React from 'react';
import {Link} from "react-router-dom";

const Response = (props) => {
    const {vacancy, status} = props;
    return (
        <div>
            <Link to={{pathname: `/vacancies/${vacancy.id}`}}>
            <h1>{vacancy.title}</h1>
            </Link>
            <p>{status}</p>
        </div>
    );
};

export default Response;
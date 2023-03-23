import React from 'react';

const Response = (props) => {
    const {vacancy, status} = props;
    return (
        <div>
            <h1>{vacancy}</h1>
            <p>{status}</p>
        </div>
    );
};

export default Response;
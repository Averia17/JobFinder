import React from 'react';

const Resume = ({title, city, position, experience, salary}) => {
    return (
        <div>
            <h1>{title}</h1>
            <h3>{position}</h3>
            <h3>{city}</h3>
            <h3>{experience} years</h3>
            <h3>{salary}</h3>
        </div>
    );
};

export default Resume;
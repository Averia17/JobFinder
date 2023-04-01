import React from 'react';

const Resume = ({title, city, position, experience, salary}) => {
    return (
        <div>
            <h2>{title}</h2>
            <p>{position}</p>
            <p>{city}</p>
            <p>Work experience: {experience} years</p>
            <p>Expected salary : {salary}$</p>
        </div>
    );
};

export default Resume;
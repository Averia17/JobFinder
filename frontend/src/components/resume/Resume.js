import React from 'react';
import "./style.css"

const Resume = ({title, city, position, experience, salary}) => {
    return (
        <div className="resume__container">
            <h2>{title}</h2>
            <p className="resume__field">Location: {city}</p>
            <p className="resume__field">Work experience: {experience} years</p>
            <p className="resume__field">Expected salary : {salary}$</p>
        </div>
    );
};

export default Resume;
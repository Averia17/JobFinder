import React from 'react';
import './style.css'

const SkillBlock = ({ skill }) => {
    return (
        <div className='skill_container'>
            {skill}
        </div>
    );
};

export default SkillBlock;
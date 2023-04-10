import React from 'react';
import './style.css'

const Button = ({ children, type, onClick }) => {
    return (
        <button onClick={onClick}
                className={`button__container ${type}`}>{children}</button>
    );
};

export default Button;
import React from 'react';
import './style.css'

const Button = ({ children, type, onClick, className, disabled, title }) => {
    return (
        <button onClick={onClick} disabled={disabled} title={title} type='button'
                className={`button__container ${disabled && 'button__disabled'} ${type} ${className}`}>{children}</button>
    );
};

export default Button;
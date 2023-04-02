import React from 'react';
import './style.css'

const NavBlock = ({ title, value, checked, onChange }) => {
    return (
        <div className='nav__block'>
            <input
                className='nav__input'
                name="radioButton"
                type="radio"
                value={value}
                defaultChecked={checked}
                onChange={onChange}
            />
            <label className='nav__label' htmlFor="radioButton">
                { title }
            </label>
        </div>
    );
};

export default NavBlock;
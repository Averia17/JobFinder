import React from 'react';
import NavBlock from "./NavBlock";

const Navbar = ({ setCurrentTab }) => {

    const handleChangeTab = event => {
        setCurrentTab(event.currentTarget.value)
    }

    return (
        <nav className='navbar__container'>
            <NavBlock title='Vacancies' value='vacancies' onChange={handleChangeTab} checked/>
            <NavBlock title='Managers' value='managers' onChange={handleChangeTab}/>
            <NavBlock title='Info' value='info' onChange={handleChangeTab}/>
        </nav>
    );
};

export default Navbar;
import React from 'react';
import NavBlock from "../../../nav-block/NavBlock";
import './style.css'

const Navbar = ({ isDirector, setCurrentTab }) => {
    const handleChangeTab = event => {
        setCurrentTab(event.currentTarget.value)
    }

    return (
        <nav className='navbar__container'>
            <NavBlock title='Вакансии' value='vacancies' onChange={handleChangeTab} checked/>
            {isDirector && <NavBlock title='Менеджеры' value='managers' onChange={handleChangeTab}/>}
            <NavBlock title='Информация' value='info' onChange={handleChangeTab}/>
        </nav>
    );
};

export default Navbar;
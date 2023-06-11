import React from 'react';
import NavBlock from "../../../components/nav-block/NavBlock";

const Navbar = ({ setCurrentTab }) => {
    const handleChangeTab = event => {
        setCurrentTab(event.currentTarget.value)
    }

    return (
        <nav className='navbar__container'>
            <NavBlock title='Резюме' value='resumes' onChange={handleChangeTab} checked/>
            <NavBlock title='Вакансии' value='vacancies' onChange={handleChangeTab}/>
        </nav>
    );
};

export default Navbar;
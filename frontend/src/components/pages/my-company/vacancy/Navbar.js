import React from 'react';
import NavBlock from "../../../nav-block/NavBlock";

const Navbar = ({ setCurrentTab }) => {

    const handleChangeTab = event => {
        setCurrentTab(event.currentTarget.value)
    }

    return (
        <nav className='navbar__container'>
            <NavBlock title='Отклики' value='responses' onChange={handleChangeTab} checked/>
            <NavBlock title='Просмотры' value='views' onChange={handleChangeTab}/>
        </nav>
    );
};

export default Navbar;
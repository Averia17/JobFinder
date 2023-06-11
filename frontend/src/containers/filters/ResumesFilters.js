import React, {useEffect, useState} from 'react';
import axios from "axios";
import Input from "../../components/inputs/Input";
import './style.css'
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import {Checkbox} from "@mui/material";
import {specializations} from "../../utils/utils";


const ResumesFilters = ({ changeSkillModalVisibility, handleChangeFilters, handleSearch }) => {
    const tokenInfo = useGetInfoFromToken();
    const [skills, setSkills] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        axios.get('/api/resumes/filters', {
            headers: {
                Authorization: `Bearer ${tokenInfo?.accessToken}`
            }})
            .then(({data}) => {
                setSkills(data.skills);
                setCities(data.city);
            })
    }, [])

    return (
        <form onSubmit={handleSearch} className='filters__container'>
            <div className="search__container">
                <input className="search__input" type="search" name='search' placeholder="Поиск"
                       onChange={handleChangeFilters}/>
            </div>
            <div className="filter__container">
                <Input className="filter__input" name='experience'type="text" placeholder="Опыт работы"
                       onChange={handleChangeFilters}/>
            </div>
            <div className="filter__container">
                <label className="filter__label" htmlFor='skills'>Навыки</label>
                {skills?.slice(0, 5)?.map(skill => (
                    <div className='skill__container'>
                        <Checkbox name='skills' value={skill} onChange={handleChangeFilters}/>
                        <label htmlFor='skills'>{skill}</label>
                    </div>
                ))}
                <p className='filter__showMore' onClick={changeSkillModalVisibility}>Показать больше</p>
            </div>
            <div className="filter__container">
                <label className="filter__label" htmlFor='city'>Город</label>
                <select className="filter__input" name='city' onChange={handleChangeFilters}>
                    <option></option>
                    {cities.map(city => (
                        <option value={city}>{city}</option>
                    ))}
                </select>
            </div>
            <div className="filter__container">
                <label className="filter__label" htmlFor='position'>Специализация</label>
                <select className="filter__input" name='position' onChange={handleChangeFilters}>
                    <option></option>
                    {specializations.map(({ items }) => (
                        items?.map(({text}) => <option value={text}>{text}</option>)
                    ))}
                </select>
            </div>
            <div className="filter__container">
                <label className="filter__label" htmlFor='salary'>Ожидаемая зарплата, $</label>
                <Input className="filter__input" name='salary' type='number' step='0.1' onChange={handleChangeFilters}/>
            </div>
            <input className="filter__submit" type="submit" value="Найти"/>
        </form>
    );
};

export default ResumesFilters;
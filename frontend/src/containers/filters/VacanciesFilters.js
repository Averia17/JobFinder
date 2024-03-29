import React, {useEffect, useState} from 'react';
import axios from "axios";
import Input from "../../components/inputs/Input";
import './style.css'


const VacanciesFilters = ({filters, setFilters, setSearch, handleSearch}) => {
    const [experienceOptions, setExperienceOptions] = useState([]);
    const [employmentTypes, setEmploymentTypes] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        axios.get('/api/vacancies/filters')
            .then(({data}) => {
                setExperienceOptions(data.experience_option);
                setEmploymentTypes(data.employment_type);
                setCompanies(data.company);
                setCities(data.city);
            })
    }, [])

    const handleChangeFilters = (event) => {
        setFilters({
            ...filters,
            [event.target.name]: event.target.value
        })
    }

    return (
        <form onSubmit={handleSearch} className='filters__container'>
            <div className="search__container">
                <input className="search__input" type="search" name='search' placeholder="Поиск"
                       onChange={e => setSearch(e.target.value)}/>
            </div>
            <div className="filter__container">
                <label className="filter__label" htmlFor='experience_option'>Опыт работы</label>
                <select className="filter__input" name='experience_option' onChange={handleChangeFilters}>
                    <option></option>
                    {experienceOptions.map(experienceOption => (
                        <option value={experienceOption[0]}>{experienceOption[1]}</option>
                    ))}
                </select>
            </div>
            <div className="filter__container">
                <label className="filter__label" htmlFor='employment_type'>Тип занятости</label>
                <select className="filter__input" name='employment_type' onChange={handleChangeFilters}>
                    <option></option>
                    {employmentTypes.map(employmentType => (
                        <option value={employmentType[0]}>{employmentType[1]}</option>
                    ))}
                </select>
            </div>
            <div className="filter__container">
                <label className="filter__label" htmlFor='company'>Компании</label>
                <select className="filter__input" name='company' onChange={handleChangeFilters}>
                    <option></option>
                    {companies.map(company => (
                        <option value={company.id}>{company.title}</option>
                    ))}
                </select>
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
                <label className="filter__label" htmlFor='salary'>Ожидаемая зарплата, BYN</label>
                <Input className="filter__input" name='salary' type='number' step='0.1' onChange={handleChangeFilters}/>
            </div>
            <input className="filter__submit" type="submit" value="Найти"/>
        </form>
    );
};

export default VacanciesFilters;
import React, {useEffect, useState} from 'react';
import axios from "axios";
import Input from "../../inputs/Input";
import './style.css'


const Filters = ({filters, setFilters, setSearch, handleSearch}) => {
    const [experienceOptions, setExperienceOptions] = useState([]);
    const [employmentTypes, setEmploymentTypes] = useState([]);
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        axios.get('/api/vacancies/filters')
            .then(({data}) => {
                setExperienceOptions(data.experience_option);
                setEmploymentTypes(data.employment_type);
                setCompanies(data.company);
            })
    }, [])

    const handleChangeFilters = (event) => {
        setFilters({
            ...filters,
            [event.target.name]: event.target.value
        })
    }

    return (
        <form onSubmit={handleSearch} style={{display: "flex", justifyContent: "center", flexDirection: "column"}}>
            <div className="search__container">
                <input className="search__input" type="search" placeholder="search"
                       onChange={e => setSearch(e.target.value)}/>
            </div>
            <div className="filter__container">
                <label className="filter__label" htmlFor='experience_option'>Experience</label>
                <select className="filter__input" name='experience_option' onChange={handleChangeFilters}>
                    <option></option>
                    {experienceOptions.map(experienceOption => (
                        <option value={experienceOption[0]}>{experienceOption[1]}</option>
                    ))}
                </select>
            </div>
            <div className="filter__container">
                <label className="filter__label" htmlFor='employment_type'>Employment type</label>
                <select className="filter__input" name='employment_type' onChange={handleChangeFilters}>
                    <option></option>
                    {employmentTypes.map(employmentType => (
                        <option value={employmentType[0]}>{employmentType[1]}</option>
                    ))}
                </select>
            </div>
            <div className="filter__container">
                <label className="filter__label" htmlFor='company'>Companies</label>
                <select className="filter__input" name='company' onChange={handleChangeFilters}>
                    <option></option>
                    {companies.map(company => (
                        <option value={company.id}>{company.title}</option>
                    ))}
                </select>
            </div>

            <div className="filter__container">
                <label className="filter__label" htmlFor='min_salary'>Min salary</label>
                <Input className="filter__input" name='min_salary' type='number' step='0.1' onChange={handleChangeFilters}/>
            </div>
            <div className="filter__container">
                <label className="filter__label" htmlFor='max_salary'>Max salary</label>
                <Input className="filter__input" name='max_salary' type='number' step='0.1' onChange={handleChangeFilters}/>
            </div>
            <input className="filter__submit" type="submit" value="Find"/>
        </form>
    );
};

export default Filters;
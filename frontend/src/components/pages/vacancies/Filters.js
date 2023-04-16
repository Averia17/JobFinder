import React, {useEffect, useState} from 'react';
import axios from "axios";
import Input from "../../inputs/Input";

const Filters = ({ filters, setFilters, setSearch, handleSearch }) => {
    const [experienceOptions, setExperienceOptions] = useState([]);
    const [employmentTypes, setEmploymentTypes] = useState([]);
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        axios.get('/api/vacancies/filters')
            .then(({ data }) => {
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
        <form onSubmit={handleSearch}>
            <div>
                <input type="search" onChange={e => setSearch(e.target.value)}/>
            </div>
            <div>
                <label htmlFor='experience_option'>Experience</label>
                <select name='experience_option' onChange={handleChangeFilters}>
                    <option></option>
                    {experienceOptions.map(experienceOption => (
                        <option value={experienceOption[0]}>{experienceOption[1]}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor='employment_type'>Employment type</label>
                <select name='employment_type' onChange={handleChangeFilters}>
                    <option></option>
                    {employmentTypes.map(employmentType => (
                        <option value={employmentType[0]}>{employmentType[1]}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor='company'>Companies</label>
                <select name='company' onChange={handleChangeFilters}>
                    <option></option>
                    {companies.map(company => (
                        <option value={company.id}>{company.title}</option>
                    ))}
                </select>
            </div>

            <div style={{display: "flex", flexDirection: "column"}}>
                <div>
                    <label htmlFor='min_salary'>Min salary</label>
                    <Input name='min_salary' type='number' step='0.1' onChange={handleChangeFilters}/>
                </div>
                <div>
                    <label htmlFor='max_salary'>Max salary</label>
                    <Input name='max_salary' type='number' step='0.1' onChange={handleChangeFilters}/>
                </div>
            </div>
            <input type="submit"/>
        </form>
    );
};

export default Filters;
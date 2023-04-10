import React, {useEffect, useState} from 'react';
import Input from "../inputs/Input";
import axios from "axios";
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import LanguageAdditionForm from "./LanguageAdditionForm";
import {languages} from "./utils";
import SkillBlock from "./SkillBlock";

const ResumeForm = () => {
    const {accessToken} = useGetInfoFromToken();
    const [userInfo, setUserInfo] = useState({});
    const [selectedLanguages, setSelectedLanguages] = useState({});
    const [deleteLanguageId, setDeleteLanguageId] = useState(0);
    const [languageId, setLanguageId] = useState(0);
    const [newLanguage, setNewLanguage] = useState({});
    const [languagesForms, setLanguagesForms] =
        useState([]);
    const [skills, setSkills] = useState([]);
    const [skill, setSkill] = useState(undefined);
    const [languagesIds, setLanguagesIds] = useState({});

    const handleSubmit = (event) => {
        event.preventDefault()
        setUserInfo({
            ...userInfo,
            skills: skills,
            languages: selectedLanguages
        })
        axios.post(`/api/resumes/`, {...userInfo}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    }

    const handleChange = event => {
        setUserInfo({
            ...userInfo,
            [event.currentTarget.name]: event.currentTarget.value,
        })
    }

    const handleClickAddLanguage = () => {
        const languagesLength = languagesForms.length;
        setLanguageId((prev) => prev + 1)
        setLanguagesForms([...languagesForms,
            <LanguageAdditionForm id={languagesLength}
                                  defaultLanguage={languages[languageId]}
                                  languagesIds={languagesIds}
                                  setLanguagesIds={setLanguagesIds}
                                  setNewLanguage={setNewLanguage}/>]);
        setLanguagesIds({...languagesIds, [languagesLength]: languages[languageId].title });
    }

    const renderLanguagesForms = () => {
        return languagesForms.map(languageForm => (
            languageForm
        ))
    }

    useEffect(() => {
        let newArray = languagesForms.slice(deleteLanguageId, 1);
        setLanguagesForms(newArray)
    }, [deleteLanguageId])

    useEffect(() => {
        setSelectedLanguages({...selectedLanguages, ...newLanguage})
    }, [newLanguage])

    console.log(languagesIds)

    const handleChangeSkill = (event) => {
        setSkill(event.currentTarget.value);
    }

    const handleAddSkill = (event) => {
        event.preventDefault();
        setSkills([...skills, skill]);
        setSkill('');
    }

    return (
        <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column"}}>
            <div>
                <label htmlFor='title'>Resume title</label>
                <Input name='title' type='text' onChange={handleChange} required/>
            </div>
            <div>
                <label htmlFor='city'>City</label>
                <Input name='city' type='text' onChange={handleChange} required/>
            </div>
            <div>
                <label htmlFor='position'>Position</label>
                <Input name='position' type='text' onChange={handleChange} required/>
            </div>
            <div>
                <label htmlFor='experience'>Experience</label>
                <Input name='experience' type='number' step='0.1' onChange={handleChange} required/>
            </div>
            <div>
                <label htmlFor='description'>Description</label>
                <Input name='description' type='text' onChange={handleChange} required/>
            </div>
            <div>
                <label htmlFor='education'>Education</label>
                <Input name='education' type='text' onChange={handleChange} required/>
            </div>
            <div>
                <label htmlFor='salary'>Salary expectations</label>
                <Input name='salary' type='number' onChange={handleChange} required/>
            </div>
            <div>
                <p>Languages</p>
                {languagesForms.length > 0 && renderLanguagesForms()}
                {languageId <= languages.length - 1 && <button type='button' onClick={handleClickAddLanguage}>Add one more language</button>}
            </div>
            <div>
                <p>Skills</p>
                <div>
                    <Input type='text' value={skill} onChange={handleChangeSkill}></Input>
                    <button onClick={handleAddSkill} type='button'>Add</button>
                </div>

                <div style={{display: 'flex'}}>
                    {
                        skills.map(skill => (
                            <SkillBlock skill={skill}/>
                        ))
                    }
                </div>

            </div>
            <div>
                <input type='submit'/>
            </div>
        </form>
    );
};

export default ResumeForm;
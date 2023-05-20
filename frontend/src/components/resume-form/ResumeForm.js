import React, {useEffect, useState} from 'react';
import Input from "../inputs/Input";
import axios from "axios";
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import LanguageAdditionForm from "./LanguageAdditionForm";
import {languages} from "./utils";
import SkillBlock from "./SkillBlock";
import {useNavigate} from "react-router";
import ErrorAlert from "../alerts/ErrorAlert";

const ResumeForm = () => {
    const {accessToken} = useGetInfoFromToken();
    const [userInfo, setUserInfo] = useState({});
    const navigate = useNavigate();
    const [selectedLanguages, setSelectedLanguages] = useState({});
    const [languagesForms, setLanguagesForms] = useState([]);
    const [file, setFile] = useState(undefined);
    const [image, setImage] = useState(undefined);
    const [skills, setSkills] = useState([]);
    const [skill, setSkill] = useState(undefined);
    const [resumeError, setResumeError] = useState(undefined);

    const [availableLanguages, setAvailableLanguages] = useState([...languages]);
    const [language, setLanguage] = useState(availableLanguages[0]?.title);
    const [newLanguage, setNewLanguage] = useState({});

    const handleSubmit = (event) => {
        event.preventDefault()
        axios.post(`/api/resumes/`, {
            ...userInfo,
            skills: skills,
            languages: selectedLanguages,
            file: file,
            image: image
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "multipart/form-data"
            }
        }).then(() => navigate('/resumes/my'))
            .catch(({response}) => {
                const error = response.data
                let message = "Resume could not be saved";
                if("user" in error)
                    message = error["user"];
                if(Array.isArray(error))
                    message = error[0]
                setResumeError(message)
            })
    }

    const handleChange = event => {
        setUserInfo({
            ...userInfo,
            [event.currentTarget.name]: event.currentTarget.value,
        })
    }
    const handleFileChange = event => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };
     const handleAvatarChange = event => {
        if (event.target.files) {
            setImage(event.target.files[0]);
        }
    };
    const handleClickAddLanguage = () => {
        const languagesLength = languagesForms.length;
        setLanguagesForms([...languagesForms,
            <LanguageAdditionForm id={languagesLength}
                                  language={language}
                                  languagesForms={languagesForms}
                                  setLanguagesForms={setLanguagesForms}
                                  selectedLanguages={selectedLanguages}
                                  setSelectedLanguages={setSelectedLanguages}
                                  setNewLanguage={setNewLanguage}/>]);
    }

    const renderLanguagesForms = () => {
        return languagesForms.map(languageForm => languageForm)
    }

    useEffect(() => {
        setSelectedLanguages({...selectedLanguages, ...newLanguage})
    }, [newLanguage])

    useEffect(() => {
        setAvailableLanguages([...languages].filter(language => {
            if (!(Object.keys(selectedLanguages).find(value => value === language.title))) {
                return language
            }
        }))
    }, [selectedLanguages])

    useEffect(() => {
        if (availableLanguages.length > 0) setLanguage(availableLanguages[0].title)
    }, [availableLanguages])

    const handleChangeSkill = (event) => {
        setSkill(event.currentTarget.value);
    }

    const handleAddSkill = (event) => {
        event.preventDefault();
        if (skill.length) {
            setSkills([...skills, skill]);
            setSkill('');
        }
    }

    return (
        <div style={{width: "100%"}}>
            <form onSubmit={handleSubmit}>
                <div className="resume__form__container">
                    <div className="column-1">
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
                            <Input name='position' type='text' onChange={handleChange}/>
                        </div>
                        <div>
                            <label htmlFor='experience'>Experience</label>
                            <Input name='experience' type='number' step='0.1' onChange={handleChange}/>
                        </div>
                        <div>
                            <label htmlFor='description'>Description</label>
                            <Input name='description' type='text' onChange={handleChange}/>
                        </div>
                        <div>
                            <label htmlFor='education'>Education</label>
                            <Input name='education' type='text' onChange={handleChange}/>
                        </div>
                        <div>
                            <label htmlFor='salary'>Salary expectations</label>
                            <Input name='salary' type='number' onChange={handleChange}/>
                        </div>
                    </div>
                    <div className="column-2">
                        <div>
                            <div>Languages</div>
                            {availableLanguages.length > 0 &&
                                <select name='language' value={availableLanguages[0]?.title}
                                        onChange={(event) => setLanguage(event.currentTarget.value)}>
                                    {
                                        availableLanguages.map(({id, title}) => {
                                            return <option key={id} value={title}>{title}</option>
                                        })
                                    }
                                </select>}
                            {languagesForms.length > 0 && renderLanguagesForms()}
                            {availableLanguages.length > 0 &&
                                <button type='button' onClick={handleClickAddLanguage}>Add language</button>}
                        </div>
                        <div>
                            <div>Skills</div>
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
                             <div>Upload Avatar</div>
                            <input type="file" onChange={handleAvatarChange} content="Upload Avatar"/>
                        </div>
                        <div>
                            <div>If you have your personal CV upload it</div>
                            <input type="file" onChange={handleFileChange} content="Upload CV"/>
                        </div>
                    </div>
                </div>
                <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                    <input className="create-resume__button" type='submit'/>
                </div>
            </form>
            {resumeError && <ErrorAlert error={resumeError} setError={setResumeError}/>}
        </div>
    );
};

export default ResumeForm;
import React, {useEffect, useState} from 'react';
import Input from "../inputs/Input";
import axios from "axios";
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import LanguageAdditionForm from "./LanguageAdditionForm";
import {languages, specializations} from "../../utils/utils";
import SkillBlock from "./SkillBlock";
import {useNavigate} from "react-router";
import ErrorAlert from "../alerts/ErrorAlert";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";


const ResumeForm = () => {
    const {accessToken} = useGetInfoFromToken();
    const [userInfo, setUserInfo] = useState({});
    const navigate = useNavigate();
    const [selectedLanguages, setSelectedLanguages] = useState({});
    const [languagesForms, setLanguagesForms] = useState([]);
    const [file, setFile] = useState(undefined);
    const [image, setImage] = useState(undefined);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [skill, setSkill] = useState(undefined);
    const [resumeError, setResumeError] = useState(undefined);

    const [availableLanguages, setAvailableLanguages] = useState([...languages]);
    const [language, setLanguage] = useState(availableLanguages[0]?.title);
    const [newLanguage, setNewLanguage] = useState({});


    const handleSubmit = (event) => {
        event.preventDefault();
        let formData = new FormData();
        for (let key in userInfo)
            formData.append(key, userInfo[key]);
        if (selectedSkills.length)
            formData.append("skills", selectedSkills.join(','))
        if (file)
            formData.append("file", file)
        if (image)
            formData.append("image", image)
        if (Object.keys(selectedLanguages).length)
            formData.append("languages", JSON.stringify(selectedLanguages))
        axios.post(`/api/resumes/`, formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "multipart/form-data"
            }
        }).then(() => navigate('/resumes/my'))
            .catch(({response}) => {
                const error = response.data
                let message = "Resume could not be saved";
                if (typeof error === 'object' && "user" in error)
                    message = error["user"];
                if (Array.isArray(error))
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
    const handleChangeDescription = text => {
        setUserInfo({
            ...userInfo,
            description: text,
        })
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
            setSelectedSkills([...selectedSkills, skill]);
            setSkill('');
        }
    }

    return (
        <div style={{width: "100%"}}>
            <form onSubmit={handleSubmit}>
                <div className="resume__form__container">
                    <div className="column-1">
                        <div>
                            <label htmlFor='title'>Название резюме</label>
                            <Input name='title' type='text' onChange={handleChange} required/>
                        </div>
                        <div>
                            <label htmlFor='city'>Город</label>
                            <Input name='city' type='text' onChange={handleChange} required/>
                        </div>
                        <div>
                            <label htmlFor='experience'>Опыт работы</label>
                            <Input name='experience' type='number' step='0.1' onChange={handleChange}/>
                        </div>

                        <div>
                            <label htmlFor='education'>Образование</label>
                            <Input name='education' type='text' onChange={handleChange}/>
                        </div>
                        <div>
                            <label htmlFor='salary'>Ожидаемая зарплата</label>
                            <Input name='salary' type='number' onChange={handleChange}/>
                        </div>
                        <div>
                            <label htmlFor='position'>Специализация</label>
                            <select name='position' onChange={handleChange}>
                                <option></option>
                                {specializations.map(({ items }) => (
                                    items?.map(({text}) => <option value={text}>{text}</option>)
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="column-2">
                        <div>
                            <div>Знание языков</div>
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
                                <button type='button' onClick={handleClickAddLanguage}>Добавить язык</button>}
                        </div>
                        <div>
                            <div>Навыки</div>
                            <div>
                                <Input type='text' value={skill} onChange={handleChangeSkill}></Input>
                                <button onClick={handleAddSkill} type='button'>Add</button>
                            </div>

                            <div className='skills' style={{display: 'flex'}}>
                                {
                                    selectedSkills?.map(skill => (
                                        <SkillBlock skill={skill}/>
                                    ))
                                }
                            </div>

                        </div>
                        <div className="upload-logo__container">
                            {image && <div className="logo__container"><img src={URL.createObjectURL(image)} alt=""/></div>}
                            <label htmlFor="logoId" className="upload-logo__button">
                                 <input onChange={handleAvatarChange}  name="" type="file" id="logoId" hidden />
                                  Загрузить аватар
                             </label>
                        </div>
                        <div className="upload-logo__container">
                            <div>Можете загрузить своё резюме</div>
                            <label htmlFor="cvID" className="upload-logo__button">
                                 <input onChange={handleFileChange}  name="" type="file" id="cvID" hidden />
                                  Загрузить резюме
                             </label>
                            {file && <div>Загружен файл {file.name}</div>}
                        </div>

                    </div>
                </div>
                <div className="resume__description">
                    <SimpleMDE
                        style={{"padding": "5px 10px", "font-size": "17px"}}
                    value={userInfo?.description}
                    onChange={(text) => handleChangeDescription(text)}/>
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
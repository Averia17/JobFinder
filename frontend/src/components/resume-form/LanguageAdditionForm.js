import React, {useEffect, useState} from 'react';
import {languageLevels, languages} from "../../utils/utils";
import Input from "../inputs/Input";
import Button from "../buttons/Button";

const LanguageAdditionForm = React.memo(function LanguageAdditionForm ({ language, selectedLanguages, setSelectedLanguages, languagesForms, setLanguagesForms, setNewLanguage }) {
    const [languageLevel, setLanguageLevel] = useState('A1');
    const result = { [language]: languageLevel }

    useEffect(() => {
        setNewLanguage(result);
    }, [language, languageLevel])

    const handleClickDeleteLanguage = () => {
        let f = [...languagesForms].filter(({ props }) => (
            props.language !== language
        ))
        const obj = {...selectedLanguages};
        delete obj[`${language}`]
        setLanguagesForms(f);
        setSelectedLanguages(obj);
    }

    return (
        <div className='addLanguageForm__container' key={language}>
            <Input type='text' value={language}/>
            <select name='languageLevel' onChange={(event) => setLanguageLevel(event.currentTarget.value)}
                    defaultValue='A1'>
                {
                    Object.entries(languageLevels).map((entry, index) => (
                        <option value={entry[0]}>{entry[1]}</option>
                    ))
                }
            </select>
            <Button onClick={handleClickDeleteLanguage}>Удалить</Button>
        </div>
    );
});

export default LanguageAdditionForm;
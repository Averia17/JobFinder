import React, {useEffect, useState} from 'react';
import Input from "../inputs/Input";
import {languageLevels, languages} from "./utils";

const LanguageAdditionForm = ({ language, setNewLanguage  }) => {
    const [languageLevel, setLanguageLevel] = useState(languageLevels[0]);
    const result = {
        [language.title]: languageLevel
    }

    useEffect(() => {
        setNewLanguage(result)
    }, [languageLevel])

    return (
        <div key={language.id}>
            <Input placeholder='Language' value={language.title}/>
            <select name='language' onChange={(event) => setLanguageLevel(event.currentTarget.value)}>
                {
                    Object.entries(languageLevels).map((entry, index) => (
                        <option value={entry[0]} defaultChecked={index === 0} defaultValue={index === 0}>{entry[1]}</option>
                    ))
                }
            </select>
            {/*<button type='button' onClick={handleClickDeleteLanguage}>Delete</button>*/}
        </div>
    );
};

export default LanguageAdditionForm;
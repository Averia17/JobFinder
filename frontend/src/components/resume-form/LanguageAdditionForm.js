import React, {useEffect, useState} from 'react';
import {languageLevels, languages} from "./utils";

const LanguageAdditionForm = React.memo(function LanguageAdditionForm ({ id, languagesIds, setLanguagesIds, defaultLanguage, setNewLanguage }) {
    const [language, setLanguage] = useState(defaultLanguage.title);
    const [languageLevel, setLanguageLevel] = useState('A1');
    const result = { [language]: languageLevel }

    useEffect(() => {
        setNewLanguage(result);
        setLanguagesIds({
            ...languagesIds,
            [id]: language,
        })
    }, [language, languageLevel])

    const selectedLanguages = Object.values(languagesIds);

    return (
        <div key={language.id}>
            <select name='language' onChange={(event) => setLanguage(event.currentTarget.value)}
                    defaultValue={defaultLanguage.title}>
                {
                    languages.map(({ id, title }) => {
                        return <option value={title} disabled={selectedLanguages.indexOf(title) >= 0}>{title}</option>
                    })
                }
            </select>
            <select name='languageLevel' onChange={(event) => setLanguageLevel(event.currentTarget.value)}
                    defaultValue='A1'>
                {
                    Object.entries(languageLevels).map((entry, index) => (
                        <option value={entry[0]}>{entry[1]}</option>
                    ))
                }
            </select>
            {/*<button type='button' onClick={handleClickDeleteLanguage}>Delete</button>*/}
        </div>
    );
});

export default LanguageAdditionForm;
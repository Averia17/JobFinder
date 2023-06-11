import React from 'react';
import Tab from "../../../components/tabs/Tab";
import Resume from "../../resume/Resume";

const FavoritesResumesTab = ({ resumes }) => {
    return (
        <Tab>
            {resumes?.length > 0 ?
                <div>{resumes?.map(resume => <Resume {...resume} />)}</div>
                :
                <div>У Вас нет избранных резюме</div>
            }
        </Tab>
    );
};

export default FavoritesResumesTab;
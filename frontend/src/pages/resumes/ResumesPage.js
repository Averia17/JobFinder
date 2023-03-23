import React, {useEffect, useState} from 'react';
import axios from "axios";
import Resume from "../../components/resume/Resume";
import {useNavigate} from "react-router";

const ResumesPage = () => {
    const navigate = useNavigate();
    const [resumes, setResumes] = useState([]);

    useEffect(() => {
        axios.get('/api/resumes')
            .then(({data}) => setResumes(data));
    }, [])

    const linkToCreateResumeForm = () => {
        navigate('/create-resume')
    }

    return (
        <div>
            <button onClick={linkToCreateResumeForm}>Create resume</button>
            {
                resumes.map(resume => (
                    <Resume {...resume}/>
                ))
            }
        </div>
    );
};

export default ResumesPage;
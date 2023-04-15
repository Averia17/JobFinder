import React, {useEffect, useState} from 'react';
import axios from "axios";
import Resume from "../../components/resume/Resume";
import {useNavigate} from "react-router";
import {useSearchParams} from "react-router-dom";

const ResumesPage = () => {
    const accessToken = localStorage.getItem('access_token');
    const navigate = useNavigate();
    const [resumes, setResumes] = useState([]);
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('user');

    useEffect(() => {
        axios.get(`/api/resumes${userId ? `?user=${userId}`: ''}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }})
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
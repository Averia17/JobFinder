import React, {useEffect, useState} from 'react';
import axios from "axios";
import Resume from "../../components/resume/Resume";
import {useNavigate} from "react-router";
import {useSearchParams} from "react-router-dom";
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";

const ResumesPage = () => {
    const tokenInfo = useGetInfoFromToken();
    const navigate = useNavigate();
    const [resumes, setResumes] = useState([]);
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('user');

    useEffect(() => {
        axios.get(`/api/resumes${userId ? `?user=${userId}`: ''}`, {
            headers: {
                Authorization: `Bearer ${tokenInfo?.accessToken}`
            }})
            .then(({data}) => setResumes(data));
    }, [])

    const linkToCreateResumeForm = () => {
        navigate('/create-resume')
    }

    return (
        <div>
            { !tokenInfo?.company &&
                <button onClick={linkToCreateResumeForm}>Create resume</button>
            }
            {
                resumes.map(resume => (
                    <Resume {...resume}/>
                ))
            }
        </div>
    );
};

export default ResumesPage;
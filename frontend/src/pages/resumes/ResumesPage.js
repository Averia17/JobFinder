import React, {useEffect, useState} from 'react';
import axios from "axios";
import Resume from "../../containers/resume/Resume";
import {useNavigate} from "react-router";
import {useSearchParams} from "react-router-dom";
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import "./style.css"
import Filters from "../../containers/filters/VacanciesFilters";
import ResumesFilters from "../../containers/filters/ResumesFilters";
import SkillsModal from "../../containers/filters/SkillsModal";
import {CircularProgress} from "@mui/material";
import VacanciesModal from "../../containers/resume/VacanciesModal";

const ResumesPage = () => {
    const tokenInfo = useGetInfoFromToken();
    const navigate = useNavigate();
    const [resumes, setResumes] = useState([]);
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('user');
    const [filters, setFilters] = useState({});
    const [search, setSearch] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [isSkillsModalVisible, setSkillsModalVisible] = useState(false);
    const [isVacanciesModalVisible, setVacanciesModalVisible] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [inviteUserId, setInviteUserId] = useState(undefined);


    const formatQueryParams = () => {
        const searchParams = new URLSearchParams();

        Object.entries(filters).forEach((entry, index, array) => {
            searchParams.append(entry[0], entry[1]);
        })
        if (search) searchParams.append("search", search);
        return searchParams.toString();
    }

    useEffect(() => {
        setLoading(true)
        axios.get(`/api/resumes?is_active=true`, tokenInfo?.accessToken && {
            headers: {
                'Authorization': `Bearer ${tokenInfo?.accessToken}`
            }
        })
            .then(({data}) => {
                setResumes(data)
            }).then(() => setTimeout(() => setLoading(false)));
    }, [])

    const handleSearch = (e) => {
        setLoading(true)
        e.preventDefault();
        axios.get(`/api/resumes?${formatQueryParams()}`, tokenInfo?.accessToken && {
            headers: {
                'Authorization': `Bearer ${tokenInfo?.accessToken}`
            }
        })
            .then(({data}) => {
                setResumes(data)
            }).then(() => setTimeout(() => setLoading(false)));
    }

    useEffect(() => {
        axios.get(`/api/resumes${userId ? `?user=${userId}`: ''}`, {
            headers: {
                Authorization: `Bearer ${tokenInfo?.accessToken}`
            }})
            .then(({data}) => setResumes(data));
    }, [])

    const handleChangeFilters = (event) => {
        if (event.target.name !== 'skills') {
            setFilters({
                ...filters,
                [event.target.name]: event.target.value,
            })
        } else {
            if (event.target.type === 'checkbox') {
                if (event.target.checked)
                    setSelectedSkills([...selectedSkills, event.target.value])
                else {
                    selectedSkills.splice(selectedSkills.indexOf(event.target.value), 1);
                    setSelectedSkills(selectedSkills);
                }
            }
            setFilters({
                ...filters,
                skills: selectedSkills
            })
        }
    }

    const changeSkillModalVisibility = () => {
        setSkillsModalVisible(!isSkillsModalVisible);
    }

    const hideVacanciesModal = () => {
        setVacanciesModalVisible(false);
    }

    return (
        <div className="resumesPage__container">
            {/*{ !tokenInfo?.company &&*/}
            {/*    <button className="submit__button" onClick={linkToCreateResumeForm}>Create resume</button>*/}
            {/*}*/}
            <div className='filters'>
                <ResumesFilters changeSkillModalVisibility={changeSkillModalVisibility}
                                handleChangeFilters={handleChangeFilters} handleSearch={handleSearch}/>
            </div>
            <div className="resumes__container">
            { !loading ?
                resumes?.length > 0 ? <div>
                        {resumes.map(resume => (
                            <Resume setVacanciesModalVisible={setVacanciesModalVisible}
                                    setInviteUserId={setInviteUserId}
                                    {...resume}/>
                        ))}</div>
                    :
                    <div className='resumes__container resumes__notFound'>Резюме не найдены</div>
                :  <div className="loading-spinner"><CircularProgress color="inherit" /></div>
            }
            </div>
            <SkillsModal isActive={isSkillsModalVisible} hideModal={changeSkillModalVisibility}
                         handleChangeFilters={handleChangeFilters} selectedSkills={selectedSkills} />
            <VacanciesModal isActive={isVacanciesModalVisible} hideModal={hideVacanciesModal} userId={inviteUserId} />
        </div>
    );
};

export default ResumesPage;
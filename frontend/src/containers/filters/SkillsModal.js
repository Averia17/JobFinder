import React, {useEffect, useState} from 'react';
import Modal from "../../components/modal/Modal";
import {Checkbox} from "@mui/material";
import axios from "axios";
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";

const SkillsModal = ({ isActive, hideModal, handleChangeFilters, selectedSkills }) => {
    const tokenInfo = useGetInfoFromToken();
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        axios.get('/api/resumes/filters', {
            headers: {
                Authorization: `Bearer ${tokenInfo?.accessToken}`
            }})
            .then(({data}) => {
                setSkills(data.skills);
            })
    }, [])


    return (
        <Modal isActive={isActive} handleClickHideModal={hideModal}>
            {skills.map(skill => (
                <div className='skill__container'>
                    <Checkbox checked={selectedSkills.includes(skill)} name='skills' value={skill} onChange={handleChangeFilters}/>
                    <label htmlFor='skills'>{skill}</label>
                </div>
            ))}
        </Modal>
    );
};

export default SkillsModal;
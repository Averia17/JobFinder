import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useNavigate, useParams} from "react-router";
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";
import "./style.css"
import logo from "../../assets/default_icon.png"
import {Document, Page} from 'react-pdf';
import {Link} from "react-router-dom";
import {pdfjs} from 'react-pdf';
import Button from "../../components/buttons/Button";
import FavoriteButton from "../../components/buttons/FavoriteButton";
import SkillBlock from "../../components/resume-form/SkillBlock";
import marked from "marked";
import {CircularProgress} from "@mui/material";
import {formatExperience, formatViewsCountString} from "../../services/services";
import LineChart from "../../components/chart/LineChart";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ResumePage = () => {
    const tokenInfo = useGetInfoFromToken();
    const navigate = useNavigate();
    const {id} = useParams();
    const [error, setError] = useState(undefined);

    const [resume, setResume] = useState(undefined);
    const [isResumeFavorite, setResumeFavorite] = useState(false);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true)
        axios.get(`/api/resumes/${id}`, {
            headers: {
                Authorization: `Bearer ${tokenInfo?.accessToken}`
            }
        })
            .then(({data}) => {
                setResume(data)
                setResumeFavorite(data?.is_favorite)
            }).then(() => setTimeout(() => setLoading(false), 0)).catch(() => setTimeout(() => setLoading(false), 0));
    }, [])

    const handleClickDeleteResume = () => {
        axios.delete(`/api/resumes/${resume?.id}/`, {
            headers: {Authorization: `Bearer ${tokenInfo.accessToken}`}
        }).then(() => window.location.reload()).catch(() => setError('Не удаётся удалить резюме'))
    }
    const handleClickChangeFavoriteStatus = (event) => {
        event.stopPropagation();
        axios.post('/api/favorite_resumes/', {resume: resume?.id}, {
            headers: {Authorization: `Bearer ${tokenInfo?.accessToken}`}
        }).then(() => setResumeFavorite(!isResumeFavorite))
    }

    const linkToCreateResumeForm = () => {
        navigate('/create-resume')
    }
    const handleAvatarChange = event => {
        if (event.target.files) {
            axios.patch(`/api/resumes/${resume.id}/`, {
                image: event.target.files[0]
            }, {
                headers: {
                    Authorization: `Bearer ${tokenInfo.accessToken}`,
                    "Content-Type": "multipart/form-data"
                }
            }).then(({data}) => {
                setResume({...resume, image: data.image});
            })
        }
    };

    const experience = +resume?.experience;

    return (
        <div className="resumePage__container">
            {!loading ?
                resume ?
                    <>
                        <div className="resume__header">
                            <div className='resume__header__info'>
                                <div className='resume__title__container'>
                                    <div className='resume__title'>
                                        <h1>{resume.user?.name} {resume.user?.email}</h1>
                                        <h4>{resume.user?.phone}</h4>
                                    </div>
                                    {tokenInfo?.company &&
                                        <FavoriteButton onClick={handleClickChangeFavoriteStatus}
                                                        is_favorite={isResumeFavorite}/>}
                                </div>
                                <h4>{resume.city}</h4>
                                {!tokenInfo?.company && <h4>Ваше резюме было просмотрено {resume?.views?.length} раз
                                    {formatViewsCountString(resume?.views?.length)}</h4>}
                                <div className='resume__header__button'>
                                    {resume?.user?.id === tokenInfo?.user_id &&
                                        <Button onClick={handleClickDeleteResume} type='danger'>Удалить</Button>}
                                </div>
                            </div>
                            <div className="resume__logo">
                                <div className="avatar__container"><img src={resume?.image || logo} alt=""/></div>
                                {tokenInfo?.user_id === resume?.user?.id &&
                                  <div className="upload-logo__container">
                                    <label htmlFor="resumeLogoId" className="upload-logo__button">
                                         <input onChange={handleAvatarChange}  name="" type="file" id="resumeLogoId" hidden />
                                          Загрузить аватар
                                     </label>
                                </div>}
                            </div>
                        </div>
                        <div className='resume__info'>
                            <h1>{resume.title}</h1>
                            <h4>Зарплатные ожидания: {resume?.salary} BYN</h4>
                            <div>Опыт работы: {experience} {formatExperience(experience)}</div>
                            {resume?.education && <div>Образование: {resume?.education}</div>}
                            {resume?.description && <div className="resume__parsed_description">
                                О себе:
                                <div className="editor-preview" dangerouslySetInnerHTML={{__html: marked.parse(resume?.description)}}></div>
                            </div>
                            }
                        </div>
                        <div className='resume__skills__container'>
                            <h2>Навыки</h2>
                            <div className='resume__skills'>
                                {resume?.skills?.map(skill => (
                                    skill.split(',').map(skill => <SkillBlock skill={skill}/>)
                                ))}
                            </div>
                        </div>
                        {!tokenInfo?.company &&
                        <div className='resume__views__container'>
                            <h2>Просмотры</h2>
                            {resume?.chartData?.length > 0 && <LineChart chartData={resume?.chartData} />}
                            {resume?.user?.id === tokenInfo?.user_id && resume?.views?.length > 0 ?
                                <div className="resume__views">{resume?.views?.map(view => (
                                    <div className="resume__view">
                                        <Link className="resume__company__link" to={`/companies/${view?.company__id}`}> {view?.company__title}</Link>:
                                        <div>{view?.count} раз</div>
                                    </div>
                                ))}
                                </div>
                                :
                                <div>Ваше резюме пока не просматривали</div>
                            }
                        </div>}
                        <div style={{width: "100%"}}>
                            <Document file={resume?.file}>
                                <Page pageNumber={1} renderTextLayer={false} width={1000}/>
                            </Document>
                            {resume?.file &&
                                <div className="open-cv__link__container">
                                    <Link to={resume?.file} className="open-cv__link">Открыть полное резюме</Link>
                                </div>}
                        </div>
                    </>
                    : <>
                        <div> У вас нет резюме</div>
                        <Button className="submit__button" onClick={linkToCreateResumeForm}>Создать резюме</Button>
                    </>
                :  <div className="loading-spinner"><CircularProgress color="inherit" /></div>
            }
        </div>
    );
};

export default ResumePage;
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
            });
        setLoading(false)
    }, [])

    const handleClickDeleteResume = () => {
        axios.delete(`/api/resumes/${resume?.id}/`, {
            headers: {Authorization: `Bearer ${tokenInfo.accessToken}`}
        }).then(() => window.location.reload()).catch(() => setError('Error deleting vacancy'))
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

    const formatViewsCountString = () => {
        let countOfViews = resume?.views?.length;
        const lastNumberOfViewsCount = +countOfViews.toString().charAt(countOfViews.length - 1);
        return lastNumberOfViewsCount >= 2 && lastNumberOfViewsCount <= 4 && 'a';
    }

    return (
        <div className="resume__container">
            {!loading ?
                resume ?
                    <>
                        <div className="resume__header">
                            <div className='resume__header__info'>
                                <h1>{resume.user?.name} {resume.user?.email}</h1>
                                <h4>{resume.user?.phone}</h4>
                                <h4>{resume.city}</h4>
                                <h4>Ваше резюме было просмотрено {resume?.views?.length} раз{formatViewsCountString()}</h4>
                                <div className='resume__header__button'>
                                    {resume?.user?.id === tokenInfo?.user_id &&
                                        <Button onClick={handleClickDeleteResume} type='danger'>Удалить</Button>}
                                    {tokenInfo?.company &&
                                        <FavoriteButton onClick={handleClickChangeFavoriteStatus} is_favorite={isResumeFavorite}/>}
                                </div>
                            </div>
                            <div className="resume__logo">
                                <div className="avatar__container"><img src={resume?.image || logo} alt=""/></div>
                                {tokenInfo?.user_id === resume?.user?.id &&
                                    <div><input type="file" onChange={handleAvatarChange} content="Update Avatar"/></div>}
                            </div>
                        </div>
                        <div className='resume__info'>
                            <h1>{resume.title}</h1>
                            <h4>Зарплатные ожидания: {resume?.salary}$</h4>
                            <div>Опыт работы: {experience} {experience> 4 ? 'лет' : experience === 1 ? 'год' : 'года'}</div>
                            <div>Образование: {resume?.education}</div>
                            <div>{resume?.description}</div>
                        </div>
                        <div className='resume__skills__container'>
                            <h2>Навыки</h2>
                            <div className='resume__skills'>
                                {resume?.skills?.map(skill => (
                                    skill.split(',').map(skill => <SkillBlock skill={skill}/>)
                                ))}
                            </div>
                        </div>
                        <div className='resume__views__container'>
                            <h2>Просмотры</h2>
                            {resume?.user?.id === tokenInfo?.user_id && resume?.views?.length > 0 ?
                                <div className="resume__views">Просмотры: {resume?.views?.map(view => (
                                    <div className="resume__view">
                                        <div><Link className="resume__company__link" to={`/companies/${view?.company__id}`}> {view?.company__title}</Link>: </div>
                                        <div>{view?.count} раз</div>
                                    </div>
                                ))}
                                </div>
                                :
                                <div>Ваше резюме пока не просматривали</div>
                            }
                        </div>
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
                : <div> Загрузка...</div>
            }
        </div>
    );
};

export default ResumePage;
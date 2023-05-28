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
    return (
        <div className="resumes__container">
            {!loading ?
                resume ?
                    <>
                        {resume?.user?.id === tokenInfo?.user_id &&
                            <Button onClick={handleClickDeleteResume} type='danger'>Удалить</Button>}
                        {tokenInfo?.company &&
                            <FavoriteButton onClick={handleClickChangeFavoriteStatus} is_favorite={isResumeFavorite}/>}
                        <div className="resume__header">
                            <div className="resume__logo">
                                <div className="avatar__container"><img src={resume?.image || logo} alt=""/></div>
                                {tokenInfo?.user_id === resume?.user?.id &&
                                    <div><input type="file" onChange={handleAvatarChange} content="Update Avatar"/></div>}
                            </div>
                            {resume?.user?.id === tokenInfo?.user_id && <div className="resume__views">Views: {resume?.views?.map(view => (
                                <div className="resume__view">
                                    <div><Link className="resume__company__link" to={`/companies/${view?.company__id}`}> {view?.company__title}</Link>: </div>
                                    <div>{view?.count} times</div>
                                </div>
                            ))}
                            </div>
                            }
                        </div>
                        <div>{resume.title}</div>
                        <div>{resume.user?.name} {resume.user?.email}</div>
                        <div>{resume.city}</div>
                        <div>{resume?.experience} years</div>
                        <div>{resume?.salary}</div>
                        <div>{resume?.education}</div>
                        <div>{resume?.description}</div>
                        <div>skills: {resume?.skills?.map(skill => <span>{skill} </span>)}</div>
                        <div></div>
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
                        <button className="submit__button" onClick={linkToCreateResumeForm}>Создать резюме</button>
                    </>
                : <div> Загрузка...</div>
            }
        </div>
    );
};

export default ResumePage;
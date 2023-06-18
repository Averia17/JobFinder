import React from 'react';
import './style.css'
import {formatViewsCountString} from "../../services/services";
import {useNavigate} from "react-router";

const View = (props) => {
    const navigate = useNavigate();
    const { user__id: id, user__email: email, count } = props;

    const navigateToUserResume = () => {
        if (props?.user__resume) {
            navigate(`/resumes/${props?.user__resume}`);
        }
    }

    return (
        <div className='viewBlock__container' key={id} onClick={navigateToUserResume}>
            {email || props?.user__name && <p>{props?.user__name} {email}</p>}
            <p>{count} раз{formatViewsCountString(count)}</p>
        </div>
    );
};

export default View;
import React from 'react';
import './style.css'

const View = (props) => {
    const { user__id: id, user__email: email, count } = props;
    return (
        <div className='viewBlock__container'>
            {email || props?.user__name && <p>{props?.user__name} {email}</p>}
            <p>{count} time{count > 1 && 's'}</p>
        </div>
    );
};

export default View;
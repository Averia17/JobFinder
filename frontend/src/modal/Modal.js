import React from 'react';
import './style.css'

const Modal = ({ isActive, handleClickHideModal, children }) => {
    return isActive && (
        <div className='modal' onClick={handleClickHideModal}>
            <div className='modal__content' onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

export default Modal;
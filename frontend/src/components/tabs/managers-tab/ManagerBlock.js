import React from 'react';
import Button from "../../buttons/Button";
import {useSearchParams} from "react-router-dom";

const ManagerBlock = (props) => {
    const { id, email } = props;
    const [searchParams, setSearchParams] = useSearchParams();

    const handleClickDeleteManager = () => {
        searchParams.set('manager', id);
        setSearchParams(searchParams)
    }


    return (
        <div key={id} className='manager__block'>
            <div className='managerName__container'>
                {props?.name && <p>{props?.name}</p>}
                <p>{email}</p>
            </div>
                <Button onClick={handleClickDeleteManager} type='danger'>Delete</Button>
        </div>
    );
};

export default ManagerBlock;
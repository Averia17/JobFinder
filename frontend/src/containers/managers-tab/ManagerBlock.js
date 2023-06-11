import React from 'react';
import Button from "../../components/buttons/Button";
import {useSearchParams} from "react-router-dom";
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";

const ManagerBlock = (props) => {
    const { id, email } = props;
    const tokenInfo = useGetInfoFromToken();
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
            {id !== tokenInfo?.user_id && tokenInfo?.is_director && <Button onClick={handleClickDeleteManager} type='danger'>удалить</Button>}
        </div>
    );
};

export default ManagerBlock;
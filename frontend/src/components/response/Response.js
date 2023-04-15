import React from 'react';
import {Link, useSearchParams} from "react-router-dom";
import {useParams} from "../../hooks/useParams/useParams";
import Button from "../buttons/Button";
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";

const Response = (props) => {
    const {id, status} = props;
    const tokenInfo = useGetInfoFromToken();
    const [searchParams, setSearchParams] = useSearchParams();

    const handleClick = () => {
        searchParams.set('responseId', id);
        setSearchParams(searchParams);
    }

    return (
        <div>
            <Link to={{pathname: `/vacancies/${props?.vacancy?.id}`}}>
            <h1>{props?.vacancy?.title}</h1>
            </Link>
            {props?.user?.name || props?.user?.email && <p>{props?.user?.name} {props?.user?.email}</p>}
            <p>{status}</p>
            <Button onClick={handleClick}>Send a message</Button>
            {tokenInfo?.company && <div>
                <Button type='success'>Accept</Button>
                <Button type='danger'>Reject</Button>
            </div>}
        </div>
    );
};

export default Response;
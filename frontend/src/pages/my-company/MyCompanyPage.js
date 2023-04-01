import React from 'react';
import {useGetInfoFromToken} from "../../hooks/useGetInfoFromToken/useGetInfoFromToken";

const MyCompanyPage = () => {
    const { company } = useGetInfoFromToken();
    return (
        <div>
            {company}
        </div>
    );
};

export default MyCompanyPage;
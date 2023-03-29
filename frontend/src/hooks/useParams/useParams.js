import {useSearchParams} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router";

const paramsNames = {
    responseId: 'responseId'
}

export const useParams = () => {
    const navigate = useNavigate();
    const [queryParams] = useSearchParams();


    const params = useMemo(() => {
        let responseId = queryParams.get(paramsNames.responseId) || undefined;

        return {
            responseId: responseId | undefined,
        };
    }, [queryParams]);

    const [state, setState] = useState(params);

    const setParams = (newParams) => {
        setState((prev) => ({ ...prev, ...newParams }));
    };

    useEffect(() => {
        setState((prev) => ({ ...prev, ...params }));
    }, [params]);

    useEffect(() => {
        Object.values(paramsNames).forEach((key) => {
            const value = state[key];

            if (value) {
                queryParams.set(key, value.toString());
            } else {
                queryParams.delete(key);
            }
        });
        navigate({ search: queryParams.toString() });

    }, [state]);


    return {
        ...state,
        setParams,
    };

}
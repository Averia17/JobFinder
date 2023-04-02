import jwt_decode from "jwt-decode";
export const useGetInfoFromToken = () => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
        const decodedToken = jwt_decode(accessToken);
        return {
            accessToken,
            ...decodedToken
        }
    } else {
        return null
    }

}
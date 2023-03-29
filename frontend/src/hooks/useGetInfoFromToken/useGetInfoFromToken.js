import jwt_decode from "jwt-decode";
export const useGetInfoFromToken = () => {
    const accessToken = localStorage.getItem('access_token');
    const decodedToken = jwt_decode(accessToken);
    return {
        ...decodedToken
    }
}
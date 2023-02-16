// const checkAuth = () => {
//
// }
// export default checkAuth;

import jwt_decode from "jwt-decode";

export const getUser = () => {
    const token = localStorage.getItem("access_token");
    if (token) {
        const decodedToken = jwt_decode(token);
        if (decodedToken.exp * 1000 > new Date().getTime()) {
            return decodedToken.id
        }
    }
}
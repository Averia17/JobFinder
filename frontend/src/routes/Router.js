import {BrowserRouter} from "react-router-dom";
import {Route, Routes} from "react-router";
import {
    authorizedUserRoutes,
    commonAuthorizedRoutes,
    directorRoutes,
    employeeRoutes,
    unauthorizedUserRoutes
} from "./router.config";
import {useGetInfoFromToken} from "../hooks/useGetInfoFromToken/useGetInfoFromToken";
import Header from "../components/header/Header";
import CompanyPage from "../pages/company/CompanyPage";
import VacanciesPage from "../pages/vacancies/VacanciesPage";
import VacancyPage from "../pages/vacancy/VacancyPage";
import ResumesPage from "../pages/resumes/ResumesPage";
import MainPage from "../pages/MainPage";
import {mapRoutes} from "./router.service";
import RegisterManagerPage from "../pages/register-manager/RegisterManagerPage";

const Router = () => {
    const tokenInfo = useGetInfoFromToken();
    return (
        <>
            <BrowserRouter>
                <Header/>
                <Routes>
                    <Route path='/companies/:id' element={<CompanyPage/>}/>
                    <Route path='/vacancies' element={<VacanciesPage/>}/>
                    <Route path='/vacancies/:id' element={<VacancyPage/>}/>
                    <Route path='/resumes' element={<ResumesPage/>}/>
                    <Route path='/register_manager' element={<RegisterManagerPage/>}/>
                    <Route path='/' element={<VacanciesPage/>}/>
                    { tokenInfo?.user_id && mapRoutes(commonAuthorizedRoutes) }
                    { !tokenInfo?.user_id && mapRoutes(unauthorizedUserRoutes) }
                    { tokenInfo?.user_id && (!tokenInfo?.company) && mapRoutes(authorizedUserRoutes) }
                    { tokenInfo?.company && mapRoutes(employeeRoutes) }
                    { tokenInfo?.company && tokenInfo?.is_director && mapRoutes(directorRoutes) }
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default Router;

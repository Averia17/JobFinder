import {BrowserRouter} from "react-router-dom";
import {Route, Routes} from "react-router";
import {authorizedUserRoutes, commonAuthorizedRoutes, employeeRoutes, unauthorizedUserRoutes} from "./router.config";
import {useGetInfoFromToken} from "../hooks/useGetInfoFromToken/useGetInfoFromToken";
import Header from "../components/header/Header";
import CompanyPage from "../pages/company/CompanyPage";
import VacanciesPage from "../pages/vacancies/VacanciesPage";
import VacancyPage from "../pages/vacancy/VacancyPage";
import ResumesPage from "../pages/resumes/ResumesPage";
import MainPage from "../pages/MainPage";
import {mapRoutes} from "./router.service";

const Router = () => {
    const tokenInfo = useGetInfoFromToken();
    console.log(tokenInfo)
    return (
        <>
            <BrowserRouter>
                <Header/>
                <Routes>
                    <Route path='/companies/:id' element={<CompanyPage/>}/>
                    <Route path='/vacancies' element={<VacanciesPage/>}/>
                    <Route path='/vacancies/:id' element={<VacancyPage/>}/>
                    <Route path='/resumes' element={<ResumesPage/>}/>
                    <Route path='/' element={<MainPage/>}/>
                    { tokenInfo?.user_id ? mapRoutes(commonAuthorizedRoutes): null }
                    { !tokenInfo?.user_id ? Object.keys(unauthorizedUserRoutes).map((key) => {
                        return (
                            <Route
                                key={key}
                                path={key}
                                element={unauthorizedUserRoutes[key].element}
                            />
                        );
                    }) : null }
                    { tokenInfo?.user_id && (!tokenInfo?.company) ? mapRoutes(authorizedUserRoutes) : null }
                    { tokenInfo?.company ? mapRoutes(employeeRoutes): null }
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default Router;

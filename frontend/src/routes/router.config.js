import MyCompanyPage from "../pages/my-company/MyCompanyPage";
import ProfilePage from "../pages/profile/ProfilePage";
import ResponsesPage from "../pages/responses/ResponsesPage";
import ResumeForm from "../components/resume-form/ResumeForm";
import ResumesPage from "../pages/resumes/ResumesPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import VacancyForm from "../components/pages/my-company/vacancy-form/VacancyForm";
import FavoritesPage from "../pages/favorites/FavoritesPage";

export const routesElements = {
    login: '/login',
    registration: '/register',
    company: '/company',
    profile: '/profile',
    favorites: '/favorites',
    responses: '/responses',
    resumes: '/resumes',
    createResume: '/create-resume',
    createVacancy: '/create-vacancy',
}

export const commonAuthorizedRoutes = {
    [routesElements.profile]: {
        element: <ProfilePage/>,
    },
    [routesElements.favorites]: {
        element: <FavoritesPage/>,
    },
    [routesElements.resumes]: {
        element: <ResumesPage/>,
    },
}

export const employeeRoutes = {
    [routesElements.company]: {
        element: <MyCompanyPage/>,
    },
}

export const directorRoutes = {
    [routesElements.createVacancy]: {
        element: <VacancyForm/>,
    },
}

export const authorizedUserRoutes = {
    [routesElements.responses]: {
        element: <ResponsesPage/>,
    },
    [routesElements.createResume]: {
        element: <ResumeForm/>,
    },
}

export const unauthorizedUserRoutes = {
    [routesElements.login]: {
        element: <LoginPage/>,
    },
    [routesElements.registration]: {
        element: <RegisterPage/>,
    },
}
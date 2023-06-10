import MyCompanyPage from "../pages/my-company/MyCompanyPage";
import ProfilePage from "../pages/profile/ProfilePage";
import ResponsesPage from "../pages/responses/ResponsesPage";
import ResumeForm from "../components/resume-form/ResumeForm";
import ResumesPage from "../pages/resumes/ResumesPage";
import LoginPage from "../pages/authorization/LoginPage";
import RegisterPage from "../pages/authorization/RegisterPage";
import VacancyForm from "../components/pages/my-company/vacancy-form/VacancyForm";
import FavoritesPage from "../pages/favorites/FavoritesPage";
import ResumePage from "../pages/resume/ResumePage";

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
    resume: '/resumes/:id'
}

export const commonAuthorizedRoutes = {
    [routesElements.profile]: {
        element: <ProfilePage/>,
    },
    [routesElements.favorites]: {
        element: <FavoritesPage/>,
    },
}

export const employeeRoutes = {
    [routesElements.company]: {
        element: <MyCompanyPage/>,
    },
    [routesElements.resumes]: {
        element: <ResumesPage/>,
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
    [routesElements.resume]: {
        element: <ResumePage/>,
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
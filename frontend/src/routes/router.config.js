import MyCompanyPage from "../pages/my-company/MyCompanyPage";
import ProfilePage from "../pages/profile/ProfilePage";
import ResponsesPage from "../pages/responses/ResponsesPage";
import ResumeForm from "../components/resume-form/ResumeForm";
import ResumesPage from "../pages/resumes/ResumesPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

export const routesElements = {
    login: '/login',
    registration: '/register',
    company: '/company',
    profile: '/profile',
    responses: '/responses',
    resumes: '/resumes',
    createResume: '/create-resume',
}

export const commonAuthorizedRoutes = {
    [routesElements.profile]: {
        element: <ProfilePage/>,
    },
}

export const employeeRoutes = {
    [routesElements.company]: {
        element: <MyCompanyPage/>,
    },
}

export const authorizedUserRoutes = {
    [routesElements.responses]: {
        element: <ResponsesPage/>,
    },
    [routesElements.createResume]: {
        element: <ResumeForm/>,
    },
    [routesElements.resumes]: {
        element: <ResumesPage/>,
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
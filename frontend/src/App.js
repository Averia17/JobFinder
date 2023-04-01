import axios from "axios";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";

import './App.css';
import Header from "./components/header/Header";
import CompanyPage from "./pages/company/CompanyPage";
import VacanciesPage from "./pages/vacancies/VacanciesPage";
import VacancyPage from "./pages/vacancy/VacancyPage";
import ResumesPage from "./pages/resumes/ResumesPage";
import ResumeForm from "./components/resume-form/ResumeForm";
import ResponsesPage from "./pages/responses/ResponsesPage";
import ProfilePage from "./pages/profile/ProfilePage";
import Router from "./routes/Router";

axios.defaults.baseURL = 'http://localhost:8000'

const App = () => {
   // useEffect(() => {
   //      if (localStorage.getItem('access_token'))
   //          checkAuth();
   //  }, [])
  return (
    <div className="App">
      <Router/>
    </div>
  );
}

export default App;

import {BrowserRouter as Router} from "react-router-dom";
import {Route, Routes} from "react-router";
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

axios.defaults.baseURL = 'http://localhost:8000'

const App = () => {
   // useEffect(() => {
   //      if (localStorage.getItem('access_token'))
   //          checkAuth();
   //  }, [])
  return (
    <div className="App">
      <Router>
        <Header/>
        <Routes>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='/companies/:id' element={<CompanyPage/>}/>
          <Route path='/vacancies' element={<VacanciesPage/>}/>
          <Route path='/vacancies/:id' element={<VacancyPage/>}/>
          <Route path='/resumes' element={<ResumesPage/>}/>
          <Route path='/create-resume' element={<ResumeForm/>}/>
          <Route path='/responses' element={<ResponsesPage/>}/>
          <Route path='/profile' element={<ProfilePage/>}/>
          <Route path='/' element={<MainPage/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

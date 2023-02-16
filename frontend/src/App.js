import {BrowserRouter as Router} from "react-router-dom";
import {Route, Routes} from "react-router";
import axios from "axios";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";

import './App.css';
import Header from "./components/Header";

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
          <Route path='/' element={<MainPage/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

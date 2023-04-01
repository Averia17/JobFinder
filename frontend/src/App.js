import axios from "axios";
import './App.css';
import Router from "./routes/Router";

axios.defaults.baseURL = 'http://localhost:8000'

const App = () => {
    return (
        <div className="App">
            <Router/>
        </div>
    );
}

export default App;

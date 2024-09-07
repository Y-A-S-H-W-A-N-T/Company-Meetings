import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import axios from 'axios';
import Dash from './pages/dash';
import Available from './pages/availability';
import setAvailability from './pages/SetAvailability';
import Employees from './pages/employee';
import Employee_Availability from './pages/employee_availability';
import Meetings from './pages/meetings';

axios.defaults.baseURL = 'https://company-meetings.onrender.com/'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' Component={Home}/>
          <Route path='/dash' Component={Dash}/>
          <Route path='/available' Component={Available}/>
          <Route path='/available/:day' Component={setAvailability}/>
          <Route path='/employees' Component={Employees}/>
          <Route path='/employees/:id' Component={Employee_Availability}/>
          <Route path='/meetings' Component={Meetings}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;


import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Permissions from './components/Permission';
import Users from './components/Users';
import Dashboard from './pages/Dashboard';

function Routers() {
  return (
   
     <Routes>
      <Route path='/permissions' exact element={<Permissions />}/>
      <Route path='/' exact element={<Users />} />
     </Routes>
  );
}

export default Routers;

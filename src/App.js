import logo from './logo.svg';
import DataTable from './DataTable';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Login';
import TotalTable from './TotalTable';
import Nav from './Nav';

function App() {
  return (
<BrowserRouter>
          <Routes>
    <Route path="/"  element={<Nav/>}>
    <Route index element={<DataTable/>}></Route>
    <Route path="/all" index element={<TotalTable/>}></Route>

    </Route>
    <Route path="/login" index element={<Login/>}></Route>

    </Routes>
    </BrowserRouter>

  );
}

export default App;

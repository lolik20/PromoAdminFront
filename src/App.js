import logo from './logo.svg';
import DataTable from './DataTable';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Login';
import TotalTable from './TotalTable';
import Nav from './Nav';
import DataTableUZ from './DataTableUZ';
import QrTable from './QrTable';
import TotalTableQR from './TotalTableQR';

function App() {
  return (
<BrowserRouter>
          <Routes>
    <Route path="/"  element={<Nav/>}>
    <Route index element={<DataTable/>}></Route>
    <Route path="/all" index element={<TotalTable/>}></Route>
    <Route path='/uz' element={<DataTableUZ></DataTableUZ>}></Route>
    <Route path="/qr" element={<QrTable></QrTable>}></Route>
    <Route path="/allqr" element={<TotalTableQR></TotalTableQR>}></Route>

    </Route>
    <Route path="/login" index element={<Login/>}></Route>

    </Routes>
    </BrowserRouter>

  );
}

export default App;

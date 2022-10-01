import logo from './logo.svg';
import DataTable from './DataTable';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Login';

function App() {
  return (
    <div className="container">

          <Routes>

    <Route path="/" index element={<DataTable></DataTable>}></Route>
    <Route path="/login" index element={<Login></Login>}></Route>

    </Routes>
    </div>

  );
}

export default App;

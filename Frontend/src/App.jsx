import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx";
// Importa otras páginas cuando las crees

function App() {
  return (
    <>
    
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Otras rutas, por ejemplo: */}
        {/* <Route path="/register" element={<Register />} /> */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Equipos from "./pages/Equipos";
import CrearEquipo from "./pages/CrearEquipo";


const RutaPrivada = ({ children }) => {
  const { estaAutenticado } = useAuth();
  return estaAutenticado() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          <Route path="/equipos" element={<RutaPrivada><Equipos /></RutaPrivada>} />
          <Route path="/equipos/crear" element={<RutaPrivada><CrearEquipo /></RutaPrivada>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

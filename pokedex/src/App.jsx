import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Equipos from "./pages/Equipos";
import CrearEquipo from "./pages/CrearEquipo";
import AgregarPokemon from "./pages/AgregarPokemon";
import EditarPokemon from "./pages/EditarPokemon";
import Navbar from "./components/Navbar";
import TodosLosPokemon from "./pages/TodosLosPokemones";

import AdminPokemon from "./pages/admin/AdminPokemon";
import AdminMovimientos from "./pages/admin/AdminMovimientos";
import AdminItems from "./pages/admin/AdminItems";
import AdminUsuarios from "./pages/admin/AdminUsuarios";

const RutaPrivada = ({ children }) => {
  const { estaAutenticado } = useAuth();
  return estaAutenticado() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/pokemones" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          <Route path="/pokemones" element={<RutaPrivada><TodosLosPokemon /></RutaPrivada>} />
          <Route path="/equipos" element={<RutaPrivada><Equipos /></RutaPrivada>} />
          <Route path="/equipos/crear" element={<RutaPrivada><CrearEquipo /></RutaPrivada>} />
          <Route path="/equipos/:id/agregar/:slot" element={<RutaPrivada><AgregarPokemon /></RutaPrivada>} />
          <Route path="/equipos/editar/:id" element={<RutaPrivada><EditarPokemon /></RutaPrivada>} />

          <Route path="/admin/pokemon" element={<RutaPrivada><AdminPokemon /></RutaPrivada>} />
          <Route path="/admin/movimientos" element={<RutaPrivada><AdminMovimientos /></RutaPrivada>} />
          <Route path="/admin/items" element={<RutaPrivada><AdminItems /></RutaPrivada>} />
          <Route path="/admin/usuarios" element={<RutaPrivada><AdminUsuarios /></RutaPrivada>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

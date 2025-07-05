import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import pokebola from "../assets/pokeball.png";

function Registro() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/registro", { username, email, password });
      navigate("/login");
    } catch (error) {
      console.error("Error al registrar", error);
      alert("Error al registrarse");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="p-4 rounded shadow bg-white" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="text-center mb-3">Registro</h2>
        <div className="text-center mb-3">
          <img src={pokebola} alt="Pokebola" style={{ width: "60px" }} />
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            className="form-control mb-2"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary w-100">Registro</button>
        </form>
        <p className="mt-3 text-center">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default Registro;

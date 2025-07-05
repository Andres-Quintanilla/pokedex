import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function CrearEquipo() {
    const [nombre, setNombre] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nombre || nombre.trim().length < 1) {
            alert("Debes ingresar un nombre para el equipo");
            return;
        }

        try {
            await api.post("/equipos", { nombre });
            navigate("/equipos");
        } catch (error) {
            console.error("Error al crear el equipo", error);
            alert("No se pudo crear el equipo");
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <button
                className="btn btn-link position-absolute top-0 start-0 m-5 text-decoration-none"
                onClick={() => navigate(-1)}
            >
                ← Volver
            </button>
            <div className="p-4 rounded shadow bg-white" style={{ width: "100%", maxWidth: "400px" }}>
                <h3 className="text-center mb-4">Crear nuevo equipo</h3>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Nombre del equipo"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                        <button type="submit" className="btn btn-success w-100">
                            Crear
                        </button>
                    </form>
            </div>
        </div>
    );
}

export default CrearEquipo;

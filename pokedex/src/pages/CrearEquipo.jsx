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
        <div className="container py-5">
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <h3 className="fw-bold m-0">Equipo</h3>
                <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>← Volver</button>
            </div>

            <div className="p-4 rounded shadow bg-white mx-auto" style={{ maxWidth: "500px" }}>
                <div className="text-center mb-3">
                    <h4 className="fw-bold">Crear nuevo equipo</h4>
                </div>

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

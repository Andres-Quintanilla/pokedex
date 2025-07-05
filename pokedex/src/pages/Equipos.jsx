import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import EquipoCard from "../components/EquipoCard";

function Equipos() {
    const [equipos, setEquipos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/equipos")
        .then(res => setEquipos(res.data))
        .catch(() => alert("Error al cargar los equipos"));
    }, []);

    const handleNuevoEquipo = () => {
        navigate("/equipos/crear");
    };

    return (
        <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Mis Equipos</h2>
            <button className="btn btn-success" onClick={handleNuevoEquipo}>
            Crear equipo
            </button>
        </div>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
            {equipos.map((equipo) => (
            <div className="col" key={equipo.id}>
                <EquipoCard equipo={equipo}/>
            </div>
            ))}
        </div>
        </div>
    );
}

export default Equipos;

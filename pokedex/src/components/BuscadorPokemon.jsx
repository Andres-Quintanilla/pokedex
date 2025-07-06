import { useEffect, useState } from "react";
import api from "../api/axios";

function BuscadorPokemon({ seleccionado, setSeleccionado }) {
    const [busqueda, setBusqueda] = useState("");
    const [pokemones, setPokemones] = useState([]);

    useEffect(() => {
        api.get("/pokemones")
            .then(res => setPokemones(res.data))
            .catch(() => alert("Error al cargar pokemones"));
    }, []);

    const pokemonesFiltrados = pokemones.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <>
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Buscar Pokémon..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
            />

            <div className="d-flex gap-2 flex-wrap justify-content-center mb-4">
                {pokemonesFiltrados.map(p => (
                    <div
                        key={p.id}
                        onClick={() => setSeleccionado(p)}
                        title={p.nombre}
                        style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "8px",
                            overflow: "hidden",
                            backgroundColor: "#f0f0f0",
                            padding: "4px",
                            border: seleccionado?.id === p.id ? "2px solid #007bff" : "2px solid transparent",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <img
                            src={`http://localhost:3000${p.imagen}`}
                            alt={p.nombre}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/fallback.png";
                            }}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain"
                            }}
                        />
                    </div>
                ))}
            </div>
        </>
    );
}

export default BuscadorPokemon;

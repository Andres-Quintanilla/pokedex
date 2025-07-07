import { useEffect, useState } from "react";
import api from "../api/axios";

function BuscadorPokemon({ setSeleccionado }) {
    const [busqueda, setBusqueda] = useState("");
    const [pokemones, setPokemones] = useState([]);
    const [mostrarDropdown, setMostrarDropdown] = useState(false);

    useEffect(() => {
        api.get("/pokemones")
        .then(res => setPokemones(res.data))
        .catch(() => alert("Error al cargar pokemones"));
    }, []);

    const pokemonesFiltrados = pokemones.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    const seleccionarPokemon = (pokemon) => {
        setSeleccionado(pokemon);
        setBusqueda("");
        setMostrarDropdown(false);
    };

    return (
        <div style={{ position: "relative", maxWidth: "400px", margin: "0 auto" }}>
        <input
            type="text"
            className="form-control mb-2"
            placeholder="Buscar Pokémon..."
            value={busqueda}
            onChange={(e) => {
            setBusqueda(e.target.value);
            setMostrarDropdown(true);
            }}
            onFocus={() => setMostrarDropdown(true)}
            onBlur={() => setTimeout(() => setMostrarDropdown(false), 200)}
        />

        {mostrarDropdown && pokemonesFiltrados.length > 0 && (
            <ul
            className="list-group"
            style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 1000,
                maxHeight: "250px",
                overflowY: "auto"
            }}
            >
            {pokemonesFiltrados.map(p => (
                <li
                key={p.id}
                className="list-group-item list-group-item-action d-flex align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => seleccionarPokemon(p)}
                >
                <img
                    src={`http://localhost:3000${p.imagen}`}
                    alt={p.nombre}
                    onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/fallback.png";
                    }}
                    style={{ width: "30px", height: "30px", marginRight: "10px", objectFit: "contain" }}
                />
                {p.nombre}
                </li>
            ))}
            </ul>
        )}
        </div>
    );
}

export default BuscadorPokemon;

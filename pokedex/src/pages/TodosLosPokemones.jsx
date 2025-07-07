import { useEffect, useState } from "react";
import api from "../api/axios";

const TodosLosPokemon = () => {
    const [pokemon, setPokemon] = useState([]);

    const cargarPokemon = async () => {
        try {
        const res = await api.get("/pokemones");
        setPokemon(res.data);
        } catch (err) {
        alert("Error al cargar Pokémon", err);
        }
    };

    useEffect(() => {
        cargarPokemon();
    }, []);

    return (
        <div className="container mt-4">
        <h2>Todos los Pokémon</h2>
        <div className="row">
            {pokemon.map((p) => (
            <div key={p.id} className="col-md-3 mb-4">
                <div className="card shadow">
                <img
                    src={`http://localhost:3000${p.imagen}`}
                    className="card-img-top"
                    alt={p.nombre}
                    style={{ height: 150, objectFit: "contain", backgroundColor: "#f8f9fa" }}
                    />

                <div className="card-body">
                    <h5 className="card-title">{p.nombre}</h5>
                    <p className="card-text">
                    {p.tipos?.map((t) => (
                        <span key={t.id} className="badge bg-primary me-1">{t.nombre}</span>
                    ))}
                    </p>
                </div>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
};

export default TodosLosPokemon;

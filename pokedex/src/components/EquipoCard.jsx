import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function EquipoCard({ equipo }) {
    const navigate = useNavigate();

    const eliminarPokemon = async (pokemonId) => {
        if(!window.confirm("¿Estás seguro de sacar este pokemon del equipo?")) return;

        try {
            await api.patch(`/pokemones-personalizados/${pokemonId}`, {
            equipoId: null,
            posicion: null
            });
            window.location.reload();
        } catch (error) {
            console.error("Error al eliminar el pokemon", error);
            alert("No se puede eliminar el pokemon del equipo")
        }
    };

    return (
        <div className="card p-3 shadow-sm position-relative d-flex flex-column justify-content-center" style={{ minHeight: "250px" }}>
            <h5 className="position-absolute top-0 start-0 m-2">{equipo.nombre}</h5>

            <div className="d-flex justify-content-between gap-2"
            >
                {[...Array(6)].map((_, index) => {
                    const pokemon = equipo.PokemonPersonalizados?.[index];

                    return (
                        <div
                            key={index}
                            className="border d-flex align-items-center justify-content-center"
                            style={{
                                width: "100px",
                                height: "100px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                backgroundColor: "#f8f9fa",
                            }}
                            onClick={() => navigate(`/equipos/${equipo.id}/agregar/${index}`)}
                        >
                            {pokemon ? (
                                <>
                                    <img
                                        src={pokemon.pokemon?.imagen || "/default.png"}
                                        alt={pokemon.pokemon?.nombre}
                                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                                        onClick={() => navigate(`/equipos/${equipo.id}/editar/${pokemon.id}`)}
                                    />
                                    <button
                                        onClick={() => eliminarPokemon(pokemon.id)}
                                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 px-2 py-0"
                                        style={{ fontSize: "0.8rem", lineHeight: "1" }}
                                    >
                                        ×
                                    </button>
                                </>
                            ) : (
                                <span style={{ fontSize: "1.5rem", color: "#999" }}
                                onClick={() => navigate(`/equipos/${equipo.id}/agregar/${index}`)}
                                >+</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default EquipoCard;

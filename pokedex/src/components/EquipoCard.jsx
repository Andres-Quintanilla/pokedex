import { useNavigate } from "react-router-dom";

function EquipoCard({ equipo }) {
    const navigate = useNavigate();

    const pokemonesOrdenados = [...(equipo.pokemonesPersonalizados || [])]
        .filter(p => p.posicion !== null && p.posicion !== undefined)
        .sort((a, b) => a.posicion - b.posicion);

    return (
        <div className="card p-3 shadow-sm position-relative d-flex flex-column justify-content-center" style={{ minHeight: "250px" }}>
            <h5 className="position-absolute top-0 start-0 m-2">{equipo.nombre}</h5>

            <div className="d-flex justify-content-between gap-2">
                {[...Array(6)].map((_, index) => {
                    const pokemon = pokemonesOrdenados.find(p => p.posicion === index);
                    return (
                        <div
                            key={index}
                            className="border d-flex align-items-center justify-content-center position-relative"
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
                                        src={`http://localhost:3000${pokemon.pokemon?.imagen}`}
                                        alt={pokemon.pokemon?.nombre}
                                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/equipos/editar/${pokemon.id}`);
                                        }}
                                    />
                                </>
                            ) : (
                                <span style={{ fontSize: "1.5rem", color: "#999" }}>+</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default EquipoCard;

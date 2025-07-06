import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import api from "../api/axios";
import BuscadorPokemon from "../components/BuscadorPokemon";

function EditarPokemon() {
    const { id } = useParams(); 
    const navigate = useNavigate();

    const [datos, setDatos] = useState(null);
    const [evs, setEvs] = useState({ hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 });
    const [ivs, setIvs] = useState({ hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 });

    const [items, setItems] = useState([]);
    const [itemSeleccionado, setItemSeleccionado] = useState("");

    const [movimientos, setMovimientos] = useState([]);
    const [movimientosSeleccionados, setMovimientosSeleccionados] = useState(["", "", "", ""]);

    const [habilidades, setHabilidades] = useState([]);
    const [habilidadSeleccionada, setHabilidadSeleccionada] = useState("");

    const [naturalezas, setNaturalezas] = useState([]);
    const [naturalezaSeleccionada, setNaturalezaSeleccionada] = useState("");

    useEffect(() => {
        api.get(`/pokemones-personalizados/${id}`).then(res => {
            const p = res.data;
            setDatos(p);
            setEvs(p.evs);
            setIvs(p.ivs);
            setItemSeleccionado(p.item);
            setHabilidadSeleccionada(p.habilidad?.id);
            setNaturalezaSeleccionada(p.naturaleza?.id);
            setMovimientosSeleccionados(p.movimientos.map(m => m.id));
        });

        api.get("/items").then(res => setItems(res.data));
        api.get("/movimientos").then(res => setMovimientos(res.data));
        api.get("/naturalezas").then(res => setNaturalezas(res.data));
    }, [id]);

    useEffect(() => {
        if (datos?.pokemon?.id) {
            api.get(`/pokemones/${datos.pokemon.id}/habilidades`).then(res => setHabilidades(res.data));
        }
    }, [datos]);

    const handleEvChange = (stat, value) => {
        setEvs(prev => ({ ...prev, [stat]: Number(value) }));
    };

    const handleIvChange = (stat, value) => {
        setIvs(prev => ({ ...prev, [stat]: Number(value) }));
    };

    const calcularStatFinal = (base, ev, iv) => {
        return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * 50) / 100 + 5);
    };

    const handleGuardarCambios = async () => {
        if (!datos || !habilidadSeleccionada || !naturalezaSeleccionada || !itemSeleccionado) {
            return alert("Debes completar todos los campos");
        }

        const totalEVs = Object.values(evs).reduce((a, b) => a + b, 0);
        if (totalEVs > 510) {
            return alert("La suma total de EVs no puede superar 510");
        }

        try {
            await api.put(`/pokemones-personalizados/${id}`, {
                itemId: itemSeleccionado.id,
                habilidadId: habilidadSeleccionada,
                naturalezaId: naturalezaSeleccionada,
                evs,
                ivs,
                movimientos: movimientosSeleccionados.filter(Boolean)
            });

            navigate("/equipos");
        } catch (error) {
            console.error(error);
            alert("Error al guardar los cambios");
        }
    };

    const handleEliminar = async () => {
        if (confirm("¿Estás seguro que deseas eliminar este Pokémon del equipo?")) {
            await api.delete(`/pokemones-personalizados/${id}`);
            navigate("/equipos");
        }
    };

    if (!datos) return <div className="container py-4">Cargando...</div>;

    return (
    <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="fw-bold">Editar Pokémon</h3>
            <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>← Volver</button>
        </div>

        <BuscadorPokemon seleccionado={datos.pokemon} disabled />

        <div className="d-flex gap-2 justify-content-center mb-4">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="border rounded d-flex align-items-center justify-content-center" style={{ width: 50, height: 50, backgroundColor: "#f8f9fa", border: i === datos.posicion ? "2px solid #007bff" : "1px solid #ccc" }}>
                    {i === datos.posicion && datos.pokemon?.imagen && (
                        <img src={`http://localhost:3000${datos.pokemon.imagen}`} alt={datos.pokemon.nombre} style={{ width: "40px", height: "40px", objectFit: "contain" }} />
                    )}
                </div>
            ))}
        </div>

        <Form.Group className="mb-3">
            <Form.Label>Item</Form.Label>
            <div className="dropdown">
                <button
                    className="btn btn-outline-secondary dropdown-toggle w-100 d-flex align-items-center justify-content-between"
                    type="button"
                    data-bs-toggle="dropdown"
                >
                    {itemSeleccionado ? (
                        <span className="d-flex align-items-center">
                            <img
                                src={`http://localhost:3000${itemSeleccionado.imagen}`}
                                alt={itemSeleccionado.nombre}
                                style={{ width: "24px", height: "24px", marginRight: "8px" }}
                            />
                            {itemSeleccionado.nombre}
                        </span>
                    ) : "Seleccionar item"}
                </button>
                <ul className="dropdown-menu w-100">
                    {items.map((item) => (
                        <li key={item.id}>
                            <button
                                className="dropdown-item d-flex align-items-center"
                                onClick={() => setItemSeleccionado(item)}
                            >
                                <img
                                    src={`http://localhost:3000${item.imagen}`}
                                    alt={item.nombre}
                                    style={{ width: "24px", height: "24px", marginRight: "10px" }}
                                />
                                {item.nombre}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </Form.Group>

        <Form.Group className="mt-3">
            <Form.Label>Habilidad</Form.Label>
            <Form.Select
                value={habilidadSeleccionada}
                onChange={(e) => setHabilidadSeleccionada(e.target.value)}
            >
                <option value="">Seleccionar habilidad</option>
                {habilidades.map((h) => (
                    <option key={h.id} value={h.id}>{h.nombre}</option>
                ))}
            </Form.Select>
            {habilidades.find((h) => h.id === Number(habilidadSeleccionada))?.descripcion && (
                <div className="mt-2 text-muted small">
                    {habilidades.find((h) => h.id === Number(habilidadSeleccionada)).descripcion}
                </div>
            )}
        </Form.Group>

        <Form.Group className="mt-3">
            <Form.Label>Naturaleza</Form.Label>
            <Form.Select
                value={naturalezaSeleccionada}
                onChange={(e) => setNaturalezaSeleccionada(e.target.value)}
            >
                <option value="">Seleccionar naturaleza</option>
                {naturalezas.map((n) => (
                    <option key={n.id} value={n.id}>{n.nombre}</option>
                ))}
            </Form.Select>
        </Form.Group>

        <h5 className="mt-4 fw-bold">Estadísticas</h5>
        <table className="table">
            <thead>
                <tr>
                    <th>Stat</th>
                    <th>Base</th>
                    <th>EVs</th>
                    <th>IVs</th>
                    <th>Final</th>
                </tr>
            </thead>
            <tbody>
                {["hp", "atk", "def", "spa", "spd", "spe"].map((stat) => (
                    <tr key={stat}>
                        <td className="text-uppercase">{stat}</td>
                        <td>{datos.pokemon?.[stat]}</td>
                        <td>
                            <input
                                type="number"
                                min="0"
                                max="252"
                                className="form-control"
                                value={evs[stat]}
                                onChange={(e) => handleEvChange(stat, e.target.value)}
                            />
                            <progress value={evs[stat]} max="252" className="w-100"></progress>
                        </td>
                        <td>
                            <select
                                className="form-select"
                                value={ivs[stat]}
                                onChange={(e) => handleIvChange(stat, e.target.value)}
                            >
                                {[...Array(32)].map((_, i) => (
                                    <option key={i} value={i}>{i}</option>
                                ))}
                            </select>
                        </td>
                        <td>
                            {calcularStatFinal(datos.pokemon?.[stat], evs[stat], ivs[stat])}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

        <Form.Group className="mt-4">
            <Form.Label>Movimientos</Form.Label>
            <Row>
                {[0, 1, 2, 3].map((index) => (
                    <Col md={6} key={index}>
                        <Form.Select
                            value={movimientosSeleccionados[index]}
                            onChange={(e) => {
                                const nuevos = [...movimientosSeleccionados];
                                nuevos[index] = e.target.value;
                                setMovimientosSeleccionados(nuevos);
                            }}
                        >
                            <option value="">Seleccionar movimiento</option>
                            {movimientos.map((m) => (
                                <option key={m.id} value={m.id}>{m.nombre}</option>
                            ))}
                        </Form.Select>
                    </Col>
                ))}
            </Row>
        </Form.Group>

        <button className="btn btn-success mt-4 w-100" onClick={handleGuardarCambios}>Guardar cambios</button>
        <button className="btn btn-danger mt-2 w-100" onClick={handleEliminar}>Eliminar del equipo</button>
    </div>
);

}

export default EditarPokemon;

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
    const [itemSeleccionado, setItemSeleccionado] = useState(null);

    const [movimientos, setMovimientos] = useState([]);
    const [movimientosSeleccionados, setMovimientosSeleccionados] = useState(["", "", "", ""]);

    const [habilidades, setHabilidades] = useState([]);
    const [habilidadSeleccionada, setHabilidadSeleccionada] = useState("");

    const [naturalezas, setNaturalezas] = useState([]);
    const [naturalezaSeleccionada, setNaturalezaSeleccionada] = useState("");

    const [apodo, setApodo] = useState("");

    const statMap = {
        hp: "hp",
        atk: "ataque",
        def: "defensa",
        spa: "ataque_especial",
        spd: "defensa_especial",
        spe: "velocidad"
    };

    useEffect(() => {
        api.get(`/pokemon-personalizado/${id}`).then(res => {
            const p = res.data;
            setDatos(p);
            setEvs({
                hp: p.ev_hp,
                atk: p.ev_atk,
                def: p.ev_def,
                spa: p.ev_spa,
                spd: p.ev_spd,
                spe: p.ev_spe
            });
            setIvs({
                hp: p.iv_hp,
                atk: p.iv_atk,
                def: p.iv_def,
                spa: p.iv_spa,
                spd: p.iv_spd,
                spe: p.iv_spe
            });
            setItemSeleccionado(p.Item || null);
            setHabilidadSeleccionada(p.Habilidad?.id || "");
            setNaturalezaSeleccionada(p.naturaleza?.id || "");
            setApodo(p.apodo || "");
            setMovimientosSeleccionados((p.Movimientos || []).map(m => m.id || ""));
        });

        api.get("/items").then(res => setItems(res.data));
        api.get("/movimientos").then(res => setMovimientos(res.data));
        api.get("/habilidades").then(res => setHabilidades(res.data));
        api.get("/naturalezas").then(res => setNaturalezas(res.data));
    }, [id]);

    const handleEvChange = (stat, value) => {
        setEvs(prev => ({ ...prev, [stat]: Number(value) }));
    };

    const handleIvChange = (stat, value) => {
        setIvs(prev => ({ ...prev, [stat]: Number(value) }));
    };

    const calcularStatFinal = (stat, base, iv, ev) => {
        if (!base) return 0;
        const nivel = 100;
        const naturaleza = naturalezas.find(n => n.id === Number(naturalezaSeleccionada));
        const statReal = statMap[stat];
        let modificador = 1;
        if (naturaleza) {
            if (naturaleza.aumenta === statReal) modificador = 1.1;
            else if (naturaleza.disminuye === statReal) modificador = 0.9;
        }
        if (stat === "hp") {
            return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * nivel) / 100) + nivel + 10;
        }
        return Math.floor((((2 * base + iv + Math.floor(ev / 4)) * nivel) / 100 + 5) * modificador);
    };

    const getColorStat = (stat) => {
        const naturaleza = naturalezas.find(n => n.id === Number(naturalezaSeleccionada));
        const statReal = statMap[stat];
        if (!naturaleza) return "black";
        if (naturaleza.aumenta === statReal) return "red";
        if (naturaleza.disminuye === statReal) return "blue";
        return "black";
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
            await api.put(`/pokemon-personalizado/${id}`, {
                itemId: itemSeleccionado.id,
                habilidadId: habilidadSeleccionada,
                naturalezaId: naturalezaSeleccionada,
                apodo: apodo,
                ev_hp: evs.hp,
                ev_atk: evs.atk,
                ev_def: evs.def,
                ev_spa: evs.spa,
                ev_spd: evs.spd,
                ev_spe: evs.spe,
                iv_hp: ivs.hp,
                iv_atk: ivs.atk,
                iv_def: ivs.def,
                iv_spa: ivs.spa,
                iv_spd: ivs.spd,
                iv_spe: ivs.spe,
                movimientos: movimientosSeleccionados.filter(Boolean).map(Number)
            });

            navigate("/equipos");
        } catch (error) {
            console.error(error);
            alert("Error al guardar los cambios");
        }
    };

    const handleEliminar = async () => {
        if (confirm("¿Estás seguro que deseas eliminar este Pokémon del equipo?")) {
            await api.delete(`/pokemon-personalizado/${id}`);
            navigate("/equipos");
        }
    };

    if (!datos) return <div className="container py-4">Cargando...</div>;

    const stats = [
        { key: "hp", label: "HP" },
        { key: "atk", label: "ATK" },
        { key: "def", label: "DEF" },
        { key: "spa", label: "SPA" },
        { key: "spd", label: "SPD" },
        { key: "spe", label: "SPE" },
    ];

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fw-bold">Editar Pokémon</h3>
                <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>← Volver</button>
            </div>

            <BuscadorPokemon seleccionado={datos.pokemon} disabled />

            <Form.Group className="mb-3 mt-3">
                <Form.Label>Apodo</Form.Label>
                <Form.Control
                    type="text"
                    value={apodo}
                    onChange={(e) => setApodo(e.target.value)}
                    placeholder="Ingresa un apodo para tu Pokémon"
                />
            </Form.Group>

            <Row>
                <Col md={4}>
                    <div className="card text-center p-3 mb-3">
                        <img
                            src={`http://localhost:3000${datos.pokemon?.imagen}`}
                            alt={datos.pokemon?.nombre}
                            className="mx-auto"
                            style={{ width: "120px", height: "120px", objectFit: "contain" }}
                        />
                        <h4 className="mt-3">{datos.pokemon?.nombre}</h4>
                        {datos.pokemon?.tipos?.map((tipo, idx) => (
                            <span key={idx} className="badge me-1" style={{ backgroundColor: tipo.color || "#ddd", color: "#fff" }}>
                                {tipo.nombre}
                            </span>
                        ))}
                    </div>

                    {/* ITEM */}
                    <Form.Group className="mb-3">
                        <Form.Label>Item</Form.Label>
                        <div className="dropdown">
                            <button className="btn btn-outline-secondary dropdown-toggle w-100" data-bs-toggle="dropdown">
                                {itemSeleccionado ? itemSeleccionado.nombre : "Seleccionar item"}
                            </button>
                            <ul className="dropdown-menu w-100">
                                {items.map((item) => (
                                    <li key={item.id}>
                                        <button className="dropdown-item" onClick={() => setItemSeleccionado(item)}>
                                            {item.nombre}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Form.Group>

                    {/* HABILIDAD */}
                    <Form.Group className="mb-3">
                        <Form.Label>Habilidad</Form.Label>
                        <Form.Select value={habilidadSeleccionada} onChange={(e) => setHabilidadSeleccionada(e.target.value)}>
                            <option value="">Seleccionar habilidad</option>
                            {habilidades.map(h => (
                                <option key={h.id} value={h.id}>{h.nombre}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {/* NATURALEZA */}
                    <Form.Group className="mb-3">
                        <Form.Label>Naturaleza</Form.Label>
                        <Form.Select value={naturalezaSeleccionada} onChange={(e) => setNaturalezaSeleccionada(e.target.value)}>
                            <option value="">Seleccionar naturaleza</option>
                            {naturalezas.map(n => (
                                <option key={n.id} value={n.id}>{n.nombre}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col md={8}>
                    <h5 className="mb-3">Estadísticas</h5>
                    <div className="card p-4 mb-4">
                        {stats.map(({ key, label }) => (
                            <div className="row align-items-center mb-3" key={key}>
                                <div className="col-2 fw-bold">{label}</div>
                                <div className="col-2">{datos.pokemon?.[key]}</div>
                                <div className="col-4">
                                    <input
                                        type="number"
                                        min="0"
                                        max="252"
                                        step="4"
                                        value={evs[key]}
                                        onChange={(e) => handleEvChange(key, e.target.value)}
                                        className="form-control form-control-sm"
                                    />
                                </div>
                                <div className="col-2">
                                    <Form.Select
                                        value={ivs[key]}
                                        onChange={(e) => handleIvChange(key, e.target.value)}
                                        size="sm"
                                    >
                                        {[...Array(32)].map((_, i) => (
                                            <option key={i} value={i}>{i}</option>
                                        ))}
                                    </Form.Select>
                                </div>
                                <div className="col-2 fw-bold text-center" style={{ color: getColorStat(key) }}>
                                    {calcularStatFinal(key, datos.pokemon?.[key], ivs[key], evs[key])}
                                </div>
                            </div>
                        ))}
                    </div>

                    <h5 className="mb-3">Movimientos</h5>
                    <Row className="g-3">
                        {[0, 1, 2, 3].map((index) => {
                            const mov = movimientos.find(m => m.id === Number(movimientosSeleccionados[index]));
                            return (
                                <Col md={6} key={index}>
                                    <div className="border rounded p-2 bg-light">
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
                                        {mov && (
                                            <div className="mt-2">
                                                <span className="badge bg-secondary me-2">{mov.tipo?.nombre}</span>
                                                <small>{mov.descripcion}</small>
                                            </div>
                                        )}
                                    </div>
                                </Col>
                            );
                        })}
                    </Row>

                    <button className="btn btn-success mt-4 w-100" onClick={handleGuardarCambios}>Guardar cambios</button>
                    <button className="btn btn-danger mt-2 w-100" onClick={handleEliminar}>Eliminar del equipo</button>
                </Col>
            </Row>
        </div>
    );
}

export default EditarPokemon;

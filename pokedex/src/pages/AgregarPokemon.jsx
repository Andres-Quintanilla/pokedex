import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import BuscadorPokemon from "../components/BuscadorPokemon";
import api from "../api/axios";

function AgregarPokemon() {
    const { id, slot } = useParams();
    const navigate = useNavigate();

    const [seleccionado, setSeleccionado] = useState(null);
    const [evs, setEvs] = useState({ hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 });
    const [ivs, setIvs] = useState({ hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 });

    const [items, setItems] = useState([]);
    const [itemSeleccionado, setItemSeleccionado] = useState("");

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
        api.get("/items").then(res => setItems(res.data));
        api.get("/movimientos").then(res => setMovimientos(res.data));
        api.get("/naturalezas").then(res => setNaturalezas(res.data));
    }, []);

    useEffect(() => {
        if (seleccionado) {
            console.log("Seleccionado:", seleccionado);
            api.get(`/habilidades`)
                .then(res => setHabilidades(res.data))
                .catch(() => alert("Error al cargar habilidades"));
        }
    }, [seleccionado]);

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

    const handleAgregarPokemon = async () => {
        if (!seleccionado || !habilidadSeleccionada || !naturalezaSeleccionada || !itemSeleccionado) {
            return alert("Debes completar todos los campos");
        }

        const totalEVs = Object.values(evs).reduce((a, b) => a + b, 0);
        if (totalEVs > 510) {
            return alert("La suma total de EVs no puede superar 510");
        }

        try {
            await api.post("/pokemon-personalizado", {
                pokemonId: seleccionado.id,
                equipoId: Number(id),
                posicion: Number(slot),
                itemId: Number(itemSeleccionado.id),
                habilidadId: Number(habilidadSeleccionada),
                naturalezaId: Number(naturalezaSeleccionada),
                apodo: apodo,
                movimientos: movimientosSeleccionados
                    .filter((id) => id !== "" && !isNaN(id))
                    .map(Number),
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
                iv_spe: ivs.spe
            });
            navigate("/equipos");
        } catch (error) {
            console.error(error);
            alert("Error al guardar el Pokémon en el equipo");
        }
    };

    const stats = [
        { key: "hp", label: "HP" },
        { key: "atk", label: "Attack" },
        { key: "def", label: "Defense" },
        { key: "spa", label: "Sp. Atk" },
        { key: "spd", label: "Sp. Def" },
        { key: "spe", label: "Speed" }
    ];

    const evsRestantes = 508 - Object.values(evs).reduce((a, b) => a + b, 0);
    const ivsRestantes = 186 - Object.values(ivs).reduce((a, b) => a + b, 0);
    
    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fw-bold">Agregar Pokémon</h3>
                <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>← Volver</button>
            </div>

            <BuscadorPokemon seleccionado={seleccionado} setSeleccionado={setSeleccionado} />

            <div className="d-flex gap-2 justify-content-center mb-4">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="border rounded d-flex align-items-center justify-content-center"
                        style={{
                            width: 50,
                            height: 50,
                            backgroundColor: "#f8f9fa",
                            border: i === Number(slot) ? "2px solid #007bff" : "1px solid #ccc",
                            outline: "none"
                        }}
                    >
                        {i === Number(slot) && seleccionado?.imagen && (
                            <img
                                src={`http://localhost:3000${seleccionado.imagen}`}
                                alt={seleccionado.nombre}
                                style={{ width: "40px", height: "40px", objectFit: "contain" }}
                            />
                        )}
                    </div>
                ))}
            </div>

            <Form.Group className="mb-4 mt-3">
                <Form.Label>Apodo</Form.Label>
                <Form.Control
                    type="text"
                    value={apodo}
                    onChange={(e) => setApodo(e.target.value)}
                    placeholder="Ingresa un apodo para tu Pokémon"
                    disabled={!seleccionado}
                />
            </Form.Group>

            <Row>
                <Col md={4}>
                    <div className="card text-center p-3 mb-3">
                        <img
                            src={`http://localhost:3000${seleccionado?.imagen}`}
                            alt={seleccionado?.nombre || "Pokémon"}
                            className="mx-auto"
                            style={{ width: "120px", height: "120px", objectFit: "contain" }}
                        />
                        <h4 className="mt-3">{seleccionado?.nombre || "Nombre"}</h4>
                        {seleccionado?.tipos?.map((tipo, idx) => (
                            <span key={idx} className="badge me-1" style={{ backgroundColor: tipo.color || "#ddd", color: "#fff" }}>
                                {tipo.nombre}
                            </span>
                        ))}
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label>Item</Form.Label>
                        <div className="dropdown">
                            <button
                                className="btn btn-outline-secondary dropdown-toggle w-100 d-flex align-items-center justify-content-between"
                                type="button"
                                data-bs-toggle="dropdown"
                                disabled={!seleccionado}
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
                            disabled={!seleccionado}
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
                        <Form.Select value={naturalezaSeleccionada} onChange={(e) => setNaturalezaSeleccionada(e.target.value)} disabled={!seleccionado}>
                            <option value="">Seleccionar naturaleza</option>
                            {naturalezas.map((n) => (
                                <option key={n.id} value={n.id}>{n.nombre}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col md={8}>
                    <h5 className="mb-3">Estadísticas</h5>
                    <div className="card p-4 mb-4">
                        <div className="mb-3 text-center">
                            <p className="mb-1"><strong>EVs restantes:</strong> {evsRestantes} / 508</p>
                            <p className="mb-0"><strong>IVs restantes:</strong> {ivsRestantes} / 186</p>
                        </div>

                        <div className="row fw-bold mb-3 text-center align-items-center">
                            <div className="col-2">Stat</div>
                            <div className="col-2">Base</div>
                            <div className="col-4">EVs</div>
                            <div className="col-2">IVs</div>
                            <div className="col-2">Final</div>
                        </div>

                        {stats.map(({ key, label }) => (
                            <div className="row align-items-center mb-3" key={key}>
                                <div className="col-2 text-center fw-semibold">{label}</div>

                                <div className="col-2 text-center">
                                    {seleccionado?.[key] ?? "-"}
                                </div>

                                <div className="col-4 d-flex align-items-center">
                                    <input
                                        type="number"
                                        min={0}
                                        max={252}
                                        step={4}
                                        value={evs[key]}
                                        onChange={(e) => handleEvChange(key, e.target.value)}
                                        className="form-control form-control-sm me-2"
                                        style={{ width: "60px" }}
                                    />
                                    <input
                                        type="range"
                                        min={0}
                                        max={252}
                                        step={4}
                                        value={evs[key]}
                                        onChange={(e) => handleEvChange(key, e.target.value)}
                                        className="form-range"
                                        style={{ flex: 1 }}
                                    />
                                </div>

                                <div className="col-2 d-flex justify-content-center">
                                    <Form.Select
                                        size="sm"
                                        value={ivs[key]}
                                        onChange={(e) => handleIvChange(key, e.target.value)}
                                        style={{ maxWidth: "70px" }}
                                    >
                                        {[...Array(32)].map((_, i) => (
                                            <option key={i} value={i}>{i}</option>
                                        ))}
                                    </Form.Select>
                                </div>

                                <div
                                    className="col-2 text-center fw-bold"
                                    style={{ color: getColorStat(key) }}
                                >
                                    {calcularStatFinal(key, seleccionado?.[key] || 0, ivs[key], evs[key])}
                                </div>
                            </div>
                        ))}
                    </div>

                    <h5 className="mb-3">Movimientos</h5>
                    <Row className="g-3">
                        {[0, 1, 2, 3].map((index) => {
                            const mov = movimientos.find(m => m.id === movimientosSeleccionados[index]);
                            return (
                                <Col md={6} key={index}>
                                    <div className="border rounded p-2 d-flex flex-column justify-content-between" style={{ minHeight: "100px", backgroundColor: "#f9f9f9" }}>
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
                                            <div className="mt-2 d-flex align-items-center">
                                                <span className="badge me-2" style={{ backgroundColor: mov.tipo?.color || "#888", color: "#fff" }}>
                                                    {mov.tipo?.nombre || "Tipo"}
                                                </span>
                                                <small className="text-muted">{mov.descripcion}</small>
                                            </div>
                                        )}
                                    </div>
                                </Col>
                            );
                        })}
                    </Row>

                    <button className="btn btn-primary mt-4 w-100" onClick={handleAgregarPokemon} disabled={!seleccionado}>
                        Guardar en el equipo
                    </button>
                </Col>
            </Row>
        </div>
    );
}

export default AgregarPokemon;

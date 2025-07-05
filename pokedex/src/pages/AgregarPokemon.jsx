import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";

function AgregarPokemon() {
    const { id, slot } = useParams(); 
    const navigate = useNavigate();
    const [busqueda, setBusqueda] = useState("");

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fw-bold">Pokémon Team Builder</h3>
                <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>← Volver</button>
            </div>

        <Form.Control
            type="text"
            placeholder="Buscar Pokémon"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="mb-4"
        />

        <div className="d-flex gap-2 justify-content-center mb-4">
            {[...Array(6)].map((_, i) => (
            <div
                key={i}
                className="border rounded"
                style={{ width: 50, height: 50, backgroundColor: "#f8f9fa" }}
            >
                {/* Aquí irán las imágenes de los Pokémon cuando estén definidos */}
            </div>
            ))}
        </div>

        <Row>
            <Col md={4}>
            <div className="card text-center p-3 mb-3">
                <img
                src="/default.png"
                alt="Pokémon"
                className="mx-auto"
                style={{ width: "120px" }}
                />
                <h4 className="mt-3">Nombre</h4>
                <span className="badge bg-pink">Fairy</span>
            </div>

            <Form.Group className="mb-3">
                <Form.Label>Item</Form.Label>
                <Form.Select>
                <option value="">Seleccionar item</option>
                </Form.Select>
            </Form.Group>

            <Form.Group>
                <Form.Label>Habilidad</Form.Label>
                <Form.Select>
                <option value="">Seleccionar habilidad</option>
                </Form.Select>
            </Form.Group>
            </Col>

            <Col md={8}>
            <Row className="mb-3">
                <Col>
                <h5 className="mb-3">Estadísticas</h5>
                <p>[Stats]</p>
                </Col>
            </Row>

            <Row>
                <Col>
                <h5 className="mb-3">Movimientos</h5>
                <p>[Movimientos]</p>
                </Col>
            </Row>
            </Col>
        </Row>
        </div>
    );
}

export default AgregarPokemon;

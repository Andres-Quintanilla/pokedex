import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Button, Table, Modal, Form } from "react-bootstrap";

function AdminPokemon() {
  const [pokemones, setPokemones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({ nombre: "", imagen: "" });

  const fetchPokemones = () => {
    api.get("/pokemones").then((res) => setPokemones(res.data));
  };

  useEffect(() => {
    fetchPokemones();
  }, []);

  const handleShowModal = (pokemon = null) => {
    setEditando(pokemon);
    setFormData(pokemon ? { nombre: pokemon.nombre, imagen: pokemon.imagen } : { nombre: "", imagen: "" });
    setShowModal(true);
  };

  const handleGuardar = async () => {
    try {
      if (editando) {
        await api.put(`/pokemones/${editando.id}`, formData);
      } else {
        await api.post("/pokemones", formData);
      }
      setShowModal(false);
      fetchPokemones();
    } catch (error) {
      alert("Error al guardar el Pokémon", error);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este Pokémon?")) return;
    try {
      await api.delete(`/pokemones/${id}`);
      fetchPokemones();
    } catch {
      alert("Error al eliminar el Pokémon");
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Pokémon</h3>
        <Button onClick={() => handleShowModal()}>Nuevo Pokémon</Button>
      </div>

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pokemones.map((p) => (
            <tr key={p.id}>
              <td>
                <img
                  src={`http://localhost:3000${p.imagen}`}
                  alt={p.nombre}
                  style={{ width: 50, height: 50, objectFit: "contain" }}
                />
              </td>
              <td>{p.nombre}</td>
              <td>
                <Button size="sm" variant="warning" onClick={() => handleShowModal(p)}>
                  Editar
                </Button>{" "}
                <Button size="sm" variant="danger" onClick={() => handleEliminar(p.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editando ? "Editar" : "Nuevo"} Pokémon</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Imagen (ruta relativa)</Form.Label>
            <Form.Control
              value={formData.imagen}
              onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
            />
            <Form.Text>Ej: /uploads/bulbasaur.jpg</Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGuardar}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminPokemon;

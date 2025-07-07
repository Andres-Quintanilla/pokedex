import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Button, Table, Modal, Form } from "react-bootstrap";

function AdminItems() {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nombre: "", imagen: "" });

  const cargarItems = async () => {
    const res = await api.get("/items");
    setItems(res.data);
  };

  useEffect(() => {
    cargarItems();
  }, []);

  const handleGuardar = async () => {
    try {
      if (editando) {
        await api.put(`/items/${editando.id}`, form);
      } else {
        await api.post("/items", form);
      }
      setShowModal(false);
      setForm({ nombre: "", imagen: "" });
      setEditando(null);
      cargarItems();
    } catch (error) {
      alert("Error al guardar el ítem", error);
    }
  };

  const handleEditar = (item) => {
    setForm({ nombre: item.nombre, imagen: item.imagen });
    setEditando(item);
    setShowModal(true);
  };

  const handleEliminar = async (id) => {
    if (confirm("¿Estás seguro de eliminar este ítem?")) {
      await api.delete(`/items/${id}`);
      cargarItems();
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Ítems</h3>
        <Button onClick={() => setShowModal(true)}>+ Nuevo Ítem</Button>
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
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <img
                  src={`http://localhost:3000${item.imagen}`}
                  alt={item.nombre}
                  style={{ width: 40, height: 40, objectFit: "contain" }}
                />
              </td>
              <td>{item.nombre}</td>
              <td>
                <Button size="sm" variant="warning" onClick={() => handleEditar(item)} className="me-2">
                  Editar
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleEliminar(item.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editando ? "Editar Ítem" : "Nuevo Ítem"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Imagen (ruta relativa)</Form.Label>
            <Form.Control
              value={form.imagen}
              onChange={(e) => setForm({ ...form, imagen: e.target.value })}
            />
            <Form.Text>Ej: /uploads/master-ball.png</Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleGuardar}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminItems;

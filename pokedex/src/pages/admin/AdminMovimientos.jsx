import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Button, Form, Modal, Table } from "react-bootstrap";

function AdminMovimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nombre: "", descripcion: "", tipoId: "" });
  const [editando, setEditando] = useState(null);

  const cargarDatos = async () => {
    try {
      const [resMov, resTipos] = await Promise.all([
        api.get("/movimientos"),
        api.get("/tipos")
      ]);
      setMovimientos(resMov.data);
      setTipos(resTipos.data);
    } catch (error) {
      alert("Error al cargar movimientos o tipos", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleGuardar = async () => {
    try {
      if (editando) {
        await api.put(`/movimientos/${editando.id}`, form);
      } else {
        await api.post("/movimientos", form);
      }
      setShowModal(false);
      setForm({ nombre: "", descripcion: "", tipoId: "" });
      setEditando(null);
      cargarDatos();
    } catch (err) {
      alert("Error al guardar el movimiento", err);
    }
  };

  const handleEditar = (mov) => {
    setForm({ nombre: mov.nombre, descripcion: mov.descripcion, tipoId: mov.tipoId });
    setEditando(mov);
    setShowModal(true);
  };

  const handleEliminar = async (id) => {
    if (confirm("¿Estás seguro de eliminar este movimiento?")) {
      await api.delete(`/movimientos/${id}`);
      cargarDatos();
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Movimientos</h3>
        <Button onClick={() => setShowModal(true)}>+ Nuevo Movimiento</Button>
      </div>

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.nombre}</td>
              <td>{m.descripcion}</td>
              <td>{m.tipo?.nombre}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleEditar(m)}
                  className="me-2"
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleEliminar(m.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editando ? "Editar Movimiento" : "Nuevo Movimiento"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Tipo</Form.Label>
              <Form.Select
                value={form.tipoId}
                onChange={(e) => setForm({ ...form, tipoId: e.target.value })}
              >
                <option value="">Seleccionar tipo</option>
                {tipos.map((t) => (
                  <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleGuardar}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminMovimientos;

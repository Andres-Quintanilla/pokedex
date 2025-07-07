import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Button, Table, Modal, Form } from "react-bootstrap";

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [nuevaPassword, setNuevaPassword] = useState("");

  const cargarUsuarios = async () => {
    try {
      const res = await api.get("/usuarios");
      setUsuarios(res.data);
    } catch (error) {
      alert("Error al cargar usuarios", error);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cambiarRolAdmin = async (usuario) => {
    try {
      const endpoint = usuario.esAdmin
        ? `/usuarios/${usuario.id}/quitar-admin`
        : `/usuarios/${usuario.id}/hacer-admin`;

      await api.put(endpoint);
      cargarUsuarios();
    } catch (error) {
      alert("Error al cambiar el rol de admin", error);
    }
  };

  const cambiarPassword = async () => {
    if (!nuevaPassword.trim()) return alert("La contraseña no puede estar vacía");
    if (nuevaPassword.length < 10) return alert("La contraseña debe tener al menos 10 caracteres");

    try {
      await api.put(`/usuarios/${usuarioSeleccionado.id}/cambiar-password`, {
        nuevoPassword: nuevaPassword,
      });
      alert("Contraseña actualizada correctamente");
      setShowModal(false);
      setNuevaPassword("");
      setUsuarioSeleccionado(null);
    } catch (error) {
      alert(error.response?.data?.message || "Error al cambiar la contraseña");
    }
  };

  return (
    <div className="container py-4">
      <h3>Usuarios</h3>
      <Table bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Admin</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.esAdmin ? "Si" : "No"}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => cambiarRolAdmin(u)}
                >
                  {u.esAdmin ? "Quitar Admin" : "Hacer Admin"}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="me-2"
                  onClick={() => {
                    setUsuarioSeleccionado(u);
                    setShowModal(true);
                  }}
                >
                  Cambiar Contraseña
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cambiar contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Nueva contraseña</Form.Label>
            <Form.Control
              type="password"
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
              placeholder="Nueva contraseña (mínimo 10 caracteres)"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={cambiarPassword}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminUsuarios;

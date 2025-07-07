import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container-fluid">
            <Link className="navbar-brand fw-bold text-warning" to="/pokemones">
            Pokédex
            </Link>

            <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            >
            <span className="navbar-toggler-icon" />
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                {usuario && (
                <>
                    <li className="nav-item">
                    <NavLink className="nav-link" to="/pokemones">
                        Todos los Pokémon
                    </NavLink>
                    </li>
                    <li className="nav-item">
                    <NavLink className="nav-link" to="/equipos">
                        Mis Equipos
                    </NavLink>
                    </li>

                    {usuario.esAdmin && (
                    <li className="nav-item dropdown">
                        <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        >
                        Panel Admin
                        </a>
                        <ul className="dropdown-menu">
                        <li>
                            <NavLink className="dropdown-item" to="/admin/pokemon">
                            Pokémon
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className="dropdown-item" to="/admin/movimientos">
                            Movimientos
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className="dropdown-item" to="/admin/items">
                            Ítems
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className="dropdown-item" to="/admin/usuarios">
                            Usuarios
                            </NavLink>
                        </li>
                        </ul>
                    </li>
                    )}
                </>
                )}
            </ul>

            <ul className="navbar-nav">
                {!usuario ? (
                <>
                    <li className="nav-item">
                    <NavLink className="nav-link" to="/login">
                        Iniciar Sesión
                    </NavLink>
                    </li>
                    <li className="nav-item">
                    <NavLink className="nav-link" to="/registro">
                        Registro
                    </NavLink>
                    </li>
                </>
                ) : (
                <>
                    <li className="nav-item d-flex align-items-center text-white me-3">
                    <span>
                        {usuario.username} ({usuario.esAdmin ? "Admin" : "Usuario"})
                    </span>
                    </li>
                    <li className="nav-item">
                    <button
                        className="btn btn-outline-warning btn-sm"
                        onClick={handleLogout}
                    >
                        Cerrar sesión
                    </button>
                    </li>
                </>
                )}
            </ul>
            </div>
        </div>
        </nav>
    );
};

export default Navbar;

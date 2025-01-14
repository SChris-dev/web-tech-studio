import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.removeItem('login_token');
        localStorage.removeItem('username');
        localStorage.removeItem('full_name');
        navigate('/login');
    }

    return(
        <>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container">
                <NavLink className="navbar-brand" to='/'>Web Tech Studio</NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                {location.pathname === '/login' || location.pathname === '/register' ? (
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className="nav-link" to='/login'>Login</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to='/register'>Register</NavLink>
                        </li>
                    </ul>
                ) : (
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link" href="#">{username}</a>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link" onClick={handleLogout}>Logout</button>
                        </li>
                    </ul>
                )}
                </div>
            </div>
        </nav>
        </>
    );
}

export default Navbar;
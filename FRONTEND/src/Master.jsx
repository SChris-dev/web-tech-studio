import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import Navbar from './components/Navbar';

const Master = () => {
    const token = localStorage.getItem('login_token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token]);

    return(
        <>
        <Navbar></Navbar>
        <Outlet></Outlet>
        </>
    );
}

export default Master;
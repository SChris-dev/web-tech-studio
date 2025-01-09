import React from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';

const Master = () => {
    return(
        <>
        <Navbar></Navbar>
        <Outlet></Outlet>
        </>
    );
}

export default Master;
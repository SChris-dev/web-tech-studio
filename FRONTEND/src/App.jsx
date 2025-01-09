import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// css
import './style.css';
import './bootstrap.css';

// imports
import Master from './Master';
import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='' element={<Master/>}>
            <Route path='' element={<HomePage/>}></Route>
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/register' element={<Register/>}></Route>
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App

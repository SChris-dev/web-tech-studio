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
import NotFound from './pages/NotFound';
import Course from './pages/Course';
import Lesson from './pages/Lesson';
import Jump from './pages/Jump';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='' element={<Master/>}>
            <Route path='' element={<HomePage/>}></Route>
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/register' element={<Register/>}></Route>
            <Route path='/:slug' element={<Course/>}></Route>
            <Route path='/:slug/lessons/:lesson_id' element={<Lesson/>}></Route>
            <Route path='/:slug/jump/:lesson_id' element={<Jump/>}></Route>
            <Route path='/*' element={<NotFound/>}></Route>
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App

import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import Api from '../Api';

const Register = () => {
    const token = localStorage.getItem('login_token');
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        full_name: '',
        username: '',
        password: ''
    });

    useEffect(() => {
        if (token) {
            navigate('/');
        } else {
            document.title = "Register";
        }
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await Api.post('/register', formData);

            localStorage.setItem('login_token', response.data.data.token);
            localStorage.setItem('username', response.data.data.username);
            localStorage.setItem('full_name', response.data.data.full_name);
            navigate('/');
        }
        catch (error) {
            setMessage('Something went wrong');
            console.log(error);
        }
    }


    return(
        <>
        <main className="py-5">
            <section>
                <div className="container">
                    <h3 className="mb-3 text-center">Register</h3>

                    <div className="row justify-content-center">
                        <div className="col-md-7">
                            <div className="card mb-4">
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group mb-2">
                                            <label htmlFor="full_name">Full Name</label>
                                            <input type="text" name="full_name" id="full_name" className="form-control" autoFocus
                                            value={formData.full_name}
                                            onChange={handleChange}/>
                                        </div>
                                        <div className="form-group mb-2">
                                            <label htmlFor="username">Username</label>
                                            <input type="text" name="username" id="username" className="form-control"
                                            value={formData.username}
                                            onChange={handleChange}/>
                                        </div>
                                        <div className="form-group mb-2">
                                            <label htmlFor="password">Password</label>
                                            <input type="password" name="password" id="password" className="form-control"
                                            value={formData.password}
                                            onChange={handleChange}/>
                                        </div>
                                        <div className="mt-3">
                                            <button type="submit" className="btn btn-primary w-100">Register</button>
                                        </div>
                                    </form>
                                    <p className='text-danger'>{message}</p>
                                </div>
                            </div>
                            <p className="text-center">You have an account? <NavLink to='/login'>Login</NavLink></p>
                        </div>
                    </div>

                </div>
            </section>
        </main>
        </>
    );
}

export default Register;
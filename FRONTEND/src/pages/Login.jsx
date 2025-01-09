import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import Api from '../Api';

const Login = () => {
    const token = localStorage.getItem('login_token');
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });

    useEffect(() => {
        if (token) {
            navigate('/');
        } else {
            document.title = "Login";
        }
    }, []);

    const handleChange = (e) => {
        setLoginData({
            ...loginData, [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await Api.post('/login', loginData);

            localStorage.setItem('login_token', response.data.data.token);
            localStorage.setItem('username', response.data.data.username);
            navigate('/')
        }
        catch (error) {
            setMessage('Username or password is wrong');
            console.log(error);
        }
    }

    return(
        <>
        <main className="py-5">
            <section>
                <div className="container">
                    <h3 className="mb-3 text-center">Login</h3>

                    <div className="row justify-content-center">
                        <div className="col-md-7">
                            <div className="card mb-4">
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group mb-2">
                                            <label for="username">Username</label>
                                            <input type="text" name="username" id="username" className="form-control" autofocus
                                            value={loginData.username}
                                            onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group mb-2">
                                            <label for="password">Password</label>
                                            <input type="password" name="password" id="password" className="form-control"
                                            value={loginData.password}
                                            onChange={handleChange}/>
                                        </div>
                                        <div className="mt-3">
                                            <button type="submit" className="btn btn-primary w-100">Login</button>
                                        </div>
                                    </form>
                                <p className='text-danger'>{message}</p>
                                </div>
                            </div>
                            <p className="text-center">You have no an account yet? <NavLink to='/register'>Register</NavLink></p>
                        </div>
                    </div>

                </div>
            </section>
        </main>

        </>
    );
}

export default Login;
import React, { useEffect, useState } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { useHistory } from 'react-router-dom';

export const RegisterPage = () => {
    const history = useHistory();
    const message = useMessage();
    const { loading, request, error, clearError } = useHttp();
    const [form, setForm] = useState({
        userName: '',
        email: '',
        password: '',
    });

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    useEffect(() => {
        window.M.updateTextFields();
    }, []);

    const changeHandler = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };
    const registerHandler = async () => {
        try {
            const data = await request('/api/registration/register', 'POST', {
                ...form,
            });
            if (data.message === 'User is created') {
                message(data.message);
                history.push('/');
            }
        } catch (e) {}
    };
    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>User</h1>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Registration</span>
                        <div>
                            <div className="input-field">
                                <input
                                    placeholder="Enter your name"
                                    id="userName"
                                    type="text"
                                    name="userName"
                                    className="yellow-input"
                                    value={form.userName}
                                    onChange={changeHandler}
                                />
                                <label htmlFor="userName">Name</label>
                            </div>
                            <div className="input-field">
                                <input
                                    placeholder="Enter email"
                                    id="email"
                                    type="text"
                                    name="email"
                                    className="yellow-input"
                                    value={form.email}
                                    onChange={changeHandler}
                                />
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="input-field">
                                <input
                                    placeholder="Enter password"
                                    id="password"
                                    type="text"
                                    name="password"
                                    className="yellow-input"
                                    value={form.password}
                                    onChange={changeHandler}
                                />
                                <label htmlFor="password">Password</label>
                            </div>
                        </div>
                    </div>
                    <div className="card-action">
                        <button
                            className="btn grey lighten-1 black-text"
                            onClick={registerHandler}
                            disabled={loading}
                        >
                            Registration
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

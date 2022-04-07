import React, { useState } from 'react'
import axios from 'axios';

export default () => {
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ errors, setErrors ] = useState([]);

    const onSubmit = async event => {
        event.preventDefault();
        try {
            const response = await axios.post('/api/users/sign-up', { email, password });
        } catch (error) {
            setErrors(error.response.data.errors)
        }
    }

    return (
        <form onSubmit={onSubmit} >
            <h1>Sign up</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input 
                    className="form-control" 
                    type="text"
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input 
                    className="form-control"
                    type="password"
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            {errors.length > 0 && (
                <div className="alert alert-danger">
                    <h4>Ooops...</h4>
                    <ul className="my-0">
                        { errors.map(err => <li key={err.message}>{err.message}</li>) }
                    </ul>
                </div>
            )}
            <button className="btn btn-primary">Sign up</button>
        </form>
    )
}
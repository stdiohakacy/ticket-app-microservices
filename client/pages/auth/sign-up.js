import React, { useState } from 'react'

export default () => {
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    const onSubmit = event => {
        event.preventDefault();
        console.log(email, password);
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
            <button className="btn btn-primary">Sign up</button>
        </form>
    )
}
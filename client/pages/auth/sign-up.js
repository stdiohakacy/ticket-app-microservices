import React, { useState } from 'react';
import useRequest from '../../hooks/use-request';

export default () => {
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const { doRequest, errors } = useRequest({
        url: "/api/users/sign-up",
        method: "post",
        body: { email, password }
    })

    const onSubmit = async event => {
        event.preventDefault();
        doRequest();
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
            {errors}
            <button className="btn btn-primary">Sign up</button>
        </form>
    )
}
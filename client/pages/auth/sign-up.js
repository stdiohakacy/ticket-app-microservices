export default () => {
    return (
        <form>
            <h1>Sign up</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input className="form-control" type="text"/>
            </div>
            <div className="form-group">
                <label>Password</label>
                <input className="form-control" type="password"/>
            </div>
            <button className="btn btn-primary">Sign up</button>
        </form>
    )
}
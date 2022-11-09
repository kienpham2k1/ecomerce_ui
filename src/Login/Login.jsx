import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

function Login() {
    const cookies = new Cookies();
    let navigate = useNavigate();
    const [userLogin, setUserLogin] = useState({
        username: '',
        password: '',
    });
    const { username, password } = userLogin;
    const [error, setError] = useState({ message: '' });

    const refresh = () => {
        window.location.reload();
    };
    const onInputChange = (e) => {
        setUserLogin({ ...userLogin, [e.target.name]: e.target.value });
    };
    const onSubmit = async (e) => {
        e.preventDefault();
        const result = await axios.post('http://localhost:8080/login', userLogin);
        if (result.data.code === 200) {
            Auth(result.data.data);
            alert(result.data.message);
            if (cookies.get('token').role == '[ROLE_ADMIN]') navigate('/userhome');
            else navigate('/');
            refresh();
        } else if (result.data.code === 101) {
            // alert(result.data.message);
            setError({ ...error, message: result.data.message });
            console.log(result);
        }
    };
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-5">
                    <div className="card shadow-lg border-0 rounded-lg mt-5">
                        <div className="card-header">
                            <h3 className="text-center font-weight-light my-4">Login</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={(e) => onSubmit(e)}>
                                <div style={{ color: 'red' }}>{error.message}</div>
                                <div className="form-group">
                                    <label className="small my-3 d-flex" htmlFor="userId">
                                        User ID
                                    </label>
                                    <input
                                        className="form-control py-4"
                                        id="inputEmailAddress"
                                        type={'text'}
                                        placeholder="Enter your user id"
                                        name="username"
                                        value={username}
                                        onChange={(e) => onInputChange(e)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="small my-3 d-flex" htmlFor="inputPassword">
                                        Password
                                    </label>
                                    <input
                                        className="form-control py-4"
                                        id="inputPassword"
                                        type="password"
                                        placeholder="Enter password"
                                        name="password"
                                        value={password}
                                        onChange={(e) => onInputChange(e)}
                                    />
                                </div>
                                <div className="form-group"></div>
                                <div className="form-group d-flex align-items-center justify-content-center mt-4 mb-0">
                                    {/* <Link className="small" to="/auth/forgot-password">
                                        Forgot Password?
                                    </Link> */}
                                    <button className="btn btn-primary" type="submit">
                                        Login
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="card-footer text-center">
                            <div className="small">
                                <Link to="/register">Need an account? Sign up!</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;

function Auth(jwt) {
    const cookies = new Cookies();
    cookies.remove('token');
    cookies.set('token', jwt, { path: '/' });
}

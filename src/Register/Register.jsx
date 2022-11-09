import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
    let navigate = useNavigate();
    const [newUser, setUser] = useState({
        userId: '',
        fullName: '',
        password: '',
        address: '',
        birthday: '',
        phone: '',
        email: '',
    });
    const [pass, setPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [error, setError] = useState({
        address: '',
        birthday: '',
        email: '',
        fullName: '',
        password: '',
        phone: '',
        status: '',
        userId: '',
    });
    const onInputChange = (e) => {
        setUser({ ...newUser, [e.target.name]: e.target.value });
    };
    const handlerPasswordChange = (e) => {
        if (confirmPass === e.target.value) setUser({ ...newUser, password: e.target.value });
        else setUser({ ...newUser, password: '' });
    };
    const handlerConfirmPassChange = (e) => {
        if (pass === e.target.value) setUser({ ...newUser, password: e.target.value });
        else setUser({ ...newUser, password: '' });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const nnewUser = {
            userId: newUser.userId,
            fullName: newUser.fullName,
            password: newUser.password,
            address: newUser.address,
            birthday: newUser.birthday,
            phone: newUser.phone,
            email: newUser.email,
        };
        await axios
            .post('http://localhost:8080/register', nnewUser)
            .then(() => {
                alert('Register success');
                navigate('/login');
            })
            .catch((e) => {
                setError(e.response.data.validationErrors);
                alert(e.response.data.message);
                console.log(e);
            });
    };

    return (
        <div id="layoutAuthentication">
            <div id="layoutAuthentication_content">
                <main>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-7">
                                <div className="card shadow-lg border-0 rounded-lg mt-5">
                                    <div className="card-header">
                                        <h3 className="text-center font-weight-light my-4">Create Account</h3>
                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={(e) => onSubmit(e)}>
                                            <div className="form-floating mb-3">
                                                <div className="form-floating mb-3 mb-md-0">
                                                    <input
                                                        className="form-control"
                                                        id="inputFirstName"
                                                        type="text"
                                                        placeholder="Enter your first name"
                                                        name="userId"
                                                        // value={userId}
                                                        onChange={(e) => onInputChange(e)}
                                                    />
                                                    <label htmlFor="inputFirstName">User name</label>
                                                    <div style={{ color: 'red' }}>{error.userId}</div>
                                                </div>
                                            </div>

                                            <div className="form-floating mb-3">
                                                <div className="form-floating">
                                                    <input
                                                        className="form-control"
                                                        id="inputLastName"
                                                        type="text"
                                                        placeholder="Enter your last name"
                                                        name="fullName"
                                                        // value={fullName}
                                                        onChange={(e) => onInputChange(e)}
                                                    />
                                                    <label htmlFor="inputLastName">Full name</label>
                                                    <div style={{ color: 'red' }}>{error.fullName}</div>
                                                </div>
                                            </div>

                                            <div className="form-floating mb-3">
                                                <input
                                                    className="form-control"
                                                    id="inputEmail"
                                                    type="email"
                                                    placeholder="name@example.com"
                                                    name="email"
                                                    // value={email}
                                                    onChange={(e) => onInputChange(e)}
                                                />
                                                <label htmlFor="inputEmail">Email address</label>
                                                <div style={{ color: 'red' }}>{error.email}</div>
                                            </div>
                                            <div className="form-floating mb-3">
                                                <input
                                                    className="form-control"
                                                    id="inputPhone"
                                                    type="text"
                                                    placeholder="+84"
                                                    name="phone"
                                                    // value={phone}
                                                    onChange={(e) => onInputChange(e)}
                                                />
                                                <label htmlFor="inputEmail">Phone</label>
                                                <div style={{ color: 'red' }}>{error.phone}</div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3 mb-md-0">
                                                        <input
                                                            className="form-control"
                                                            id="inputPassword"
                                                            type="password"
                                                            name="password"
                                                            // value={password}
                                                            onChange={(e) => {
                                                                setPass(e.target.value);
                                                                handlerPasswordChange(e);
                                                            }}
                                                            placeholder="Create a password"
                                                        />
                                                        <label htmlFor="inputPassword">Password</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3 mb-md-0">
                                                        <input
                                                            className="form-control"
                                                            id="inputPasswordConfirm"
                                                            type="password"
                                                            name="confirmPassword"
                                                            onChange={(e) => {
                                                                setConfirmPass(e.target.value);
                                                                handlerConfirmPassChange(e);
                                                            }}
                                                            placeholder="Confirm password"
                                                        />
                                                        <label htmlFor="inputPasswordConfirm">Confirm Password</label>
                                                    </div>
                                                </div>
                                                <div style={{ color: 'red' }}>{error.password}</div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3 mb-md-0">
                                                        <input
                                                            className="form-control"
                                                            id="inputAddress"
                                                            type="text"
                                                            placeholder="Input address"
                                                            // value={address}
                                                            name="address"
                                                            onChange={(e) => onInputChange(e)}
                                                        />
                                                        <label htmlFor="inputPassword">Address</label>
                                                        <div style={{ color: 'red' }}>{error.address}</div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3 mb-md-0">
                                                        <input
                                                            className="form-control"
                                                            id="inputBirthDate"
                                                            type="date"
                                                            placeholder="Input Birth date"
                                                            name="birthday"
                                                            // value={birthday}
                                                            onChange={(e) => onInputChange(e)}
                                                        />
                                                        <label htmlFor="inputPasswordConfirm">Birth date</label>
                                                        <div style={{ color: 'red' }}>{error.birthday}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4 mb-0">
                                                <div className="d-grid">
                                                    <button type="submit" className="btn btn-primary btn-block">
                                                        Create Account
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="card-footer text-center py-3">
                                        <div className="small">
                                            <Link to={'/login'}>Have an account? Go to login</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Register;

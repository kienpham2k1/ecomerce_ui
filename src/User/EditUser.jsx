import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Cookies } from 'react-cookie';
export default function EditUser() {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const isAdmin = () => {
        if (!cookies.get('token') || cookies.get('token').role != '[ROLE_ADMIN]') {
            navigate('/');
        }
    };

    const { id } = useParams();

    const [user, setUser] = useState({});

    const { fullName, password, address, birthday, phone, email, status } = user;
    const [roleName, setRoleName] = useState();
    const [confirnPassword, setConfirmPassword] = useState();
    const [errorConfirmPass, setErrorConfirmPass] = useState();
    const [error, setError] = useState({});
    const onInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };
    const onInputConfirmPassChange = (e) => {
        setConfirmPassword(([e.target.name] = e.target.value));
    };

    useEffect(() => {
        loadUser(id);
        isAdmin();
    }, []);
    const checkPassword = () => {
        try {
            if (confirnPassword != user.password) throw 'Password and confirm password is not equal!!!';
        } catch (e) {
            setErrorConfirmPass(e);
        }
    };
    const loadUser = async (userId) => {
        await axios
            .get(`http://localhost:8080/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${cookies.get('token').token}`,
                },
            })
            .then((data) => {
                setUser({
                    fullName: data.data.fullName,
                    password: '',
                    address: data.data.address,
                    birthday: data.data.birthday,
                    phone: data.data.phone,
                    email: data.data.email,
                    status: data.data.status,
                    roleId: data.data.tblRolesByRoleId.roleId,
                });
                setRoleName(data.data.tblRolesByRoleId.roleName);
            })
            .catch((e) => console.log(e));
    };
    const onSubmit = async (e) => {
        e.preventDefault();
        checkPassword();
        let token;
        token = cookies.get('token').token;
        await axios
            .put(`http://localhost:8080/users/${id}`, user, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => navigate('/userhome'))
            .catch((e) => {
                setError(e.response.data.validationErrors);
                console.log(user);
                console.log(confirnPassword);
            });
    };
    // const deleteUser = async (id) => {
    //     await axios
    //         .delete(`http://localhost:8080/users`, {
    //             params: { userId: id },
    //             headers: {
    //                 Authorization: `Bearer ${cookies.get('token').token}`,
    //             },
    //         })
    //         .then(() => {
    //             loadUser(id);
    //         })
    //         .catch((e) => console.log(e));
    // };
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Edit User</h2>

                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className="mb-3">
                            <label htmlFor="Name" className="form-label">
                                fullname
                            </label>
                            <input
                                type={'text'}
                                className="form-control"
                                placeholder="Enter your name"
                                name="fullName"
                                value={fullName}
                                onChange={(e) => onInputChange(e)}
                            />
                            <a style={{ color: 'red' }}>{error.fullName}</a>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Username" className="form-label">
                                User id
                            </label>
                            <input
                                type={'text'}
                                readOnly
                                disabled
                                className="form-control"
                                placeholder="Enter your username"
                                name="userId"
                                value={id}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Email" className="form-label">
                                Password
                            </label>
                            <input
                                type={'password'}
                                className="form-control"
                                placeholder="Input your password"
                                name="password"
                                value={password}
                                onChange={(e) => onInputChange(e)}
                            />
                            <a style={{ color: 'red' }}>{error.password}</a>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Email" className="form-label">
                                check Password
                            </label>
                            <input
                                type={'password'}
                                className="form-control"
                                placeholder="Confirm password"
                                name="confirnPassword"
                                value={confirnPassword}
                                onChange={(e) => onInputConfirmPassChange(e)}
                            />
                            <a style={{ color: 'red' }}>{errorConfirmPass}</a>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Email" className="form-label">
                                address
                            </label>
                            <input
                                type={'text'}
                                className="form-control"
                                placeholder="Enter your address"
                                name="address"
                                value={address}
                                onChange={(e) => onInputChange(e)}
                            />
                            <a style={{ color: 'red' }}>{error.address}</a>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Email" className="form-label">
                                birthday
                            </label>
                            <input
                                type={'date'}
                                className="form-control"
                                placeholder="Enter your birthday"
                                name="birthday"
                                value={birthday}
                                onChange={(e) => onInputChange(e)}
                            />
                            <a style={{ color: 'red' }}>{error.birthday}</a>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Email" className="form-label">
                                phone
                            </label>
                            <input
                                type={'text'}
                                className="form-control"
                                placeholder="Enter your phone"
                                name="phone"
                                value={phone}
                                onChange={(e) => onInputChange(e)}
                            />
                            <a style={{ color: 'red' }}>{error.phone}</a>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Email" className="form-label">
                                E-mail
                            </label>
                            <input
                                type={'text'}
                                className="form-control"
                                placeholder="Enter your e-mail address"
                                name="email"
                                value={email}
                                onChange={(e) => onInputChange(e)}
                            />
                            <a style={{ color: 'red' }}>{error.email}</a>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Email" className="form-label">
                                status
                            </label>
                            <input
                                disabled
                                readOnly
                                type={'text'}
                                className="form-control"
                                placeholder="Enter status"
                                name="status"
                                value={status}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Email" className="form-label">
                                roleName
                            </label>
                            <input
                                readOnly
                                disabled
                                type={'text'}
                                className="form-control"
                                placeholder="Enter your e-mail address"
                                name="roleName"
                                value={roleName}
                                // onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <button type="submit" className="btn btn-outline-primary">
                            Submit
                        </button>
                        <Link className="btn btn-outline-danger mx-2" to="/userhome">
                            Cancel
                        </Link>
                        {/* {user.status == 'IS_USING' ? (
                            <button className="btn btn-danger mx-2" onClick={() => deleteUser(id)}>
                                Delete
                            </button>
                        ) : (
                            <button className="btn btn-success mx-2" onClick={() => deleteUser(id)}>
                                Active
                            </button>
                        )} */}
                    </form>
                </div>
            </div>
        </div>
    );
}

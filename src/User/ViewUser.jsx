import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Cookies } from 'react-cookie';

export default function ViewUser() {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const isAdmin = () => {
        if (!cookies.get('token') || cookies.get('token').role != '[ROLE_ADMIN]') {
            navigate('/');
        }
    };

    const [user, setUser] = useState({});
    const [role, setRole] = useState({});
    const { id } = useParams();

    useEffect(() => {
        loadUser();
        isAdmin();
    }, []);

    const loadUser = async () => {
        await axios
            .get(`http://localhost:8080/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${cookies.get('token').token}`,
                },
            })
            .then((data) => {
                setUser(data.data);
                setRole(data.data.tblRolesByRoleId);
            })
            .catch((e) => console.log(e));
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">User Details</h2>

                    <div className="card">
                        <div className="card-header">
                            Details of user id : {user.userId}
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <b>full name:</b>
                                    {user.fullName}
                                </li>
                                <li className="list-group-item">
                                    <b>user id:</b>
                                    {user.userId}
                                </li>
                                <li className="list-group-item">
                                    <b>address:</b>
                                    {user.address}
                                </li>
                                <li className="list-group-item">
                                    <b>birthday:</b>
                                    {user.birthday}
                                </li>
                                <li className="list-group-item">
                                    <b>phone:</b>
                                    {user.phone}
                                </li>
                                <li className="list-group-item">
                                    <b>email:</b>
                                    {user.email}
                                </li>
                                <li className="list-group-item">
                                    <b>role:</b>
                                    {role.roleName}
                                </li>
                                <li className="list-group-item">
                                    <b>Status:</b>
                                    {user.status}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <Link className="btn btn-primary my-2" to={'/userhome'}>
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { color } from '@mui/system';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';
import { Link, useNavigate, useParams } from 'react-router-dom';

function UserHome() {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const isAdmin = () => {
        if (!cookies.get('token') || cookies.get('token').role != '[ROLE_ADMIN]') {
            navigate('/');
        }
    };

    const [users, setUsers] = useState([]);

    const { id } = useParams();

    useEffect(() => {
        loadUsers();
        isAdmin();
    }, []);

    const loadUsers = async () => {
        await axios
            .get('http://localhost:8080/users', {
                headers: {
                    Authorization: `Bearer ${cookies.get('token').token}`,
                },
            })
            .then((data) => {
                setUsers(data.data);
            })
            .catch((e) => console.log(e));
    };

    const deleteUser = async (id) => {
        await axios
            .delete(`http://localhost:8080/users`, {
                params: { userId: id },
                headers: {
                    Authorization: `Bearer ${cookies.get('token').token}`,
                },
            })
            .then(() => {
                loadUsers();
                alert('update status success fully');
            })
            .catch((e) => console.log(e));
    };
    return (
        <div className="container">
            <div className="py-4">
                <table className="table border shadow">
                    <thead>
                        <tr>
                            <th scope="col">S.N</th>
                            <th scope="col">full name</th>
                            <th scope="col">User id</th>
                            <th scope="col">status</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <th scope="row" key={index}>
                                    {index + 1}
                                </th>
                                <td>{user.fullName}</td>
                                <td>{user.userId}</td>

                                <td>{user.status}</td>
                                <td>
                                    <Link className="btn btn-primary mx-2" to={`/viewuser/${user.userId}`}>
                                        View
                                    </Link>
                                    <Link className="btn btn-outline-primary mx-2" to={`/edituser/${user.userId}`}>
                                        Edit
                                    </Link>
                                    {user.status == 'IS_USING' ? (
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => {
                                                deleteUser(user.userId);
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={() => {
                                                deleteUser(user.userId);
                                            }}
                                        >
                                            Active
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserHome;

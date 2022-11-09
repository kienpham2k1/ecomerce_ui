import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';
function AddNewCate() {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const isAdmin = () => {
        if (!cookies.get('token') || cookies.get('token').role != '[ROLE_ADMIN]') {
            navigate('/');
        }
    };
    useEffect(() => {
        isAdmin();
    }, []);
    const [cate, setCate] = useState({});
    const [error, setError] = useState({});

    const { catagoryName } = cate;

    const onInputChange = (e) => {
        setCate({ ...cate, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        await axios
            .post('http://localhost:8080/category', cate, {
                headers: {
                    Authorization: `Bearer ${cookies.get('token').token}`,
                },
            })
            .then(() => {
                alert('Add successfully');
                navigate('/homecategory');
            })
            .catch((e) => {
                setError(e.response.data.validationErrors);
                console.log(e.response);
            });
    };
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Add cate</h2>

                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className="mb-3">
                            <label htmlFor="Name" className="form-label">
                                Name
                            </label>
                            <input
                                type={'text'}
                                className="form-control"
                                placeholder="Enter your name"
                                name="catagoryName"
                                value={catagoryName}
                                onChange={(e) => onInputChange(e)}
                            />
                            <div style={{ color: 'red' }}> {error.catagoryName}</div>
                        </div>

                        <button type="submit" className="btn btn-outline-primary">
                            Submit
                        </button>
                        <Link className="btn btn-outline-danger mx-2" to="/homecategory">
                            Cancel
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddNewCate;

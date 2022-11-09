import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';

function HomeCategory() {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const isAdmin = () => {
        if (!cookies.get('token') || cookies.get('token').role != '[ROLE_ADMIN]') {
            navigate('/');
        }
    };
    const [error, setError] = useState({});
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        loadCategories();
        isAdmin();
    }, []);
    const loadCategories = async () => {
        await axios
            .get('http://localhost:8080/category')
            .then((data) => {
                setCategories(data.data.data);
                // console.log(data.data.data);
            })
            .catch((e) => {
                setError(e.response.data.validationErrors);
                console.log(e);
            });
    };

    const updateCate = async (cateId, item) => {
        // console.log(cateId);
        // console.log(item);
        await axios
            .put(`http://localhost:8080/category/${cateId}`, item, {
                headers: {
                    Authorization: `Bearer ${cookies.get('token').token}`,
                },
            })
            .then(() => {
                alert('update successfull');
                loadCategories();
            })
            .catch((e) => {
                alert(e.response.data.validationErrors.catagoryName);
                setError(e.response.data.validationErrors);
                console.log(e.response.data);
            });
    };
    const onInputChange = (e, index, id) => {
        const obj = { catagoryId: id, catagoryName: e.target.value };
        const array = [...categories];
        for (var i = 0; i <= array.length; i++) {
            if (i == index) {
                array[i] = obj;
            }
        }
        setCategories(array);
    };
    return (
        <div className="container">
            <div className="py-3">
                <Link to={'/addCate'} className="btn btn-outline-primary">
                    Add new Cate
                </Link>
            </div>
            <div className="pb-5">
                <table className="table border shadow">
                    <thead>
                        <tr>
                            {/* <th scope="col">#</th> */}
                            <th scope="col">#</th>
                            <th scope="col">Cate Name</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((item, index) => (
                            <tr key={index}>
                                {/* <th scope="row">{index + 1}</th> */}
                                <td>{index}</td>
                                <td>
                                    <input
                                        type={'text'}
                                        className="form-control"
                                        name={item.catagoryId}
                                        value={item.catagoryName}
                                        onChange={(e) => {
                                            onInputChange(e, index, item.catagoryId);
                                        }}
                                    />
                                </td>
                                <td>
                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={() => updateCate(item.catagoryId, item)}
                                    >
                                        Update
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default HomeCategory;

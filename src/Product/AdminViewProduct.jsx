import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
function AdminViewProduct() {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState([]);
    const [category, setCategory] = useState({});
    useEffect(() => {
        loadProduct();
    }, []);
    const [error, setError] = useState({});
    const loadProduct = async () => {
        if (!cookies.get('token') || cookies.get('token').role != '[ROLE_ADMIN]') {
            navigate('/');
        }
        var token = '';
        if (cookies.get('token')) {
            token = cookies.get('token').token;
            // userId = cookies.get('token').userId;
            console.log(token);
        }
        await axios
            .get(`http://localhost:8080/products/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((data) => {
                setProduct(data.data.data);
                //category = data.data.data.tblCategoriesByCatagoryId;
                setCategory(data.data.data.tblCategoriesByCatagoryId);
            })
            .catch((e) => {
                setError(e.response.data);
                //console.log(product);
            });
    };
    if (product.length == 0)
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                        <h2 className="text-center m-4" style={{ color: 'red' }}>
                            {error.message}
                        </h2>
                    </div>
                </div>
            </div>
        );
    else {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                        <h2 className="text-center m-4">Product detail id: {product.productId}</h2>

                        <div className="card">
                            <div className="card-header">
                                {/* Details of user id : {user.id} */}
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">
                                        <b>imgMain:</b>
                                        <img
                                            className="img-rounded mx-auto d-block shadow"
                                            style={{ width: '150px', height: '150px' }}
                                            src={product.imgMain}
                                        />
                                    </li>
                                    <li className="list-group-item">
                                        <b>Product Name:</b>
                                        {product.productName}
                                    </li>
                                    <li className="list-group-item">
                                        <b>Description:</b>
                                        {product.description}
                                    </li>
                                    <li className="list-group-item">
                                        <b>Create Date:</b>
                                        {product.createDate}
                                    </li>
                                    <li className="list-group-item">
                                        <b>price:</b>
                                        {product.price}
                                    </li>
                                    <li className="list-group-item">
                                        <b>quantity:</b>
                                        {product.quantity}
                                    </li>
                                    <li className="list-group-item">
                                        <b>catagoryId:</b>
                                        {category.catagoryName}
                                    </li>
                                    <li className="list-group-item">
                                        <b>status:</b>
                                        {product.status}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <Link className="btn btn-primary my-2" to={'/product-manager'}>
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default AdminViewProduct;

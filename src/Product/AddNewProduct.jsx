import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

function AddNewProduct() {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const isAdmin = () => {
        if (!cookies.get('token') || cookies.get('token').role != '[ROLE_ADMIN]') {
            navigate('/');
        }
    };
    const [newProduct, setNewProduct] = useState({
        productName: '',
        description: '',
        price: '',
        quantity: 0,
        catagoryId: '',
        imgMain: '',
    });
    useEffect(() => {
        loadCategories();
        isAdmin();
    }, []);
    const { productName, description, price, quantity, catagoryId, imgMain } = newProduct;
    const [error, setError] = useState({});
    const [categories, setCategories] = useState([]);
    const loadCategories = async () => {
        await axios
            .get('http://localhost:8080/category')
            .then((data) => {
                setCategories(data.data.data);
                setNewProduct({
                    productName: '',
                    description: '',
                    price: '',
                    quantity: 0,
                    catagoryId: data.data.data[0].catagoryId,
                    imgMain: '',
                });
            })
            .catch((e) => {
                setCategories([]);
                console.log(e);
            });
    };
    const onInputChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };
    const onSubmit = async (e) => {
        var token = '';
        if (cookies.get('token')) {
            token = cookies.get('token').token;
        }
        e.preventDefault();
        await axios
            .post('http://localhost:8080/products', newProduct, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                navigate('/product-manager');
            })
            .catch((e) => {
                setError(e.response.data.validationErrors);
            });
    };
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Add new product</h2>

                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className="mb-3">
                            <label htmlFor="Name" className="form-label">
                                Name product
                            </label>
                            <input
                                type={'text'}
                                className="form-control"
                                placeholder="Enter product name"
                                name="productName"
                                value={productName}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className="mb-2" style={{ color: 'red' }}>
                            {error.productName}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Username" className="form-label">
                                description
                            </label>
                            <input
                                type={'text'}
                                className="form-control"
                                placeholder="Enter description"
                                name="description"
                                value={description}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className="mb-2" style={{ color: 'red' }}>
                            {error.description}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Email" className="form-label">
                                price
                            </label>
                            <input
                                type={'number'}
                                className="form-control"
                                placeholder="Enter price"
                                name="price"
                                value={price}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>{' '}
                        <div className="mb-2" style={{ color: 'red' }}>
                            {error.price}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Email" className="form-label">
                                quantity
                            </label>
                            <input
                                type={'number'}
                                className="form-control"
                                placeholder="Enter quantity"
                                name="quantity"
                                value={quantity}
                                min="0"
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className="mb-2" style={{ color: 'red' }}>
                            {error.quantity}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Email" className="form-label">
                                catagoryId
                            </label>
                            <select
                                name="catagoryId"
                                //defaultValue="Select Category"
                                onChange={onInputChange}
                                className="form-select"
                                aria-label="Default select example"
                            >
                                {categories.map((item, index) => (
                                    <option key={index} value={item.catagoryId}>
                                        {item.catagoryName}
                                    </option>
                                ))}
                            </select>
                        </div>{' '}
                        <div className="mb-2" style={{ color: 'red' }}>
                            {error.catagoryId}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Email" className="form-label">
                                imgMain
                            </label>
                            <input
                                type={'text'}
                                className="form-control"
                                placeholder="Input image of product"
                                name="imgMain"
                                value={imgMain}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className="mb-2" style={{ color: 'red' }}>
                            {error.imgMain}
                        </div>
                        <button type="submit" className="btn btn-outline-primary">
                            Submit
                        </button>
                        <Link className="btn btn-outline-danger mx-2" to="/product-manager">
                            Cancel
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddNewProduct;

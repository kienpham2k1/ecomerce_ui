import axios from 'axios';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import * as React from 'react';
function Rate() {
    let navigate = useNavigate();
    const cookies = new Cookies();
    const { id } = useParams();

    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const [rate, setRate] = useState({});
    const [product, setProduct] = useState({});
    const [value, setValue] = useState(0);
    const isLogin = () => {
        if (!cookies.get('token') || cookies.get('token').role != '[ROLE_USER]') {
            navigate('/login');
        }
    };

    const loadProduct = async () => {
        const token = cookies.get('token');
        console.log(params.get('orderId'));
        console.log(id);
        await axios
            .get(`http://localhost:8080/rate`, {
                params: {
                    productId: id,
                    orderId: params.get('orderId'),
                },
                headers: {
                    Authorization: `Bearer ${cookies.get('token').token}`,
                },
            })
            .then((data) => {
                setRate(data.data.data);
                // setProduct(data.data.data.tblProductsByProductId);
                setValue(data.data.data.score);
            })
            .catch((e) => {
                setRate({});
                setValue(0);
                console.log(e.response.data.code != 404);
                if (e.response.data.code != 404) navigate('/order');
            });
    };
    useEffect(() => {
        loadProduct();
        loadProductDettail();
        isLogin();
    }, []);
    const loadProductDettail = async () => {
        await axios
            .get(`http://localhost:8080/products/${id}`)
            .then((data) => {
                setProduct(data.data.data);
            })
            .catch((e) => {});
    };
    const rating = async (idRate, idProd, uId, sc) => {
        // console.log(cookies.get('token').userId);
        if (idRate) {
            const udRate = { ratingId: idRate, productId: idProd, userId: uId, score: sc };
            console.log(udRate);
            await axios
                .put(`http://localhost:8080/rate?rateId=${rate.ratingId}`, udRate, {
                    headers: {
                        Authorization: `Bearer ${cookies.get('token').token}`,
                    },
                })
                .then(() => loadProduct())
                .catch((e) => console.log(e));
        } else {
            const udRate = { productId: idProd, userId: uId, score: sc };
            console.log(udRate);
            await axios
                .post(`http://localhost:8080/rate`, udRate, {
                    params: { orderId: params.get('orderId') },
                    headers: {
                        Authorization: `Bearer ${cookies.get('token').token}`,
                    },
                })
                .then(() => loadProduct())
                .catch((e) => console.log(e));
        }
    };
    const deleting = async (id) => {
        await axios
            .delete(`http://localhost:8080/rate/${rate.ratingId}`, {
                headers: {
                    Authorization: `Bearer ${cookies.get('token').token}`,
                },
            })
            .then(() => {
                loadProduct();
            })
            .catch((e) => loadProduct());
    };
    return (
        <div className=" container">
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Product Name</th>
                        <th scope="col">Rate</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{product.productName}</td>
                        <td>
                            <Rating
                                name="simple-controlled"
                                value={value}
                                onChange={(event, newValue) => {
                                    setValue(newValue);
                                }}
                            />
                        </td>
                        <td>
                            <button onClick={() => rating(rate.ratingId, id, cookies.get('token').userId, value)}>
                                Rate
                            </button>
                            {rate.ratingId ? (
                                <button onClick={() => deleting(rate.ratingId)}>Delete</button>
                            ) : (
                                console.log('not rating')
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Rate;

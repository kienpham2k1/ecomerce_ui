import { Button, FormControl, InputLabel, MenuItem, Pagination, Select, Stack } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
let size = 3;
let sortTb = 'productId';
let sortStyle = 'ASC';
let x = 1;
function ProductManagement() {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const [listProduct, setListProduct] = useState([]);
    const [countPage, setCountPage] = useState();
    useEffect(() => {
        loadProducts();
    }, []);
    const loadProducts = async () => {
        let token;
        if (!cookies.get('token') || cookies.get('token').role != '[ROLE_ADMIN]') {
            navigate('/');
        }
        token = cookies.get('token').token;
        await axios
            .get('http://localhost:8080/products', {
                params: {
                    page: x - 1,
                    size: size,
                    sortTable: sortTb,
                    sort: sortStyle,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((data) => {
                // console.log(data.data.data);
                setListProduct(data.data.data.content);
                setCountPage(data.data.data.totalPages);
            })
            .catch((e) => {
                setListProduct([]);
                console.log(e);
            });
    };
    const deleteProduct = async (productId, newStatus) => {
        let token;
        token = cookies.get('token').token;
        let stt;
        if (newStatus == 'STOCKING') {
            stt = 'OUT_OF_STOCK';
        } else if (newStatus == 'OUT_OF_STOCK') stt = 'STOCKING';
        await axios
            .delete(`http://localhost:8080/products/${productId}`, {
                params: { status: stt },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                alert('Update status successfully');
                handleClose();
                loadProducts();
            })
            .catch((e) => {
                loadProducts();
                console.log(e);
            });
    };
    const handleChangePage = (event, value) => {
        x = value;
        console.log(value);
        loadProducts();
    };
    const handleChangeSizePage = (event) => {
        size = event.target.value;
        // console.log(event.target.value);
        loadProducts();
    };
    const handleChangeSortTB = (event) => {
        sortTb = event.target.value;
        // console.log(event.target.value);
        loadProducts();
    };
    const handleChangeSortStyle = (event) => {
        sortStyle = event.target.value;
        // console.log(event.target.value);
        loadProducts();
    };
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="py-4">
            <Link className="btn btn-primary m-4" to={'/addnewproduct'}>
                Add new product
            </Link>
            <div className="d-flex justify-content-between m-4">
                {/* <div className="d-flex justify-content-start m-4"></div> */}
                <div></div>
                <div className="d-flex justify-content-center m-4">
                    <Stack spacing={3}>
                        <Pagination count={countPage} color="primary" onChange={handleChangePage} />
                    </Stack>
                </div>
                <div className="d-flex justify-content-end m-4">
                    <div>
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-label">Sort by</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="sortTb"
                                value={sortTb}
                                onChange={handleChangeSortTB}
                            >
                                <MenuItem value={'productId'}>Product Id</MenuItem>
                                <MenuItem value={'createDate'}>Create Date</MenuItem>
                                <MenuItem value={'price'}>Price</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div>
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-label">Sort</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="sortStyle"
                                value={sortStyle}
                                onChange={handleChangeSortStyle}
                            >
                                <MenuItem value={'ASC'}>ASC</MenuItem>
                                <MenuItem value={'DESC'}>DESC</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div>
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-label">Size Page</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Size Page"
                                value={size}
                                onChange={handleChangeSizePage}
                            >
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={6}>6</MenuItem>
                                <MenuItem value={9}>9</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
            </div>

            <table className="table border shadow">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">imgMain</th>
                        <th scope="col">Product Name</th>
                        <th scope="col">price</th>
                        <th scope="col">quantity</th>
                        <th scope="col">category </th>
                        <th scope="col">status</th>
                    </tr>
                </thead>
                <tbody>
                    {listProduct.map((item, index) => (
                        <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>
                                <img
                                    className="card-img-top"
                                    src={item.imgMain}
                                    style={{ height: '150px', width: '150px' }}
                                />
                            </td>
                            <td>{item.productName}</td>
                            <td>{item.price}</td>
                            <td>{item.quantity}</td>
                            <td>{item.tblCategoriesByCatagoryId.catagoryName}</td>
                            <td>{item.status}</td>
                            <td>
                                {item.status == 'STOCKING' ? (
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => {
                                            deleteProduct(item.productId, item.status);
                                        }}
                                    >
                                        Out stock
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => {
                                            deleteProduct(item.productId, item.status);
                                        }}
                                    >
                                        In stock
                                    </Button>
                                )}
                            </td>
                            <td>
                                <Link className="btn btn-primary mx-2" to={`/admin-view-product/${item.productId}`}>
                                    View
                                </Link>
                            </td>
                            <td>
                                <Link className="btn btn-outline-primary mx-2" to={`/editproduct/${item.productId}`}>
                                    Edit
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProductManagement;

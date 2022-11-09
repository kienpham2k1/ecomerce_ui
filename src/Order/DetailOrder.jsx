import axios from 'axios';
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Stack } from '@mui/system';
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
export default function DetailOrder() {
    const cookies = new Cookies();
    let navigate = useNavigate();

    const { orderId } = useParams();
    const [orderDetail, setOderDetail] = useState({});
    const [listOrderItem, setListOrderItem] = useState([]);
    useEffect(() => {
        loadOrderDetail();
    }, []);
    const loadOrderDetail = async () => {
        if (!cookies.get('token')) {
            return navigate('/login');
        }
        if (cookies.get('token').role != '[ROLE_USER]') return navigate('/');
        await axios
            .get(`http://localhost:8080/order/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${cookies.get('token').token}`,
                },
            })
            .then((data) => {
                setOderDetail(data.data.data);
                setListOrderItem(data.data.data.tblOrderItemsByOrderId);
            })
            .catch((e) => {
                console.log(e);
            });
    };
    const cancelOrder = async (orderId) => {
        await axios
            .delete(`http://localhost:8080/order/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${cookies.get('token').token}`,
                },
            })
            .then(() => {
                loadOrderDetail();
            })
            .catch((e) => {
                console.log(e);
            });
    };
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <div className="container">
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Order Date</th>
                        <th scope="col">Total</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{orderDetail.orderDate}</td>
                        <td>{orderDetail.total}</td>
                        <td>{orderDetail.status}</td>
                        {/* <td onClick={() => cancelOrder(orderDetail.orderId)}>
                            <Status status={orderDetail.status} />
                        </td> */}
                        <td>
                            {orderDetail.status == 'REQUEST' ? (
                                <div>
                                    <Button onClick={handleClickOpen} variant="contained" color="error">
                                        Cancel
                                    </Button>
                                    <Dialog
                                        open={open}
                                        onClose={handleClose}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                    >
                                        <DialogTitle id="alert-dialog-title">{'Cancel this order?'}</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-description">
                                                Do you really want to candel this order?
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleClose} variant="contained" color="error">
                                                No
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    cancelOrder(orderDetail.orderId);
                                                    handleClose();
                                                }}
                                                autoFocus
                                                variant="contained"
                                                color="success"
                                            >
                                                Yes
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </div>
                            ) : (
                                <div></div>
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="py-4">
                <table className="table border shadow">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Product name</th>
                            <th scope="col">Price</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listOrderItem.map((item, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{item.tblProductsByProductId.productName}</td>
                                <td>{item.tblProductsByProductId.price}</td>
                                <td>{item.quantity}</td>
                                <td>{item.price}</td>
                                <td>
                                    {orderDetail.status == 'COMPLETED' ? (
                                        <Link to={`/rate/${item.productId}?orderId=${orderId}`}>Rate</Link>
                                    ) : (
                                        <div></div>
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
function Status(props) {
    const cookies = new Cookies();
    const status = props.status;
    // const cancelOrder = async (orderId) => {
    //     await axios
    //         .put(`http://localhost:8080/order/${orderId}?status=CANCELLED`, {
    //             headers: {
    //                 Authorization: `Bearer ${cookies.get('token').token}`,
    //             },
    //         })
    //         .then((data) => {
    //             // loadOrder();
    //         })
    //         .catch((e) => {
    //             console.log(e);
    //         });
    // };
    if (status == 'REQUEST') return <button className="btn btn-danger mx-2">Cancle</button>;
}

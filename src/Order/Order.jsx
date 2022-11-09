import axios from 'axios';
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { Link, redirect, useNavigate } from 'react-router-dom';
// import { Button } from 'bootstrap';
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
function Order() {
    const navigate = useNavigate();
    const cookies = new Cookies();

    const [orderList, setOrderList] = useState([]);
    useEffect(() => {
        loadOrder();
    }, []);
    const loadOrder = async () => {
        if (!cookies.get('token')) {
            return navigate('/login');
        }
        if (cookies.get('token').role != '[ROLE_USER]') return navigate('/');
        await axios
            .get(`http://localhost:8080/order?userId=${cookies.get('token').userId}`, {
                headers: {
                    Authorization: `Bearer ${cookies.get('token').token}`,
                },
            })
            .then((data) => {
                setOrderList(data.data.data);
            })
            .catch((e) => {
                setOrderList([]);
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
            .then((data) => {
                loadOrder();
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
    // const viewOrderDetail = async () => {};
    return (
        <div className="container">
            <div className="py-4">
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell align="right">Order Date</TableCell>
                                <TableCell align="right">Total&nbsp;($)</TableCell>
                                <TableCell align="right">Status</TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orderList.map((item, index) => (
                                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell align="right">{item.orderDate}</TableCell>
                                    <TableCell align="right">{item.total}</TableCell>
                                    <TableCell align="right">{item.status}</TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                                            <Button
                                                variant="contained"
                                                onClick={(e) => {
                                                    navigate(`/orderdetail/${item.orderId}`);
                                                }}
                                            >
                                                View
                                            </Button>
                                            {item.status == 'REQUEST' ? (
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
                                                        <DialogTitle id="alert-dialog-title">
                                                            {'Cancel this order?'}
                                                        </DialogTitle>
                                                        <DialogContent>
                                                            <DialogContentText id="alert-dialog-description">
                                                                Do you really want to candel this order?
                                                            </DialogContentText>
                                                        </DialogContent>
                                                        <DialogActions>
                                                            <Button
                                                                onClick={handleClose}
                                                                variant="contained"
                                                                color="error"
                                                            >
                                                                No
                                                            </Button>
                                                            <Button
                                                                onClick={() => {
                                                                    cancelOrder(item.orderId);
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
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
}

export default Order;

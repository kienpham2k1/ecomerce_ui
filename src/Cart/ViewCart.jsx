import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, redirect, useNavigate } from 'react-router-dom';
import styles from './ViewCart.css';
import Cookies from 'universal-cookie';
import { Alert, AlertTitle, Checkbox, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import * as React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
var arr = [];
export default function ViewCart() {
    const cookies = new Cookies();
    let navigate = useNavigate();
    const [cartList, setCartList] = useState([]);
    let total = 0;
    cartList.map((item) => (total += item.price));
    useEffect(() => {
        loadCartList();
        arr = [];
    }, []);

    const loadCartList = async () => {
        if (!cookies.get('token')) {
            return navigate('/login');
        }
        if (cookies.get('token').role != '[ROLE_USER]') return navigate('/');
        await axios
            .get(`http://localhost:8080/cart?userId=${cookies.get('token').userId}`, {
                headers: {
                    Authorization: `Bearer ${cookies.get('token').token}`,
                },
            })
            .then((data) => {
                setCartList(data.data.data);
            })
            .catch((e) => {
                setCartList([]);
            });
        // }
    };
    const updateCartItem = async (cartId, productId, quantity) => {
        const item = {
            userId: cookies.get('token').userId,
            productId: productId,
            quantity: quantity,
        };
        await axios
            .put(`http://localhost:8080/cart/${cartId}`, item, {
                headers: {
                    Authorization: `Bearer ${cookies.get('token').token}`,
                },
            })
            .then((data) => {
                console.log(data.data.message);
            })
            .catch((e) => {
                console.log(e.response.data.message);
                // console.log(e);
            });
        loadCartList();
    };
    const deleteCartItem = async (cartId) => {
        await axios.delete(`http://localhost:8080/cart/${cartId}`, {
            headers: {
                Authorization: `Bearer ${cookies.get('token').token}`,
            },
        });
        loadCartList();
    };
    let newOrder;

    if (cookies.get('token')) {
        newOrder = { userId: cookies.get('token').userId };
    }
    const cartSelected = { newOrder: newOrder, cartList: cartList };
    const onChecked = (e, item) => {
        if (e.target.checked) {
            arr.push(item);
        } else {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].cartId == item.cartId) arr.splice(i, 1);
            }
        }
        console.log(arr);
    };
    const handleClose = () => {
        console.log('close');
    };
    return (
        <div className="m-5">
            <div className="wrapper wrapper-content animated fadeInRight">
                <div className="row">
                    {/* <div className="col-md-9"> */}
                    <div className="ibox">
                        <div className="ibox-title mt-5">
                            <span className="pull-right">
                                (<strong>{cartList.length}</strong>) items
                            </span>
                            <h5>Items in your cart</h5>
                        </div>
                        <IconButton
                            onClick={() => {
                                loadCartList();
                            }}
                        >
                            <RefreshIcon />
                        </IconButton>
                        {cartList.length > 0 ? (
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell></TableCell>
                                                    <TableCell>Index</TableCell>
                                                    <TableCell align="left">Product</TableCell>
                                                    <TableCell align="right">Price&nbsp;($)</TableCell>
                                                    <TableCell align="left">Quantity&nbsp;(per)</TableCell>
                                                    <TableCell align="right">Total Price&nbsp;($)</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {cartList.map((item, index) => (
                                                    <TableRow
                                                        key={index}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                            {item.valid ? (
                                                                <Checkbox onChange={(e) => onChecked(e, item)} />
                                                            ) : (
                                                                <div></div>
                                                            )}
                                                            {/* <Checkbox onChange={(e) => onChecked(e, item)} /> */}
                                                        </TableCell>
                                                        <TableCell component="th" scope="row">
                                                            {index + 1}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Box>
                                                                <Box
                                                                    sx={{
                                                                        bgcolor: 'background',
                                                                        boxShadow: 2,
                                                                        borderRadius: 1,
                                                                        p: 1,
                                                                        minHeight: 200,
                                                                    }}
                                                                >
                                                                    <Box sx={{ color: 'text.secondary' }}>
                                                                        {item.tblProductsByProductId.productName}
                                                                    </Box>
                                                                    <Box
                                                                        sx={{
                                                                            color: 'text.primary',
                                                                            fontSize: 34,
                                                                            fontWeight: 'medium',
                                                                        }}
                                                                    >
                                                                        <img
                                                                            src={item.tblProductsByProductId.imgMain}
                                                                            style={{
                                                                                maxWidth: '150px',
                                                                                maxHeight: '150px',
                                                                            }}
                                                                        />
                                                                    </Box>
                                                                    {!item.valid ? (
                                                                        <Box
                                                                            sx={{
                                                                                ml: 1,
                                                                                color: 'red',
                                                                                fontSize: 16,
                                                                                fontWeight: 'bold',
                                                                            }}
                                                                        >
                                                                            Item is out stock
                                                                        </Box>
                                                                    ) : (
                                                                        <div></div>
                                                                    )}
                                                                    <Box>
                                                                        <Button
                                                                            onClick={() => {
                                                                                deleteCartItem(item.cartId);
                                                                            }}
                                                                        >
                                                                            Delete cart item
                                                                        </Button>
                                                                    </Box>
                                                                </Box>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {item.tblProductsByProductId.price}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <input
                                                                className="form-control text-center me-5"
                                                                id="inputQuantity"
                                                                min={0}
                                                                max={item.tblProductsByProductId.quantityProduct}
                                                                style={{ maxWidth: '5rem' }}
                                                                type={'number'}
                                                                name="quantity"
                                                                value={item.quantity}
                                                                onChange={(e) => {
                                                                    updateCartItem(
                                                                        item.cartId,
                                                                        item.productId,
                                                                        e.target.value,
                                                                    );
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="right">{item.price}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                                <Grid item xs={4}>
                                    <Box
                                        sx={{
                                            bgcolor: 'background.paper',
                                            boxShadow: 2,
                                            borderRadius: 2,
                                            p: 2,
                                            minWidth: 300,
                                        }}
                                    >
                                        <Box sx={{ color: 'text.secondary' }}>Total</Box>
                                        <Box sx={{ color: 'text.primary', fontSize: 34, fontWeight: 'medium' }}>
                                            {total}&nbsp;($)
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        ) : (
                            <div></div>
                        )}
                        <div className="ibox-content my-5">
                            {cartList.length > 0 ? <MaxWidthDialog></MaxWidthDialog> : <div></div>}
                            {MaxWidthDialog.open}
                            <Link to={'/'} className="btn btn-primary m-3">
                                <i className="fa fa-arrow-left"></i> Continue shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
function MaxWidthDialog() {
    let total = 0;
    arr.map((item) => (total += item.price));
    const cookies = new Cookies();
    let navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('xl');
    const checkOut = async () => {
        await axios
            .post(`http://localhost:8080/order`, arr, {
                headers: {
                    Authorization: `Bearer ${cookies.get('token').token}`,
                },
            })
            .then(() => {
                navigate('/order');
            })
            .catch((e) => {
                handleClickOpenAlerts();
                console.log(e.response);
                handleClose();
            });
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [openAlerts, setOpenAlerts] = React.useState(false);

    const handleClickOpenAlerts = () => {
        setOpenAlerts(true);
    };

    const handleCloseAlerts = () => {
        setOpenAlerts(false);
    };

    return (
        <React.Fragment>
            <div>
                <Dialog
                    open={openAlerts}
                    onClose={handleCloseAlerts}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        This is an error alert — <strong>check it out!</strong>
                    </Alert>
                </Dialog>
            </div>
            <Button variant="outlined" onClick={handleClickOpen}>
                Check out
            </Button>
            <Dialog fullWidth={fullWidth} maxWidth={maxWidth} open={open} onClose={handleClose}>
                <DialogTitle>Cart Detail</DialogTitle>
                {arr.length > 0 ? (
                    <DialogContent>
                        <DialogContentText>This is your cart you has select.</DialogContentText>
                        <Box
                            noValidate
                            component="form"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                m: 'auto',
                                width: 'fit-content',
                            }}
                        ></Box>
                    </DialogContent>
                ) : (
                    <DialogContent>
                        <DialogContentText>Cart is empty. Please select your item order.</DialogContentText>
                        <Box
                            noValidate
                            component="form"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                m: 'auto',
                                width: 'fit-content',
                            }}
                        ></Box>
                    </DialogContent>
                )}
                {arr.length > 0 ? (
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Index</TableCell>
                                                <TableCell align="left">Product</TableCell>
                                                <TableCell align="right">Price&nbsp;($)</TableCell>
                                                <TableCell align="right">Quantity&nbsp;(per)</TableCell>
                                                <TableCell align="right">Total Price&nbsp;($)</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {arr.map((item, index) => (
                                                <TableRow
                                                    key={index}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Box>
                                                            <Box
                                                                sx={{
                                                                    bgcolor: 'background',
                                                                    boxShadow: 2,
                                                                    borderRadius: 1,
                                                                    p: 1,
                                                                    minHeight: 200,
                                                                }}
                                                            >
                                                                <Box sx={{ color: 'text.secondary' }}>
                                                                    {item.tblProductsByProductId.productName}
                                                                </Box>
                                                                <Box
                                                                    sx={{
                                                                        color: 'text.primary',
                                                                        fontSize: 34,
                                                                        fontWeight: 'medium',
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={item.tblProductsByProductId.imgMain}
                                                                        style={{
                                                                            maxWidth: '150px',
                                                                            maxHeight: '150px',
                                                                        }}
                                                                    />
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {item.tblProductsByProductId.price}
                                                    </TableCell>
                                                    <TableCell align="right">{item.quantity}</TableCell>
                                                    <TableCell align="right">{item.price}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                            <Grid item xs={4}>
                                <Box
                                    sx={{
                                        bgcolor: 'background',
                                        boxShadow: 2,
                                        borderRadius: 2,
                                        p: 2,
                                        minWidth: 300,
                                    }}
                                >
                                    <Box sx={{ color: 'text.secondary' }}>Total</Box>
                                    <Box sx={{ color: 'text.primary', fontSize: 34, fontWeight: 'medium' }}>
                                        {total}&nbsp;($)
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </DialogContent>
                ) : (
                    <div></div>
                )}
                <DialogActions>
                    {arr.length > 0 ? (
                        <Button variant="contained" onClick={checkOut}>
                            Check Out
                        </Button>
                    ) : (
                        <div></div>
                    )}
                    <Button onClick={handleClose} variant="contained" color="error">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

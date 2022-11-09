import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { Alert, AlertTitle, Snackbar } from '@mui/material';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function ViewProduct() {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const { id } = useParams();

    const [product, setProduct] = useState({});
    const [newCartItem, setNewCartItem] = useState({
        userId: '',
        productId: 0,
        quantity: 0,
    });
    const { quantity } = newCartItem;

    useEffect(() => {
        loadProduct();
    }, []);

    const loadProduct = async () => {
        var token = '';
        var userId;
        if (cookies.get('token')) {
            token = cookies.get('token').token;
            userId = cookies.get('token').userId;
        }
        const result = await axios.get(`http://localhost:8080/products/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setNewCartItem({
            userId: userId,
            productId: result.data.data.productId,
            quantity: 1,
        });
        setProduct(result.data.data);
    };
    const onInputChange = (e) => {
        setNewCartItem({ ...newCartItem, [e.target.name]: e.target.value });
    };
    const onSubmit = async (e) => {
        var token;
        if (cookies.get('token')) {
            token = cookies.get('token').token;
            e.preventDefault();
            await axios
                .post('http://localhost:8080/cart', newCartItem, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(() => {
                    handleClick2();
                })
                .catch((e) => {
                    console.log(e);
                    handleClickOpen();
                });
        } else {
            navigate('/login');
        }
    };
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const [state, setState] = React.useState({
        open2: false,
        vertical: 'top',
        horizontal: 'right',
    });

    const { vertical, horizontal, open2 } = state;

    const handleClick2 = () => {
        setState({ ...state, open2: true });
    };

    const handleClose2 = () => {
        setState({ ...state, open2: false });
    };
    return (
        // <!-- Product section-->
        <section className="py-5">
            <div>
                <Snackbar
                    anchorOrigin={{ vertical, horizontal }}
                    open={open2}
                    onClose={handleClose2}
                    key={vertical + horizontal}
                >
                    <Alert variant="filled" severity="success">
                        Add to cart successfully.
                    </Alert>
                </Snackbar>
            </div>
            <div>
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        Quantity added is over — <strong>check cart!</strong>
                    </Alert>
                </Dialog>
            </div>
            <div className="container px-4 px-lg-5 my-5">
                <div className="row gx-4 gx-lg-5 align-items-center">
                    <div className="col-md-6">
                        <img className="card-img-top mb-5 mb-md-0" src={product.imgMain} alt="..." />
                    </div>
                    <div className="col-md-6">
                        <form onSubmit={(e) => onSubmit(e)}>
                            <div className="small mb-1">{product.productId}</div>
                            <h1 className="display fw-bolder">{product.productName}</h1>
                            <div className="fs-5 mb-5">
                                <span>{product.price}</span>
                            </div>
                            <p className="lead">{product.description}</p>
                            <div className="d-flex">
                                <input
                                    className="form-control text-center me-3"
                                    id="inputQuantity"
                                    min={1}
                                    max={product.quantity}
                                    style={{ maxWidth: '5rem' }}
                                    type={'number'}
                                    name="quantity"
                                    placeholder="1"
                                    value={quantity}
                                    onChange={(e) => onInputChange(e)}
                                />
                                <button className="btn btn-outline-dark flex-shrink-0" type="submit">
                                    <i className="bi-cart-fill me-1"></i>
                                    Add to cart
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

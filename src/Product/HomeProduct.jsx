import axios from 'axios';
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { Stack } from '@mui/system';
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import {
    Alert,
    AlertTitle,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Pagination,
    Rating,
    Select,
    Snackbar,
    TablePagination,
} from '@mui/material';
import Header from '../layout/Header';
let x = 1;
let cateId;
let nameProduct;
let size = 3;
let sortTb = 'productId';
let sortStyle = 'ASC';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
function IndexHomeProduct() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const cookies = new Cookies();
    const naviagate = useNavigate();
    const [products, setProducts] = useState([]);
    const [cate, setCate] = useState([]);
    const [productName, setproductName] = useState();
    const [countPage, setCountPage] = useState();
    const [error, setError] = useState();
    useEffect(() => {
        loadProducts();
        loadCate();
    }, []);

    const loadProducts = async () => {
        let token;
        if (cookies.get('token')) {
            token = cookies.get('token').token;
            console.log(token);
        }
        await axios
            .get(
                'http://localhost:8080/products',
                {
                    params: {
                        page: x - 1,
                        size: size,
                        sortTable: sortTb,
                        sort: sortStyle,
                        nameProduct: nameProduct,
                        categoryId: cateId,
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
            .then((data) => {
                setProducts(data.data.data.content);
                setCountPage(data.data.data.totalPages);
            })
            .catch((e) => {
                console.log(e);
                setproductName();
                setError(e.response.data.message);
                setProducts([]);
            });
    };
    const addToCart = async (productId) => {
        var token;
        if (cookies.get('token')) {
            token = cookies.get('token').token;
            const item = { userId: cookies.get('token').userId, productId: productId, quantity: 1 };
            await axios
                .post('http://localhost:8080/cart', item, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((data) => {
                    handleClick2();
                    console.log(data.data.message);
                })
                .catch((e) => {
                    console.log(e.response.data.message);
                    handleClickOpen();
                });
        } else naviagate('/login');
    };
    const handleChangePage = (event, value) => {
        x = value;
        console.log(value);
        loadProducts();
    };
    const handleChangeSizePage = (event) => {
        size = event.target.value;
        x = 1;
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
    const loadCate = async () => {
        const result = await axios.get(`http://localhost:8080/category`);
        setCate(result.data.data);
    };
    const handleChangeClear = () => {
        x = 1;
        cateId = null;
        nameProduct = null;
        setproductName();
        size = 3;
        sortTb = 'productId';
        sortStyle = 'ASC';
        loadProducts();
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
        <div>
            <Header />
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
            <div className="container my-5">
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
                <div className="d-flex justify-content-between m-4">
                    <div></div>
                    <form className="form-inline my-2 my-lg-0">
                        <div className="input-group input-group-sm">
                            <input
                                // style={{ maxWidth: '100%' }}
                                type="text"
                                className="form-control"
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                placeholder="Search..."
                                onChange={(e) => {
                                    nameProduct = e.target.value;
                                    setproductName(e.target.value);
                                }}
                            />
                            <div className="input-group-append">
                                <button type="button" className="btn btn-secondary btn-number">
                                    <i
                                        onClick={() => {
                                            nameProduct = productName;
                                            loadProducts();
                                        }}
                                        className="fa fa-search"
                                    >
                                        Search
                                    </i>
                                </button>
                            </div>
                        </div>
                    </form>
                    <div>
                        <Button variant="outlined" color="error" onClick={handleChangeClear}>
                            Clear
                        </Button>
                    </div>
                </div>
                <div className="d-flex justify-content-end m-2">
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
                <div className="row">
                    <div className="col-12 col-sm-3">
                        <div className="card">
                            <div className="card-header bg-primary text-white text-uppercase">
                                <i className="fa fa-list"></i> Categories
                            </div>
                            <ul className="list-group category_block">
                                {cate.map((item, index) => (
                                    // {cateId == item.catagoryId ? console.log("trung ne") ? console.log("khong trung")}

                                    <li key={index} className="list-group-item">
                                        {item.catagoryId == cateId ? (
                                            <a
                                                style={{ color: 'red' }}
                                                onClick={() => {
                                                    cateId = item.catagoryId;
                                                    nameProduct = '';
                                                    x = 1;
                                                    loadProducts();
                                                }}
                                            >
                                                {item.catagoryName}
                                            </a>
                                        ) : (
                                            <a
                                                onClick={() => {
                                                    cateId = item.catagoryId;
                                                    nameProduct = '';
                                                    x = 1;
                                                    loadProducts();
                                                }}
                                            >
                                                {item.catagoryName}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {products.length > 0 ? (
                        <div className="col">
                            <div className="row">
                                {products.map((item, index) => (
                                    <div key={index} className="col-12 col-md-6 col-lg-4 " style={{ height: '550px' }}>
                                        <div className="card">
                                            <img
                                                style={{ height: '260px' }}
                                                className="card-img-top"
                                                src={item.imgMain}
                                                alt="Card image cap"
                                            />
                                            <div className="card-body">
                                                <h6 className="card-title" style={{ height: '100px' }}>
                                                    <Link to={`/viewproduct/${item.productId}`} title="View Product">
                                                        {item.productName}
                                                    </Link>
                                                </h6>
                                                {item.score == null ? (
                                                    <div style={{ height: '50px' }}></div>
                                                ) : (
                                                    <Rating
                                                        style={{ height: '50px' }}
                                                        name="read-only"
                                                        value={item.score}
                                                        readOnly
                                                    />
                                                )}
                                                <h6>STOCKING: {item.quantity}</h6>

                                                <div className="row">
                                                    <div className="col">
                                                        <p className="btn btn-danger btn-block">{item.price}</p>
                                                    </div>
                                                    <div className="col">
                                                        <button
                                                            onClick={() => {
                                                                addToCart(item.productId);
                                                            }}
                                                            className="btn btn-success btn-block"
                                                        >
                                                            Add to cart
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Stack spacing={0}>
                                    <Pagination
                                        count={countPage}
                                        page={x}
                                        color="primary"
                                        onChange={handleChangePage}
                                    />
                                </Stack>
                            </div>
                        </div>
                    ) : (
                        <div className="col">
                            <div className="row">
                                <div className="m-5">
                                    <h1 style={{ color: 'red' }}>{error}</h1>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default IndexHomeProduct;

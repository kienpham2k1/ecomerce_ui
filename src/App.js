import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Header from './layout/Header';
import HomeProduct from './Product/HomeProduct';
import ViewProduct from './Product/ViewProduct';
import Login from './Login/Login';
import ViewCart from './Cart/ViewCart';
import Navbar from './layout/Navbar/Navbar';
import Order from './Order/Order';
import DetailOrder from './Order/DetailOrder';
import ProductManagement from './Product/ProductManager';
import AdminViewProduct from './Product/AdminViewProduct';
import EditProduct from './Product/EditProduct';
import AddNewProduct from './Product/AddNewProduct';
import UserHome from './User/UserHome';
import ViewUser from './User/ViewUser';
import EditUser from './User/EditUser';
import AddUser from './User/AddUser';
import HomeCategory from './Category/HomeCategory';
import AddNewCate from './Category/AddCategory';
import Rate from './Rate/Rate';
import Register from './Register/Register';

function App() {
    return (
        <div className="App">
            <Router>
                <Navbar />

                <Routes>
                    <Route exact path="/" element={<HomeProduct />} />
                    <Route exact path="/viewproduct/:id" element={<ViewProduct />} />
                    <Route exact path="/viewcart" element={<ViewCart />} />
                    <Route exact path="/login" element={<Login />} />
                    <Route exact path="/order" element={<Order />} />
                    <Route path="/orderdetail/:orderId" element={<DetailOrder />} />
                    <Route path="/product-manager" element={<ProductManagement />} />
                    <Route path="/admin-view-product/:id" element={<AdminViewProduct />} />
                    <Route path="/editproduct/:id" element={<EditProduct />} />
                    <Route path="/addnewproduct" element={<AddNewProduct />} />
                    <Route path="/userhome" element={<UserHome />} />
                    <Route path="/viewuser/:id" element={<ViewUser />} />
                    <Route path="/edituser/:id" element={<EditUser />} />
                    <Route path="/addnewuser" element={<AddUser />} />
                    <Route path="/homecategory" element={<HomeCategory />} />
                    <Route path="/addCate" element={<AddNewCate />} />
                    <Route path="/rate/:id" element={<Rate />}></Route>
                    <Route path="/register" element={<Register />}></Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;

import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import Cart from './Cart';
import LogginBtn from './Loggin';
export default function Navbar() {
    const cookies = new Cookies();
    if (!cookies.get('token')) {
        return <IsAnonymous />;
    } else if (cookies.get('token').role === '[ROLE_USER]') {
        return <IsUser />;
    } else if (cookies.get('token').role === '[ROLE_ADMIN]') {
        return <IsAdmin />;
    }
}

function GetUserName() {
    const cookies = new Cookies();
    var userName;
    if (cookies.get('token')) {
        userName = cookies.get('token').userId;
        return (
            <Link className="btn btn-outline" to={'/login'}>
                <i className="bi-cart-fill me-1"></i>
                Hello {userName}
            </Link>
        );
    }
}
function IsUser() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container px-4 px-lg-5">
                <Link className="navbar-brand" to={'/'}>
                    Shoes Shop
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to={'/'}>
                                Home
                            </Link>
                        </li>
                    </ul>
                    <form className="d-flex">
                        <Link className="btn btn-outline-info" type="submit" to={'/order'}>
                            <i className="bi-cart-fill me-1"></i>
                            Oder
                            {/* <span className="badge bg-dark text-white ms-1 rounded-pill">0</span> */}
                        </Link>
                        <Cart />
                        <LogginBtn />
                        <i className="bi-cart-fill me-1"></i>
                        <GetUserName />
                    </form>
                </div>
            </div>
        </nav>
    );
}

function IsAdmin() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container px-4 px-lg-5">
                <Link className="navbar-brand" to={'/userhome'}>
                    Admin Page
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to={'/userhome'}>
                                User
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={'/product-manager'}>
                                Product
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={'/homecategory'}>
                                Product categoty
                            </Link>
                        </li>
                    </ul>
                    <form className="d-flex">
                        <LogginBtn />
                        <i className="bi-cart-fill me-1"></i>
                        <GetUserName />
                    </form>
                </div>
            </div>
        </nav>
    );
}
function IsAnonymous() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container px-4 px-lg-5">
                <Link className="navbar-brand" to={'/'}>
                    Shoes Shop
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to={'/'}>
                                Home
                            </Link>
                        </li>
                    </ul>
                    <form className="d-flex">
                        {/* <Cart /> */}
                        <Link className="btn btn-outline-secondary" to={'/register'}>
                            <i className="bi-cart-fill me-1"></i>
                            Register
                        </Link>
                        <LogginBtn />
                        <i className="bi-cart-fill me-1"></i>
                    </form>
                </div>
            </div>
        </nav>
    );
}

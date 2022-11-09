import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';

function Cart() {
    const cookies = new Cookies();
    if (cookies.get('token') && cookies.get('token').role === '[ROLE_USER]') {
        return (
            <Link className="btn btn-outline-dark" type="submit" to={'/viewcart'}>
                <i className="bi-cart-fill me-1"></i>
                Cart
                {/* <span className="badge bg-dark text-white ms-1 rounded-pill">0</span> */}
            </Link>
        );
    } else {
        return (
            <Link className="btn btn-outline-dark" type="submit" to={'/login'}>
                <i className="bi-cart-fill me-1"></i>
                Cart
                {/* <span className="badge bg-dark text-white ms-1 rounded-pill">0</span> */}
            </Link>
        );
    }
}

export default Cart;

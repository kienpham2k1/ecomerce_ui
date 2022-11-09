import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
export default function LogginBtn() {
    const cookies = new Cookies();
    //console.log(cookies.get('token').token);
    if (cookies.get('token')) {
        return <Logout />;
    } else {
        return <Loggin />;
    }
}

function Loggin() {
    return (
        <Link className="btn btn-outline-primary" to={'/login'}>
            <i className="bi-cart-fill me-1"></i>
            Loggin
        </Link>
    );
}

function Logout() {
    let navigate = useNavigate();
    const cookies = new Cookies();
    const removeCookies = () => {
        cookies.remove('token');
        navigate('/');
    };
    return (
        <button className="btn btn-outline-danger" onClick={() => removeCookies()}>
            <i className="bi-cart-fill me-1"></i>
            Logout
        </button>
    );
}

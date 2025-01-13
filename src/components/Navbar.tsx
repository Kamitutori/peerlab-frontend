import { Link } from "react-router-dom";
import paperLogo from '../assets/paper.svg';
import dashboardLogo from '../assets/dashboard.svg';
import reviewLogo from '../assets/review.svg';

export default function Navbar() {
    return (
        <nav className="nav">
        <Link to="/" className="site-title"></Link>
            <ul>
                <li>
                    <img src={dashboardLogo} width="30" height="30" alt="dashboard"/>
                    <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                    <img src={paperLogo} width="30" height="30" alt="papers"/>
                    <Link to="/papers">Papers</Link>
                </li>
                <li>
                    <img src={reviewLogo} width="30" height="30" alt="reviews"/>
                    <Link to="/reviews">Reviews</Link>
                </li>
            </ul>
        </nav>
    )
}
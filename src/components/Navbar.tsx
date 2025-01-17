import { Link } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import Icon from '@mui/material/Icon';
//import AccountCircleIcon from '@mui/icons-material/AccountCircle';


export default function Navbar() {

    return (
        <nav className="nav">
        <Link to="/" className="site-title"></Link>
            <ul>
                <li>
                    <Link to="/dashboard">
                        <Icon>
                            <HomeIcon /*fontSize="large" OR sx={{ fontSize: 40 }}*/ />
                        </Icon>
                    </Link>
                </li>
                <li>
                    <Link to="/papers">
                        <Icon>
                            <MenuBookIcon /*fontSize="large" OR sx={{ fontSize: 40 }}*/ />
                        </Icon>
                    </Link>
                </li>
                <li>
                    <Link to="/reviews">
                        <Icon>
                            <LibraryBooksIcon /*fontSize="large" OR sx={{ fontSize: 40 }}*/ />
                        </Icon>
                    </Link>
                </li>
                {/* Formerly:
                <li>
                    <img src={AccountCircleIcon} width="30" height="30" alt="profile"/>
                    <Link to="/profile">Profile</Link>
                </li>
                */}
            </ul>
        </nav>
    )
}
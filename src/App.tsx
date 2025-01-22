import './App.css'
import Login from './pages/Login'
import { Route, Routes} from "react-router-dom";
import Dashboard from "./pages/Dashboard.tsx";
import Profile from "./pages/Profile.tsx";
import MyPapers from "./pages/MyPapers.tsx";
import MyReviews from "./pages/MyReviews.tsx";
import NoPage from "./pages/NoPage.tsx";
import TopMenuBar from "./components/TopBar.tsx";
import SinglePaper from "./components/SinglePaper.tsx";
/**
 * Notice TODO: Look up MUI AppBar to see an implementation of handling authorization and submenus.
 */
function App() {

    return (
        <div>
            <TopMenuBar />
            <div className="container">
                <Routes>
                    <Route index element={<Login />} />
                    <Route path="/login" element={<Login />}/>
                    <Route path="/dashboard" element={<Dashboard />}/>
                    <Route path="/profile" element={<Profile />}/>
                    <Route path="/papers" element={<MyPapers />}/>
                    <Route path="/reviews" element={<MyReviews />}/>
                    <Route path="*" element={<NoPage />}/>
                    <Route path="/single-paper" element={<SinglePaper />}/>
                </Routes>
            </div>
        </div>
    )

}

export default App

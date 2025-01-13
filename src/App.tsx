/*
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
*/

import './App.css'

import Login from './pages/Login'
import { Route, Routes} from "react-router-dom";
import Dashboard from "./pages/Dashboard.tsx";
import Profile from "./pages/Profile.tsx";
import Papers from "./pages/Papers.tsx";
import Reviews from "./pages/Reviews.tsx";
import NoPage from "./pages/NoPage.tsx";
import Navbar from "./components/Navbar.tsx";

function App() {

    return (
        <div>
            <Navbar />
            <div className="container">
                <Routes>
                    <Route index element={<Login />} />
                    <Route path="/login" element={<Login />}/>
                    <Route path="/dashboard" element={<Dashboard />}/>
                    <Route path="/profile" element={<Profile />}/>
                    <Route path="/papers" element={<Papers />}/>
                    <Route path="/reviews" element={<Reviews />}/>
                    <Route path="*" element={<NoPage />}/>
                </Routes>
            </div>
        </div>
    )

    /*
    Some code from project init. May be useful to have something to look at in terms of animation and links.

    const [count, setCount] = useState(0)
    return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
    )
     */
}

export default App

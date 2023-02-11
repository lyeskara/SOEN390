import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../styles/nav.css";
import { useUserAuth } from "../context/UserAuthContext";
import { auth } from "../firebase";
import logo from './../images/logo.JPG';
import Search from "./connection/Search";

function NavbarFun() {
  const userr = auth.currentUser;
  const { logOut } = useUserAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/"><img src={logo} alt="ElevateNet"></img></Link>
          </li>
          {userr && (
            <>
              <li>
                <Link to="/Profile">Profile</Link>
                <button><Search/></button>
                <button onClick={handleLogout} className="list-item">
                  logout
                </button>
              </li>
            </>
          )}
          {!userr && (
            <>
              <li>
                <Link to="/SignIn">Sign In</Link>
              </li>
              <li>
                <Link to="/JoinNow">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
        
      </nav>
      <Outlet />
    </>
  );
}

export default NavbarFun;

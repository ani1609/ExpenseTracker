import { useState, useEffect } from "react";
import "../styles/Navbar.css";
import "../index.css";
import Login from './Login';
import Signup from './Signup';
import axios from "axios";
import {ReactComponent as Logout} from '../icons/logout.svg';
import { SiMoneygram } from "react-icons/si";
import { Link, redirect } from 'react-router-dom';
import Profile from "./profile/Profile";



function Navbar(props) 
{
    const userToken = JSON.parse(localStorage.getItem('expenseTrackerUserToken'));
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [user, setUser] = useState({});

    const fetchDataFromProtectedAPI = async (userToken) => 
    {
        try 
        {
            const config = {
                headers: {
                Authorization: `Bearer ${userToken}`,
                },
            };
            // const response = await axios.get(`${process.env.REACT_APP_SERVER_PORT}/api/user`, config);
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/user`, config);
            setUser(response.data.user);
            // console.log(response.data.user);
        }
        catch (error)
        {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() =>
    {
        if (userToken)
        {
            fetchDataFromProtectedAPI(userToken);
        }
    }, [userToken]);

    const handleLogout = () => {
      localStorage.removeItem('expenseTrackerUserToken');
      window.location.reload();
      window.location.href = "/"; 
    };



    return (
        <div className="navbar_parent z-10 absolute top-0 text-white">
            <h1 className="flex gap-2 items-center"><SiMoneygram />SPENDWISE</h1>
            {userToken?
                <div className="profile_container">
                   <Link to="/profile"> {/* Link to the /profile route */}
                        <h4>{user?.name?.split(' ')[0]}</h4>
                    </Link>
                    <Logout className="logout_icon" onClick={handleLogout}/>
                </div>
                :
                <div className="login_signup_container">
                    <button onClick={()=>{setShowLoginForm(true); props.setShowSignupForm(false)}}>Login</button>
                    <button onClick={()=>{props.setShowSignupForm(true); setShowLoginForm(false)}}>Signup</button>
                </div>
            }

            {showLoginForm &&
                <div className="login_parent"  onClick={()=> setShowLoginForm(false)}><Login/></div>
            }

            {props.showSignupForm &&
                <div className="signup_parent"  onClick={()=> props.setShowSignupForm(false)}><Signup/></div>
            }
        </div>
    );
}

export default Navbar;
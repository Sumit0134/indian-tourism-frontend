import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import ForgotPasswordModal from "../Modals/ForgotPasswordModal/ForgotPasswordModal";
import LoginModal from "../Modals/LoginModal/LoginModal";
import SignUpModal from "../Modals/SignUpModal/SignUpModal";
import OtpModal from "../Modals/OtpModal/OtpModal";
import Button from "../UI/Buttons/Button";

import { AppContext } from "../../AppContext.js";
import { siteLogo } from "../../fileUrls";
import "./Header.css";

const Header = () => {
    const navigate = useNavigate();

    const { context, setContext, resetContext } = useContext(AppContext);

    const { isLoggedIn, isUserAdmin } = context;
    const {
        isLoginModalOpen,
        isSignUpModalOpen,
        isOtpModalOpen,
        isForgotPasswordModalOpen,
    } = context;

    const [searchText, setSearchText] = useState("");
    const [searchPlaceholder, setSearchPlaceholder] = useState(
        "Search for locations"
    );

    /** Function to handle things when user clicks the logout button */
    const handleLogoutClick = async () => {
        console.log("Logout Clicked");

        try {
            const url = `${process.env.REACT_APP_API_BASE_URL}/api/auth/logout`;

            /** Calling the Logout API */
            const response = await axios.post(url, null, {
                withCredentials: true,
            });
            if (response.status === 204) {
                localStorage.removeItem("refreshToken");
                resetContext();
            }
        } catch (error) {}
    };

    /** Function to handle things when user clicks the SEARCH button */
    const handleSearchClicked = (event) => {
        event.preventDefault();
        console.log("Search button clicked");

        if (searchText === "") {
            console.log("Empty search text");
            setSearchPlaceholder("Enter a valid search text");
        } else {
            setContext({ ...context, searchText: searchText });
            navigate(
                "/locations"
            ); /** Navigate the user to {locations} route */
        }
    };

    /** Function to handle things when user clicks the LOGIN button */
    const handleLoginClicked = () => {
        console.log("Login button clicked");
        setContext({ ...context, isLoginModalOpen: true });
    };

    /** Function to handle things when user clicks the SIGNUP button */
    const handleSignUpClicked = () => {
        console.log("Signup Clicked");
        setContext({ ...context, isSignUpModalOpen: true });
    };

    return (
        <div className="navbar-container">
            <nav className="navbar">
                <div className="site-info">
                    <Link to="/">
                        <img
                            className="site-logo"
                            src={siteLogo}
                            href="/"
                            alt="Site Logo"
                        />
                    </Link>
                    <div className="site-text">Indian Tourism</div>
                </div>

                {isLoggedIn && !isUserAdmin && (
                    <div className="navbar-links">
                        <Link to="/">Home</Link>
                        <Link to="/profile">Profile</Link>
                        <Link to="/bookings">Bookings</Link>
                        <Link to="/about">About</Link>
                    </div>
                )}

                {isLoggedIn && isUserAdmin && (
                    <div className="navbar-links">
                        <Link to="/">Home</Link>
                        <Link to="/profile">Profile</Link>
                        <Link to="/locations">Locations</Link>
                        <Link to="/add-location">Add Location</Link>
                        <Link to="/cancellations">Cancellations</Link>
                        <Link to="/about">About</Link>
                    </div>
                )}

                {!isLoggedIn && (
                    <div className="navbar-links">
                        <Link to="/">Home</Link>
                        <Link to="/locations">Locations</Link>
                        <Link to="/about">About</Link>
                    </div>
                )}

                <form className="navbar-search">
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <Button type="submit" onClick={handleSearchClicked}>
                        {" "}
                        Search{" "}
                    </Button>
                </form>

                <div className="navbar-buttons">
                    {context.isLoggedIn && (
                        <Button onClick={() => handleLogoutClick()}>
                            Logout
                        </Button>
                    )}
                    {!context.isLoggedIn && (
                        <>
                            <Button onClick={() => handleLoginClicked()}>
                                Login
                            </Button>
                            <Button onClick={() => handleSignUpClicked()}>
                                Signup
                            </Button>
                        </>
                    )}
                </div>
            </nav>

            {isLoginModalOpen && <LoginModal />}
            {isSignUpModalOpen && <SignUpModal />}
            {isOtpModalOpen && <OtpModal />}
            {isForgotPasswordModalOpen && <ForgotPasswordModal />}
        </div>
    );
};

export default Header;

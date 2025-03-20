import React from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/images/logo.png";

const Header = () => {
    return (
        <header className="header">
            <div className="logo">
                <img src={logo} alt="Logo" />
                <NavLink to="/text-to-speech" style={{ textDecoration: "none" }}>
                    <h1>Voice Cloning</h1>
                </NavLink>
            </div>
            <nav className="nav">
                <NavLink to="/voice-enhancement" activeClassName="active">
                    Denoise
                </NavLink>
                <NavLink to="/speaker-verification" activeClassName="active">
                    Speaker Verification
                </NavLink>
                <NavLink to="/text-to-speech" activeClassName="active">
                    Text-to-Speech
                </NavLink>
            </nav>
        </header>
    );
};

export default Header;

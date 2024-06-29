import React from "react";
import { NavLink } from "react-router-dom/cjs/react-router-dom";

export default function LandingPage() {
    return (
        <div className="landing-page">
            <h1 >Kapampangan's Best</h1>
            <NavLink exact to="/home">Check out</NavLink>
        </div>
    );
}

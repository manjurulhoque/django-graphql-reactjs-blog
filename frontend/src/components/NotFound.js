import React from "react";
import {Link} from "react-router-dom";
import resourceNotFound from "../styles/404.png";

const NotFound = () => (
    <div>
        <img
            alt="not found"
            src={resourceNotFound}
            style={{
                width: "85%",
                height: "600px",
                display: "block",
                margin: "auto",
                position: "relative"
            }}
        />
        <center>
            <Link to="/">Return to Home Page</Link>
        </center>
    </div>
);
export default NotFound;
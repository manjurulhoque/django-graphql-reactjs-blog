import React from "react";
import {Link} from "react-router-dom";
import networkError from "../../styles/network-error.png";

const NetworkError = () => (
    <div>
        <img
            alt="network"
            src={networkError}
            style={{
                width: "85%",
                height: "600px",
                display: "block",
                margin: "auto",
                position: "relative"
            }}
        />
        <center>
            <Link to="/">Refresh</Link>
        </center>
    </div>
);
export default NetworkError;
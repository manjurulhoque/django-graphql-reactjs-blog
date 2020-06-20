import React from "react";
import {Link} from "react-router-dom";
import somethingWentWrong from "../../styles/something-went-wrong.png";

const SomethingWentWrong = () => (
    <div>
        <img
            alt="wrong"
            src={somethingWentWrong}
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
export default SomethingWentWrong;
import React from "react";
import classes from "./Footer.module.css";

const footer = (props) => (
    <footer className={classes.Footer}>
        <p>© {new Date().getFullYear()} Christopher Cross</p>
    </footer>
)

export default footer; 
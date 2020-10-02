import React from "react";
import Aux from "../hoc/Aux"
import Footer from '../Footer/Footer'; 
import classes from './Layout.module.css';
import Navbar from '../NavBar/Navbar';

export default function layout(props) {

    return (
        <Aux>
            <Navbar />
            <main className={classes.Content} >
                {props.children}
            </main>
            <Footer />
        </Aux>

    )
}

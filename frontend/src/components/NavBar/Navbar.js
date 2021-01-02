import React from 'react';
import classes from './Navbar.module.css';


export default function navbar(props) {

    return (
        <nav className={classes.Nav}>
            <ul>
                <li><a href='/'>Home</a></li>
                <li><a href='/about'>About</a></li>
                <li><a href='/contact'>Contact</a></li>
            </ul>
        </nav>
    )
}
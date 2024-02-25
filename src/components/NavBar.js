import React, { useState } from 'react';

function NavBar() {
    return (
        <div id="nav-bar">
            <ul className="nav-menu">
                <div className="nav-soyjak">
                    <img
                        src="./images/logos/soyjak_gleek.png"
                        alt="soy"
                        className="rotate-soyjak"
                    ></img>
                </div>
                <li>
                    <a href="/">HOME</a>
                </li>
                <li>
                    <a href="/" style={{ textDecoration: 'line-through' }}>
                        REDACTED
                    </a>
                </li>
                <li>
                    <a href="https://dexscreener.com/solana/2vtrb36pmfkaqms2d4c3tf8a2ej9wusapfsnqvsjse8s">
                        DEXSCREENER
                    </a>
                </li>
                <li>
                    <a href="https://twitter.com/gleekonsolana">TWITTER</a>
                </li>
                <li>
                    <a href="https://t.me/gleekportal">TELEGRAM</a>
                </li>
                <li>
                    <a href="https://giphy.com/channel/iGleek">GIPHY</a>
                </li>
                <div className="nav-soyjak">
                    <img
                        src="./images/logos/soyjak_gleek.png"
                        alt="soy"
                        className="rotate-soyjak"
                    ></img>
                </div>
            </ul>
        </div>
    );
}

export default NavBar;

import React, { useState } from 'react';

function NavBar() {

  return (
    <div id="nav-bar">
      <ul className='nav-menu'>
        <div className='nav-soyjak'>
          <img src='./images/logos/soyjak_gleek.png' alt='soy' className='rotate-soyjak'></img>
        </div>
        <li><a href="/">HOME</a></li>
        <li><a href="https://dexscreener.com/">DEXSCREENER</a></li>
        <li><a href="https://twitter.com/gleekonsolana">TWITTER</a></li>
        <li><a href="https://t.me/+6E9MvDPBQfpmOGQx">TELEGRAM</a></li>
        <li><a href="https://giphy.com/channel/iGleek">GIPHY</a></li>
        <div className='nav-soyjak'>
          <img src='./images/logos/soyjak_gleek.png' alt='soy' className='rotate-soyjak'></img>
        </div>
      </ul>
    </div>
  );
}

export default NavBar;

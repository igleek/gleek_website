import React from 'react';

const PixlLabsFooter = () => {
    return (
        <div className="footer">
            <a
                href="https://dexscreener.com/solana/2vtrb36pmfkaqms2d4c3tf8a2ej9wusapfsnqvsjse8s"
                target="_blank"
                rel="noopener noreferrer"
            >
                <img
                    src="./images/logos/dexscreener.png"
                    alt=" "
                    style={{
                        width: '20px',
                        height: '20px',
                        position: 'relative',
                        marginRight: '5px',
                    }}
                />
                DEXSCREENER
            </a>
            <a
                href="https://twitter.com/gleekonsolana"
                target="_blank"
                rel="noopener noreferrer"
            >
                <img
                    src="./images/logos/x.png"
                    alt=" "
                    style={{
                        width: '25px',
                        height: '25px',
                        position: 'relative',
                        marginRight: '5px',
                    }}
                />
                TWITTER
            </a>
            <a
                href="https://t.me/gleekportal"
                target="_blank"
                rel="noopener noreferrer"
            >
                <img
                    src="./images/logos/tg.png"
                    alt=""
                    style={{
                        width: '40px',
                        height: '40px',
                        position: 'relative',
                        marginRight: '5px',
                    }}
                />
                TELEGRAM
            </a>
            <a
                href="https://giphy.com/channel/iGleek"
                target="_blank"
                rel="noopener noreferrer"
            >
                <img
                    src="./images/logos/giphy.png"
                    alt=""
                    style={{
                        width: '40px',
                        height: '40px',
                        position: 'relative',
                        marginRight: '5px',
                    }}
                />
                GIPHY
            </a>
        </div>
    );
};

export default PixlLabsFooter;

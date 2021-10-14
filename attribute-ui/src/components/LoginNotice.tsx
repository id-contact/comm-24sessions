import React from 'react';

export default LoginNotice = ({ loginUrl }) => {
    return (
        <p className="login-notice">Om de attributen te kunnen ophalen moet u eerst
            <span> <a className="login-button" target="_blank" rel="noreferrer noopener" href={loginUrl}>inloggen</a></span>
        </p>
    );
}

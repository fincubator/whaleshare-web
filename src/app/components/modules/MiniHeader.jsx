import React from 'react';
import { Link } from 'react-router';
import Icon from 'app/components/elements/Icon';
import { APP_NAME } from 'app/client_config';

export default function MiniHeader() {
    return <header className="Header">
        <div className="Header__top header">
            <div className="expanded row">
                <div className="columns">
                    <ul className="menu">
                        <li className="Header__top-logo">
                            <Link to='/'><img src='/images/logo.png' /></Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </header>;
}

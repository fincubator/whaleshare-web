import React from 'react';

const SidebarLinks = ({username}) => (
  <div className="c-sidebar__module">
    <div className="c-sidebar__header">
      <h3 className="c-sidebar__h3">Quick Links</h3>
    </div>
    <div className="c-sidebar__content">
      <ul className="c-sidebar__list">
        <li className="c-sidebar__list-item"><a className="c-sidebar__link" href={'/@' + username}>My Blog</a></li>
        <li className="c-sidebar__list-item"><a className="c-sidebar__link" href={'/@' + username + '/transfers'}>My Wallet</a></li>
        <li className="c-sidebar__list-item"><a className="c-sidebar__link" href={'/@' + username + '/feed'}>My Feed</a>
        </li>
      </ul>
    </div>
    <div className="c-sidebar__header multiple">
      <h3 className="c-sidebar__h3">Useful</h3>
    </div>
    <div className="c-sidebar__content">
      <ul className="c-sidebar__list">
        <li className="c-sidebar__list-item"><a className="c-sidebar__link" href="https://wls.services">Claiming Tool</a></li>
        <li className="c-sidebar__list-item"><a className="c-sidebar__link" href="https://masdacs.io/">Crossposting Tool</a></li>
        <li className="c-sidebar__list-item"><a className="c-sidebar__link" href="https://discord.gg/3pqBXKY">Whaleshares Discord</a></li>
        <li className="c-sidebar__list-item"><a className="c-sidebar__link" href="https://t.me/whalesharesofficial">Whaleshares Telegram</a></li>
        <li className="c-sidebar__list-item"><a className="c-sidebar__link" href="http://whaleshares.live/">Whaleshares Live</a></li>
        <li className="c-sidebar__list-item"><a className="c-sidebar__link" href="http://whaled.live/">WhaleD Explorer</a></li>
      </ul>
    </div>
  </div>
);

export default SidebarLinks;


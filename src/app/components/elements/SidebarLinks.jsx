import React from 'react';

const SidebarLinks = ({ username }) => (
    <div className="c-sidebar__module">
      <div className="c-sidebar__header">
        <h3 className="c-sidebar__h3">Quick Links</h3>
      </div>
      <div className="c-sidebar__content">
        <ul className="c-sidebar__list">
          <li className="c-sidebar__list-item"><a className="c-sidebar__link" href={'/@' + username}>My blog</a></li>
          <li className="c-sidebar__list-item"><a className="c-sidebar__link" href={'/@' + username + '/transfers'}>My wallet</a></li>
          <li className="c-sidebar__list-item"><a className="c-sidebar__link" href={'/@' + username + '/feed'}>My Feed</a></li>
        </ul>
      </div>
      <div className="c-sidebar__header multiple">
          <h3 className="c-sidebar__h3">Useful</h3>
      </div>
      <div className="c-sidebar__content">
        <ul className="c-sidebar__list">
          <li className="c-sidebar__list-item"><a className="c-sidebar__link" href="https://masdacs.io/">Masdac.io Crossposting</a></li>
          <li className="c-sidebar__list-item"><a className="c-sidebar__link" href="https://discord.gg/3pqBXKY">Whaleshares Discord</a></li>
          <li className="c-sidebar__list-item"><a className="c-sidebar__link" href="https://t.me/whalesharesofficial">Whaleshares Telegram</a></li>
        </ul>
      </div>
    </div>
);

export default SidebarLinks;


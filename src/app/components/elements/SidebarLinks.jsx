import React from 'react';
import tt from 'counterpart';

const SidebarLinks = ({username}) => (
  <div className="c-sidebar__module">
    <div className="c-sidebar__header">
      <h3 className="c-sidebar__h3">{tt('sidebar_links.quick_links')}</h3>
    </div>
    <div className="c-sidebar__content">
      <ul className="c-sidebar__list">
        <li className="c-sidebar__list-item"><a className="c-sidebar__link" href={'/@' + username}>{tt('sidebar_links.my_blog')}</a></li>
        <li className="c-sidebar__list-item"><a className="c-sidebar__link" href={'/@' + username + '/transfers'}>{tt('sidebar_links.my_wallet')}</a></li>
        <li className="c-sidebar__list-item"><a className="c-sidebar__link" href={'/@' + username + '/feed'}>{tt('sidebar_links.my_feed')}</a>
        </li>
      </ul>
    </div>
    <div className="c-sidebar__header multiple">
      <h3 className="c-sidebar__h3">{tt('sidebar_links.useful')}</h3>
    </div>
    <div className="c-sidebar__content">
      <ul className="c-sidebar__list">
        <li className="c-sidebar__list-item"><a className="c-sidebar__link" href="https://wls.services">{tt('sidebar_links.claiming_tool')}</a></li>
        <li className="c-sidebar__list-item"><a className="c-sidebar__link" href="https://masdacs.io/">{tt('sidebar_links.crossposting_tool')}</a></li>
        <li className="c-sidebar__list-item"><a className="c-sidebar__link" href="https://discord.gg/3pqBXKY">{tt('sidebar_links.discord')}</a></li>
        <li className="c-sidebar__list-item"><a className="c-sidebar__link" href="https://t.me/whalesharesofficial">{tt('sidebar_links.telegram')}</a></li>
        <li className="c-sidebar__list-item"><a className="c-sidebar__link" href="http://whaled.live/">{tt('sidebar_links.whaled')}</a></li>
        <li className="c-sidebar__list-item"><a className="c-sidebar__link" href="http://whaleshares.live/">Whaleshares Live</a></li>
      </ul>
    </div>
  </div>
);

export default SidebarLinks;


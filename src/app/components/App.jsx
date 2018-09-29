import React from 'react';
import {connect} from 'react-redux';
import AppPropTypes from 'app/utils/AppPropTypes';
import Header from 'app/components/modules/Header';
import LpFooter from 'app/components/modules/lp/LpFooter';
import user from 'app/redux/User';
import g from 'app/redux/GlobalReducer';
import TopRightMenu from 'app/components/modules/TopRightMenu';
import {browserHistory} from 'react-router';
import classNames from 'classnames';
import SidePanel from 'app/components/modules/SidePanel';
import CloseButton from 'react-foundation-components/lib/global/close-button';
import Dialogs from 'app/components/modules/Dialogs';
import Modals from 'app/components/modules/Modals';
import Icon from 'app/components/elements/Icon';
import MiniHeader from 'app/components/modules/MiniHeader';
import tt from 'counterpart';
import PageViewsCounter from 'app/components/elements/PageViewsCounter';
// import {serverApiRecordEvent} from 'app/utils/ServerApiClient';
import {APP_NAME, VESTING_TOKEN, LIQUID_TOKEN} from 'app/client_config';
import {key_utils} from '@whaleshares/wlsjs/lib/auth/ecc';
import resolveRoute from 'app/ResolveRoute';

const pageRequiresEntropy = (path) => {
  const {page} = resolveRoute(path);
  const entropyPages = [
    "ChangePassword", "RecoverAccountStep1", "RecoverAccountStep2",
    "UserProfile", "CreateAccount"
  ];
  /* Returns true if that page requires the entropy collection listener */
  return entropyPages.indexOf(page) !== -1
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: null, showCallout: true, showBanner: true, expandCallout: false};
    this.toggleOffCanvasMenu = this.toggleOffCanvasMenu.bind(this);
    this.signUp = this.signUp.bind(this);
    this.learnMore = this.learnMore.bind(this);
    this.listenerActive = null;
    this.onEntropyEvent = this.onEntropyEvent.bind(this);
    // this.shouldComponentUpdate = shouldComponentUpdate(this, 'App')
  }

  componentWillMount() {
    if (process.env.BROWSER) localStorage.removeItem('autopost') // July 14 '16 compromise, renamed to autopost2
    this.props.loginUser();
  }

  componentDidMount() {
    // setTimeout(() => this.setState({showCallout: false}), 15000);
    if (pageRequiresEntropy(this.props.location.pathname)) {
      this._addEntropyCollector();
    }
  }

  componentWillReceiveProps(np) {
    /* Add listener if the next page requires entropy and the current page didn't */
    if (pageRequiresEntropy(np.location.pathname) && !pageRequiresEntropy(this.props.location.pathname)) {
      this._addEntropyCollector();
    } else if (!pageRequiresEntropy(np.location.pathname)) { // Remove if next page does not require entropy
      this._removeEntropyCollector();
    }
  }

  _addEntropyCollector() {
    if (!this.listenerActive && this.refs.App_root) {
      this.refs.App_root.addEventListener("mousemove", this.onEntropyEvent, {capture: false, passive: true});
      this.listenerActive = true;
    }
  }

  _removeEntropyCollector() {
    if (this.listenerActive && this.refs.App_root) {
      this.refs.App_root.removeEventListener("mousemove", this.onEntropyEvent);
      this.listenerActive = null;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const p = this.props;
    const n = nextProps;
    return (
      p.location.pathname !== n.location.pathname ||
      p.new_visitor !== n.new_visitor ||
      p.flash !== n.flash ||
      this.state.open !== nextState.open ||
      this.state.showBanner !== nextState.showBanner ||
      this.state.showCallout !== nextState.showCallout ||
      p.nightmodeEnabled !== n.nightmodeEnabled
    );
  }

  toggleOffCanvasMenu(e) {
    e.preventDefault();
    // this.setState({open: this.state.open ? null : 'left'});
    this.refs.side_panel.show();
  }

  handleClose = () => this.setState({open: null});

  navigate = (e) => {
    const a = e.target.nodeName.toLowerCase() === 'a' ? e.target : e.target.parentNode;
    // this.setState({open: null});
    if (a.host !== window.location.host) return;
    e.preventDefault();
    browserHistory.push(a.pathname + a.search + a.hash);
  };

  onEntropyEvent(e) {
    if (e.type === 'mousemove')
      key_utils.addEntropy(e.pageX, e.pageY, e.screenX, e.screenY)
    else
      console.log('onEntropyEvent Unknown', e.type, e)
  }

  signUp() {
    // serverApiRecordEvent('Sign up', 'Hero banner');
  }

  learnMore() {
    // serverApiRecordEvent('Learn more', 'Hero banner');
  }

  render() {
    const {
      location, params, children, flash, new_visitor,
      depositSteem, signup_bonus, username, nightmodeEnabled
    } = this.props;
    const lp = false; //location.pathname === '/';
    const miniHeader = location.pathname === '/create_account' || location.pathname === '/pick_account';
    const headerHidden = miniHeader && location.search === '?whistle_signup'
    const params_keys = Object.keys(params);
    const ip = location.pathname === '/' || (params_keys.length === 2 && params_keys[0] === 'order' && params_keys[1] === 'category');
    const alert = this.props.error || flash.get('alert') || flash.get('error');
    const warning = flash.get('warning');
    const success = flash.get('success');
    let callout = null;
    if (this.state.showCallout && (alert || warning || success)) {
      callout = <div className="App__announcement row">
        <div className="column">
          <div className={classNames('callout', {alert}, {warning}, {success})}>
            <CloseButton onClick={() => this.setState({showCallout: false})}/>
            <p>{alert || warning || success}</p>
          </div>
        </div>
      </div>;
    }
    else if (false && ip && this.state.showCallout) {
      callout = <div className="App__announcement row">
        <div className="column">
          <div className={classNames('callout success', {alert}, {warning}, {success})}>
            <CloseButton onClick={() => this.setState({showCallout: false})}/>
            <ul>
              <li>
                /*<a href="LINK">
                   ...STORY TEXT...
                </a>*/
              </li>
            </ul>
          </div>
        </div>
      </div>
    }
    if ($STM_Config.read_only_mode && this.state.showCallout) {
      callout = <div className="App__announcement row">
        <div className="column">
          <div className={classNames('callout warning', {alert}, {warning}, {success})}>
            <CloseButton onClick={() => this.setState({showCallout: false})}/>
            <p>{tt('g.read_only_mode')}</p>
          </div>
        </div>
      </div>;
    }

    let welcome_screen = null;
    if (ip && new_visitor && this.state.showBanner) {
      welcome_screen = (
        <div className="welcomeWrapper">
          <div className="welcomeBanner">
            <CloseButton onClick={() => this.setState({showBanner: false})}/>
            <div className="text-center">
              <h2>{tt('navigation.intro_tagline')}</h2>
              <h4>{tt('navigation.intro_paragraph')}</h4>
              <br/>
              <a className="button button--primary" href="/pick_account">
                <strong>{tt('navigation.sign_up')}</strong></a>
            </div>
          </div>
        </div>
      );
    }

    const themeClass = nightmodeEnabled ? ' theme-wls-dark' : ' theme-wls-light';

    return <div
      className={'App' + themeClass + (lp ? ' LP' : '') + (ip ? ' index-page' : '') + (miniHeader ? ' mini-header' : '')}
      ref="App_root"
    >
      <SidePanel ref="side_panel" alignment="right">
        <TopRightMenu vertical navigate={this.navigate}/>
        <ul className="vertical menu">
          <li>
            <a href="/whalesharesexplorer/">
              {tt('navigation.explorer')}
            </a>
          </li>
          <li>
            <a href="/~witnesses" onClick={this.navigate} rel="nofollow">
              Vote for Witnesses
            </a>
          </li>
          <li>
            <a href="/tags" onClick={this.navigate}>
              {tt('navigation.explore')}
            </a>
          </li>
        </ul>
        <ul className="vertical menu">
          <li>
            <a href="/change_password" onClick={this.navigate}>
              {tt('navigation.change_account_password')}
            </a>
          </li>
        </ul>
        <ul className="vertical menu">
          <li>
            <a
              href="https://gitlab.com/beyondbitcoin/whaleshares-web/uploads/40a04e43d66482289b988bd189c26cef/Whale_paper_v1.pdf"
              onClick={this.navigate}>{tt('navigation.APP_NAME_whitepaper', {APP_NAME})}</a>
          </li>
          <li>
            <a href="/privacy.html" onClick={this.navigate} rel="nofollow">
              {tt('navigation.privacy_policy')}
            </a>
          </li>
          <li className="last">
            <a href="/tos.html" onClick={this.navigate} rel="nofollow">
              {tt('navigation.terms_of_service')}
            </a>
          </li>
        </ul>
        <ul className="vertical menu">
          <li>
            <a href="https://discord.gg/3pqBXKY">Whaleshares Discord</a>
          </li>
          <li>
            <a href="https://t.me/whalesharesofficial">Whaleshares Telegram</a>
          </li>
        </ul>
      </SidePanel>
      {miniHeader ? headerHidden ? null : <MiniHeader/> :
        <Header toggleOffCanvasMenu={this.toggleOffCanvasMenu} menuOpen={this.state.open}/>}
      <div className="App__content">
        {welcome_screen}
        {callout}
        {children}
        {lp ? <LpFooter/> : null}
      </div>
      <Dialogs/>
      <Modals/>
      <PageViewsCounter/>
    </div>
  }
}

App.propTypes = {
  error: React.PropTypes.string,
  children: AppPropTypes.Children,
  location: React.PropTypes.object,
  signup_bonus: React.PropTypes.string,
  loginUser: React.PropTypes.func.isRequired,
  depositSteem: React.PropTypes.func.isRequired,
  username: React.PropTypes.string,
};

export default connect(
  state => {
    return {
      error: state.app.get('error'),
      flash: state.offchain.get('flash'),
      signup_bonus: state.offchain.get('signup_bonus'),
      new_visitor: !state.user.get('current') &&
      !state.offchain.get('user') &&
      !state.offchain.get('account') &&
      state.offchain.get('new_visit'),
      username: state.user.getIn(['current', 'username']) || state.offchain.get('account') || '',
      nightmodeEnabled: state.app.getIn(['user_preferences', 'nightmode']),
    };
  },
  dispatch => ({
    loginUser: () =>
      dispatch(user.actions.usernamePasswordLogin()),
    depositSteem: (username) => {
      const new_window = window.open();
      new_window.opener = null;
      new_window.location = 'https://blocktrades.us/?input_coin_type=btc&output_coin_type=steem&receive_address=' + username;
      //dispatch(g.actions.showDialog({name: 'blocktrades_deposit', params: {outputCoinType: 'VESTS'}}));
    },
  })
)(App);

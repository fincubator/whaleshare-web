// sometimes it's impossible to use html tags to style coin name, hence usage of _UPPERCASE modifier
export const APP_NAME = 'Whaleshares';
// sometimes APP_NAME is written in non-latin characters, but they are needed for technical purposes
// ie. "Голос" > "Golos"
export const APP_NAME_LATIN = 'Whaleshares';
export const APP_NAME_UPPERCASE = 'WHALESHARES';
export const APP_ICON = 'steem';
// FIXME figure out best way to do this on both client and server from env
// vars. client should read $STM_Config, server should read config package.
export const APP_DOMAIN = 'whaleshares.io';
export const LIQUID_TOKEN = 'WLS';
// sometimes it's impossible to use html tags to style coin name, hence usage of _UPPERCASE modifier
export const LIQUID_TOKEN_UPPERCASE = 'WLS';
export const VESTING_TOKEN = 'WHALESTAKE';
export const INVEST_TOKEN_UPPERCASE = 'WHALESTAKE';
export const INVEST_TOKEN_SHORT = 'WHALESTAKE';
export const DEBT_TOKEN = 'WLS DOLLAR';
export const DEBT_TOKENS = 'WLS DOLLARS';
export const CURRENCY_SIGN = '$';
export const WIKI_URL = '';
export const LANDING_PAGE_URL = 'https://whaleshares.io/';
export const TERMS_OF_SERVICE_URL = 'https://' + APP_DOMAIN + '/tos.html';
export const PRIVACY_POLICY_URL = 'https://' + APP_DOMAIN + '/privacy.html';
export const WHITEPAPER_URL = 'https://steem.io/SteemWhitePaper.pdf';

// these are dealing with asset types, not displaying to client, rather sending data over websocket
export const LIQUID_TICKER = 'WLS';
export const VEST_TICKER = 'VESTS';
export const DEBT_TICKER = 'SBD';
export const DEBT_TOKEN_SHORT = 'SBD';

// application settings
export const DEFAULT_LANGUAGE = 'en'; // used on application internationalization bootstrap
export const DEFAULT_CURRENCY = 'USD';
export const ALLOWED_CURRENCIES = ['USD'];
export const FRACTION_DIGITS = 2; // default amount of decimal digits
export const FRACTION_DIGITS_MARKET = 3; // accurate amount of deciaml digits (example: used in market)

// meta info
export const TWITTER_HANDLE = '@Whaleshares';
export const SHARE_IMAGE = 'https://' +
    APP_DOMAIN +
    '/images/wls-share.png';
export const TWITTER_SHARE_IMAGE = 'https://' +
    APP_DOMAIN +
    '/images/wls-icon-twshare-2.jpg';
export const SITE_DESCRIPTION = 'Whaleshares is a social media platform where everyone gets paid for ' +
    'creating and curating content.';

// various
export const SUPPORT_EMAIL = 'support@' + APP_DOMAIN;

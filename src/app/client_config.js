// sometimes it's impossible to use html tags to style coin name, hence usage of _UPPERCASE modifier
export const APP_NAME = 'Whaleshares';
export const APP_ICON = 'steem';
// FIXME figure out best way to do this on both client and server from env
// vars. client should read $STM_Config, server should read config package.
export const APP_DOMAIN = 'wls.fintehru.org';
export const LIQUID_TOKEN = 'WLS';
// sometimes it's impossible to use html tags to style coin name, hence usage of _UPPERCASE modifier
export const LIQUID_TOKEN_UPPERCASE = 'WLS';
export const VESTING_TOKEN = 'WHALESTAKE';
export const INVEST_TOKEN_UPPERCASE = 'WHALESTAKE';
export const CURRENCY_SIGN = '$';

// these are dealing with asset types, not displaying to client, rather sending data over websocket
export const LIQUID_TICKER = 'WLS';
export const VEST_TICKER = 'VESTS';

// application settings
export const DEFAULT_LANGUAGE = 'en'; // used on application internationalization bootstrap
export const DEFAULT_CURRENCY = 'USD';
export const FRACTION_DIGITS = 2; // default amount of decimal digits

// meta info
// various
export const SUPPORT_EMAIL = 'support@' + APP_DOMAIN;

import * as steem from '@whaleshares/wlsjs'

steem.config.set('address_prefix', 'WLS')

let chain_id = "de999ada2ff7ed3d3d580381f229b40b5a0261aec48eb830e540080817b72866"

module.exports = {
    address_prefix: "WLS",
    expire_in_secs: 15,
    chain_id
}

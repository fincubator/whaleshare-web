import React from 'react';
import {connect} from 'react-redux'
import g from 'app/redux/GlobalReducer'
import reactForm from 'app/utils/ReactForm'
import Slider from 'react-rangeslider';
import transaction from 'app/redux/Transaction';
import user from 'app/redux/User';
import tt from 'counterpart'
import {VEST_TICKER, LIQUID_TICKER, VESTING_TOKEN} from 'app/client_config'
import {numberWithCommas, spToVestsf, vestsToSpf, vestsToSp, assetFloat} from 'app/utils/StateFunctions'

class Powerdown extends React.Component {

  constructor(props, context) {
    super(props, context)
    let new_withdraw
    if (props.to_withdraw - props.withdrawn > 0) {
      new_withdraw = props.to_withdraw - props.withdrawn
    } else {
      // Set the default withrawal amount to (available - 5 WLS)
      // This should be removed post hf20
      new_withdraw = Math.max(0, props.available_shares - spToVestsf(props.state, 5.001))
    }
    this.state = {
      broadcasting: false,
      manual_entry: false,
      new_withdraw,
    }
  }

  render() {
    const {broadcasting, new_withdraw, manual_entry} = this.state;
    const {account, withdrawn, to_withdraw, vesting_shares, powerdown_limit} = this.props;
    const formatSp = (amount) => numberWithCommas(vestsToSp(this.props.state, amount));

    const vesting_shares_limit = Math.floor((vesting_shares * powerdown_limit) / 100);

    const sliderChange = (value) => {
      this.setState({new_withdraw: value, manual_entry: false})
    }
    const inputChange = (event) => {
      event.preventDefault()
      let value = spToVestsf(this.props.state, parseFloat(event.target.value.replace(/,/g, '')))
      if (!isFinite(value)) {
        value = new_withdraw
      }
      this.setState({new_withdraw: value, manual_entry: event.target.value})
    }
    const powerDown = (event) => {
      event.preventDefault()
      this.setState({broadcasting: true, error_message: undefined})
      const successCallback = this.props.successCallback
      const errorCallback = (error) => {
        this.setState({broadcasting: false, error_message: String(error)})
      }
      // workaround bad math in react-rangeslider
      let withdraw = new_withdraw
      if (withdraw > vesting_shares_limit) {
        withdraw = vesting_shares_limit
      }
      const vesting_shares = `${ withdraw.toFixed(6) } ${ VEST_TICKER }`
      this.props.withdrawVesting({account, vesting_shares, errorCallback, successCallback})
    }

    const notes = []
    if (to_withdraw - withdrawn > 0) {
      const AMOUNT = formatSp(to_withdraw)
      const WITHDRAWN = formatSp(withdrawn)
      notes.push(
        <li key="already_power_down">
          {tt('powerdown_jsx.already_power_down', {AMOUNT, WITHDRAWN, LIQUID_TICKER})}
        </li>
      )
    }
    if (notes.length === 0) {
      let AMOUNT = vestsToSpf(this.props.state, new_withdraw) / 13
      AMOUNT = AMOUNT.toFixed(AMOUNT >= 10 ? 0 : 1)
      notes.push(
        <li key="per_week">
          {tt('powerdown_jsx.per_week', {AMOUNT, LIQUID_TICKER})}
        </li>
      )
    }
    // NOTE: remove this post hf20
    if (new_withdraw > vesting_shares_limit - spToVestsf(this.props.state, 5)) {
      const AMOUNT = 5
      notes.push(
        <li key="warning" className="warning">
          {tt('powerdown_jsx.warning', {AMOUNT, VESTING_TOKEN})}
        </li>
      )
    }

    if (this.state.error_message) {
      const MESSAGE = this.state.error_message
      notes.push(
        <li key="error" className="error">
          {tt('powerdown_jsx.error', {MESSAGE})}
        </li>
      )
    }

    return (
      <div className="PowerdownModal">
        <div className="row">
          <h3 className="column">{tt('powerdown_jsx.power_down')} {broadcasting}</h3>
        </div>
        <Slider
          value={new_withdraw}
          step={0.000001}
          max={vesting_shares_limit}
          format={formatSp}
          onChange={sliderChange}
        />
        <p className="powerdown-amount">
          {tt('powerdown_jsx.amount')}<br/>
          <input
            value={manual_entry ? manual_entry : formatSp(new_withdraw)}
            onChange={inputChange}
            autoCorrect={false}/>
          {LIQUID_TICKER}
        </p>
        <ul className="powerdown-notes">{notes}</ul>
        <button type="submit" className="button" onClick={powerDown}
                disabled={broadcasting}>{tt('powerdown_jsx.power_down')}</button>
      </div>
    )
  }
}

export default connect(
  // mapStateToProps
  (state, ownProps) => {
    const values = state.user.get('powerdown_defaults')
    const account = values.get('account')
    const to_withdraw = parseFloat(values.get('to_withdraw')) / 1e6
    const withdrawn = parseFloat(values.get('withdrawn')) / 1e6
    const vesting_shares = assetFloat(values.get('vesting_shares'), VEST_TICKER)

    ////////////////////////////////
    // caculate powerdown_limit
    const WLS_BLOCKS_PER_YEAR = 10512000;
    const current_head_block_num = state.global.getIn(['props', 'head_block_number']);
    const at_year = Math.min( Math.floor(current_head_block_num/WLS_BLOCKS_PER_YEAR), 8);
    const start_inflation_rate = 10000/(1 << at_year);
    const inflation_rate_floor = 488;
    const end_inflation_rate = start_inflation_rate/2;
    const dif_inflation_rate = start_inflation_rate - end_inflation_rate;
    const inflation_rate_adjustment = ((current_head_block_num % WLS_BLOCKS_PER_YEAR) * dif_inflation_rate) / WLS_BLOCKS_PER_YEAR;
    const current_inflation_rate = Math.max( start_inflation_rate - inflation_rate_adjustment, inflation_rate_floor );
    const powerdown_limit = Math.floor((10000 - current_inflation_rate)/100);
    // console.log(`powerdown_limit=${powerdown_limit}`);

    ////////////////////////////////
    const available_shares = Math.floor((vesting_shares * powerdown_limit)/100) - to_withdraw - withdrawn;

    return {
      ...ownProps,
      account,
      available_shares,
      state,
      to_withdraw,
      vesting_shares,
      withdrawn,
      powerdown_limit,
    }
  },
  // mapDispatchToProps
  dispatch => ({
    successCallback: () => {
      dispatch(user.actions.hidePowerdown())
    },
    powerDown: (e) => {
      e.preventDefault()
      const name = 'powerDown';
      dispatch(g.actions.showDialog({name}))
    },
    withdrawVesting: ({account, vesting_shares, errorCallback, successCallback}) => {
      const successCallbackWrapper = (...args) => {
        dispatch({type: 'global/GET_STATE', payload: {url: `@${account}/transfers`}})
        return successCallback(...args)
      }
      dispatch(transaction.actions.broadcastOperation({
        type: 'withdraw_vesting',
        operation: {account, vesting_shares},
        errorCallback,
        successCallback: successCallbackWrapper,
      }))
    },
  })
)(Powerdown)

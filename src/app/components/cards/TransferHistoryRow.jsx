import React from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';
// import Icon from 'app/components/elements/Icon';
import Memo from 'app/components/elements/Memo'
import {numberWithCommas, vestsToSp} from 'app/utils/StateFunctions'
import tt from 'counterpart';

class TransferHistoryRow extends React.Component {
  render() {
    const {op, context, curation_reward, author_reward, benefactor_reward, powerdown_vests, reward_vests} = this.props;
    // context -> account perspective

    const type = op[1].op[0];
    const data = op[1].op[1];

    /*  all transfers involve up to 2 accounts, context and 1 other. */
    let description_start = "";
    let other_account = null;
    let description_end = "";

    if (type === 'transfer_to_vesting') {
      if (data.from === context) {
        if (data.to === "") {
          description_start += tt('g.transfer') + data.amount.split(' ')[0] + tt('g.to') + " WHALESTAKE";
        }
        else {
          description_start += tt('g.transfer') + data.amount.split(' ')[0] + " WHALESTAKE " + tt('g.to');
          other_account = data.to;
        }
      }
      else if (data.to === context) {
        description_start += tt('g.receive') + data.amount.split(' ')[0] + " WHALESTAKE " + tt('g.from');
        other_account = data.from;
      } else {
        description_start += tt('g.transfer') + data.amount.split(' ')[0] + " WHALESTAKE " + tt('g.from') + data.from + tt('g.to');
        other_account = data.to;
      }
    } else if (/^transfer$/.test(type)) {
      const fromWhere = '';
      if (data.from === context) {
        description_start += tt('g.transfer') + `${fromWhere} ${data.amount}` + tt('g.to');
        other_account = data.to;
      }
      else if (data.to === context) {
        description_start += tt('g.receive') + `${fromWhere} ${data.amount}` + tt('g.from');
        other_account = data.from;
      } else {
        description_start += tt('g.transfer') + `${fromWhere} ${data.amount}` + tt('g.from');
        other_account = data.from;
        description_end += tt('g.to') + data.to;
      }
      if (data.request_id != null)
        description_end += ` (${tt('g.request')} ${data.request_id})`
    } else if (type === 'withdraw_vesting') {
      if (data.vesting_shares === '0.000000 VESTS')
        description_start += tt('transferhistoryrow_jsx.stop_power_down');
      else
        description_start += tt('transferhistoryrow_jsx.start_power_down_of') + ' ' + powerdown_vests + " WLS";
    } else if (type === 'curation_reward') {
      description_start += `${curation_reward} WHALESTAKE ` + tt('g.for') + ' ';
      other_account = data.comment_author + "/" + data.comment_permlink;
    } else if (type === 'author_reward') {
      description_start += `${author_reward} WHALESTAKE ${tt('g.for')} ${data.author}/${data.permlink}`;

      // other_account = ``;
      description_end = '';
    } else if (type === 'claim_reward_balance') {
      description_start += tt('g.claim_rewards') + `${reward_vests} WHALESTAKE`;
      description_end = '';
    } else if (type === 'comment_benefactor_reward') {
      description_start += `${benefactor_reward} WHALESTAKE for ${data.author}/${data.permlink}`;
      description_end = '';
    } else {
      description_start += JSON.stringify({type, ...data}, null, 2);
    }
    // <Icon name="clock" className="space-right" />
    return (
      <tr key={op[0]} className="Trans">
        <td>
          <TimeAgoWrapper date={op[1].timestamp}/>
        </td>
        <td className="TransferHistoryRow__text" style={{maxWidth: "40rem"}}>
          {description_start}
          {other_account && <Link to={`/@${other_account}`}>{other_account}</Link>}
          {description_end}
        </td>
        <td className="show-for-medium" style={{maxWidth: "40rem", wordWrap: "break-word"}}>
          <Memo text={data.memo} username={context}/>
        </td>
      </tr>
    );
  }
}

export default connect(
  // mapStateToProps
  (state, ownProps) => {
    const op = ownProps.op;
    const type = op[1].op[0];
    const data = op[1].op[1];
    const powerdown_vests = type === 'withdraw_vesting' ? numberWithCommas(vestsToSp(state, data.vesting_shares)) : undefined;
    const reward_vests = type === 'claim_reward_balance' ? numberWithCommas(vestsToSp(state, data.reward_vests)) : undefined;
    const curation_reward = type === 'curation_reward' ? numberWithCommas(vestsToSp(state, data.reward)) : undefined;
    const author_reward = type === 'author_reward' ? numberWithCommas(vestsToSp(state, data.vesting_payout)) : undefined;
    const benefactor_reward = type === 'comment_benefactor_reward' ? numberWithCommas(vestsToSp(state, data.reward)) : undefined;
    return {
      ...ownProps,
      curation_reward,
      author_reward,
      benefactor_reward,
      powerdown_vests,
      reward_vests,
    }
  },
)(TransferHistoryRow)

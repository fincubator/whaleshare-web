import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
// import {serverApiRecordEvent} from 'app/utils/ServerApiClient';
import Icon from 'app/components/elements/Icon';
import CopyToClipboard from 'react-copy-to-clipboard';
import tt from 'counterpart';

class ExplorePost extends Component {

  static propTypes = {
    permlink: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      copied: false
    };
    this.onCopy = this.onCopy.bind(this);
    // this.Busy = this.Busy.bind(this);
  }

  // Busy() {
  //     // serverApiRecordEvent('Busy view', this.props.permlink);
  // }

  onCopy() {
    this.setState({
      copied: true
    });
  }

  render() {
    const link = this.props.permlink;
    // const busy = 'https://busy.org' + link;
    const whaleshares_io = 'https://whaleshares.io' + link;
    let text = this.state.copied == true ? tt('explorepost_jsx.copied') : tt('explorepost_jsx.copy');
    return (
      <span className="ExplorePost">
                <h4>{tt('g.share_this_post')}</h4>
                <hr/>
                <div className="input-group">
                    <input className="input-group-field share-box" type="text" value={whaleshares_io}
                           onChange={(e) => e.preventDefault()}/>
                    <CopyToClipboard text={whaleshares_io} onCopy={this.onCopy}
                                     className="ExplorePost__copy-button input-group-label">
                      <span>{text}</span>
                    </CopyToClipboard>
                </div>
            </span>
    )
  }
}

export default connect()(ExplorePost)

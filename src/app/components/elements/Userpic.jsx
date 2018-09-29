import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import shouldComponentUpdate from 'app/utils/shouldComponentUpdate';
import {imageProxy} from 'app/utils/ProxifyUrl';

export const SIZE_SMALL = 'small';
export const SIZE_MED = 'medium';
export const SIZE_LARGE = 'large';

const sizeList = [SIZE_SMALL, SIZE_MED, SIZE_LARGE]

export const avatarSize = {
  small: SIZE_SMALL,
  medium: SIZE_MED,
  large: SIZE_LARGE
};

class Userpic extends Component {

  shouldComponentUpdate = shouldComponentUpdate(this, 'Userpic')

  render() {
    const {json_metadata, account} = this.props;

    if ((typeof(account) === "undefined") || (account === null) || (account === '')) {
      return null;
    }

    let profileImageUrl = `/images/user.png`;

    // try to extract image url from users metaData
    try {
      const metadata = JSON.parse(json_metadata);

      if (metadata.profile.profile_image) {
        if (/^(https?:)\/\//.test(metadata.profile.profile_image)) {
          // hack to get profile images to display. This doesn't work if there is no metadata
          profileImageUrl = `${imageProxy()}64/${metadata.profile.profile_image}`;
        }
      }
    } catch (error) {
      // just use the convention
      profileImageUrl = `https://${$STM_Config.site_domain}/profileimage/${account}`;
    }

    return (<div className="Userpic" style={{backgroundImage: `url(${profileImageUrl})`}}/>)

  }
}

Userpic.propTypes = {
  account: PropTypes.string.isRequired
}

export default connect(
  (state, ownProps) => {
    const {account, hideIfDefault} = ownProps
    return {
      account,
      json_metadata: state.global.getIn(['accounts', account, 'json_metadata']),
      hideIfDefault,
    }
  }
)(Userpic)

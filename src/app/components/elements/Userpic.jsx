import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import shouldComponentUpdate from 'app/utils/shouldComponentUpdate';
import {imageProxy} from 'app/utils/ProxifyUrl';

export const SIZE_SMALL = 'small';
export const SIZE_MED = 'medium';
export const SIZE_LARGE = 'large';

export const avatarSize = {
  small: SIZE_SMALL,
  medium: SIZE_MED,
  large: SIZE_LARGE
};

class Userpic extends Component {

  shouldComponentUpdate = shouldComponentUpdate(this, 'Userpic');

  render() {
    const {account, size} = this.props;

    if ((typeof(account) === "undefined") || (account === null) || (account === '')) {
      return null;
    }

    let img_size = "64x64";
    if (size === SIZE_SMALL) {
      img_size = "32x32";
    } else if (size === SIZE_MED) {
      img_size = "48x48";
    } else if (size === SIZE_LARGE) {
      img_size = "96x96";
    }

    const profile_image_url = `${imageProxy()}profileimage/${account}/${img_size}`;
    return (<div className="Userpic" style={{backgroundImage: `url(${profile_image_url})`}}/>)
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
      hideIfDefault,
    }
  }
)(Userpic)

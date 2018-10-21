import React from 'react';

class NewSignup extends React.Component {
  render() {
    return (
      <div className="row Claim">
        <div className="column large-12">
          <h1>New Signup System</h1>
          <p>We are migrating to the new signup system, please continue at <a
              href="https://signup.wls.services">https://signup.wls.services</a>.</p>
          <p>Note that request to create new account is approved by active witnesses.</p>
        </div>
      </div>
    );
  }
}

module.exports = {
  path: 'newsignup.html',
  component: NewSignup
};

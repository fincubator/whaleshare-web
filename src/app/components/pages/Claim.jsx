import React from 'react';

class Claim extends React.Component {
    render() {
        return (
            <div className="row Claim">
              <div className="column large-12">
                <h1>Account Claim Period</h1>
                <p>We are currently in a sharedrop claim period. Only people included in the sharedrop can create account before September 15, 2018.  If you know you are entitled to the sharedrop, please use the claim form <a href="https://wls.services">here</a>.</p>
                <p>You can check the official sharedrop claim instructions <a href="/whaleshares/@whaleshares/whaleshares-sharedrop-claim-announcement-instructions-inside">here</a>.</p>
              </div>
            </div>
        );
    }
}

module.exports = {
    path: 'claim.html',
    component: Claim
};

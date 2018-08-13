import React from 'react';

class Testnet extends React.Component {
    render() {
        return (
            <div className="row Testnet">
              <div className="column large-12">
                <h1>TestNet Notice</h1>
                <h3>1. Whaleshales Beta is a TestNet, not a live platform</h3>
                <p>Keep in mind, by the time Whaleshares goes live it will be very different than you are used to, and very different than you see it now even. 
                  The rules for earning, sharing and rewarding content will be <em>turned on their heads</em> so to speak. 
                  Features and functionalities are still be developed and will coded in over time.
                </p>
                <h3>2. TestNet Whaleshares (WLS) Tokens / Whalestake have no real value</h3>
                <p>Current rewards and vote power are not really giving people those rewards atm (remember this is a testnet). 
                  The calculations are for a new token supply (WLS) that does not have a set market value at the moment. 
                  So it's all 'monopoly money' values at the moment. 
                  All rewards are 'just for fun' and help test the weight/power of rewarding content as you grow the 'temporary' Whalestake. 
                  <em>We have added a notice bar at the top to remind everyone of this</em>.
                </p>
                <h3>3. All earnings will be reset to $0 at Pre-Launch (Open BETA)</h3>
                <p>So don't worry, if your account has not been activated yet, you are <strong>not &quot;missing out&quot;</strong>. 
                  Also, the price feeds will then be calculating based on the actual value of the WLS token on the DEX.
                </p>
                <h3>4. Pre-launch posts/replies will stay</h3>
                <p>At the moment the team is thinking the post content/replies will stay to keep this as an archive of its early development.</p>
                <h3>5. Whitepaper coming soon</h3>
                <p>Be patient, things will be explained in time.</p>
                <h3>6. Launch date is September 1, 2018</h3>
                <p>The Whaleshares platform will open for normal use and the standard account creation process will be activated. At this time anyone is free to sign up. <em>Power Down will not be activated until October 1, 2018</em>.
                </p>
                <hr />
                <p>While we do welcome feedback or credible &quot;bug&quot; finds, we need everyone using the platform at this point to understand once again - 
                  <strong>this is an early &quot;closed&quot; beta</strong>! You are posting on a platform that does not even have all it's intended functionality and governance built in yet.
                </p>
                <p>For example... we know there is no flag/downvote button. This is NOT a bug or a problem, it was simply disabled since it serves no productive purpose at this point.</p>
                <p>There ya have it.</p>
                <p><strong>Keep on blogging with your normal posts to help build the early archives here on Whaleshares</strong>, but don't get too caught up in the technical stuff at this point. 
                  Let the dev team do their job and roll out the next batch of enhancements for everyone to try out.
                </p>
              </div>
            </div>
        );
    }
}

module.exports = {
    path: 'testnet.html',
    component: Testnet
};

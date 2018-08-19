import React from 'react';
import HelpContent from 'app/components/elements/HelpContent';

class Welcome extends React.Component {
    render() {
        return (
            <div className="row">
                <div className="column large-12 medium-12 small-12">
                  <div className="Text">
                    <div className="Welcome__banner">
                        <img src={require('app/assets/images/welcoming-promoart.jpg')} />
                    </div>
                    <HelpContent path="welcome" />
                    <div className="Welcome__video">
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/EjvWEoJ-shc?rel=0&amp;showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                    </div>
                </div>
              </div>
            </div>
        );
    }
}

module.exports = {
    path: 'welcome',
    component: Welcome
};

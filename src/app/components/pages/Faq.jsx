import React from 'react';
import HelpContent from 'app/components/elements/HelpContent';

class Faq extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="column large-12 medium-12 small-12">
          <div className="Text">
            <HelpContent path="faq"/>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = {
  path: 'faq.html',
  component: Faq
};

/** @jsx React.DOM */
var React = require('react'),
    Graph = require('./Graph');

var DebtCalc = React.createClass({
  getInitialState: function() {
    return {
      name: ''
    };
  },
  componentDidMount: function () {
    this.refs.debtName.getDOMNode().focus();
  },
  render: function () {
    var close = this.props.closeFn,
        name = this.props.name,
        removePayment = this.onRemoveAdditionalPayment,
        additionalPayments = this.state.additionalPayments;

    return (
      <div className="col-lg-6">
        <div className="debt-calc">
          <div className="row">
            <div className="col-lg-12">
              <div className="col-xs-9">
                <input id="debtName" type="text" placeholder={ name } onChange={ this.onNameChange } ref="debtName" />
              </div>
              <div className="col-xs-3">
                <button type="button" className="close" aria-label="Close" onClick={close}><span aria-hidden="true">&times;</span></button>
              </div>
            </div>
          </div>
          {this.props.children.map(function (child, i) {
            return (
              <div className="row" key={i}>{child}</div>
            );
          })}
        </div>
      </div>
    );
  }
});

module.exports = DebtCalc;

/** @jsx React.DOM */
var React = require('react'),
    Debtalyzer = require('./Debtalyzer');

var DebtForm = React.createClass({
  onAddAdditionalPayment: function (e) {
    var payments = this.props.data.data.addedPayments,
        months = this.props.data.data.months;

    if (payments.length >= months) return;

    payments.push({ name: 'New Payment', amount: 0 });

    this.props.onUpdate(this.props.data);
  },
  onRemoveAdditionalPayment: function (i) {
    this.props.data.data.addedPayments.splice(i, 1);
    this.props.onUpdate(this.props.data);
  },
  onDebtChange: function(e) {
    this.props.data.data.amount = Debtalyzer.parseMoney(e.target.value);
    this.props.onUpdate(this.props.data);
  },
  onInterestChange: function (e) {
    if (e.target.value.length < 2) return;
    if (parseFloat(e.target.value) == 0) return;

    this.props.data.data.interest = parseFloat(e.target.value);
    this.props.onUpdate(this.props.data);
  },
  onPaymentChange: function (e) {
    this.props.data.data.payment = Debtalyzer.parseMoney(e.target.value);
    this.props.onUpdate(this.props.data);
  },
  onNameChange: function (e) {
    if (e.target.value.length < 1) return;
    this.props.data.data.name = e.target.value;
    this.props.onUpdate(this.props.data);
  },
  onMonthChange: function (e) {
    this.props.data.data.months = e.target.value;
    this.props.onUpdate(this.props.data);
  },
  render: function () {
    var removePayment = this.onRemoveAdditionalPayment,
        months = this.props.months,
        debt = this.props.data;
    var self = this;

    return (
      <form className="col-lg-12">
        <div className="calcInputs">
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="interestRate">Interest Rate</label>
              <input id="interestRate" type="text" placeholder={ debt.data.rate + '%' } onChange={ this.onInterestChange } />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="debt">Debt</label>
              <input id="debt" type="text" placeholder={ '$' + debt.data.amount } onChange={ this.onDebtChange } />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="payment">Monthly Payment</label>
              <input id="payment" type="text" placeholder={ '$' + debt.data.payment } onChange={ this.onPaymentChange } />
            </div>
          </div>
          <div className="col-md-3">
            <label htmlFor="months">Period</label>
            <div className="form-group">
              <select id="months" onChange={ this.onMonthChange } value={ months.length } >
                <option value="6">6</option>
                <option value="9">9</option>
                <option value="12">12</option>
                <option value="18">18</option>
                <option value="24">24</option>
                <option value="36">36</option>
              </select>
            </div>
          </div>
          <div className="paymentInputs">
            {debt.data.addedPayments.map(function (payment, i) {
              return <Payment name={payment.name} onClose={ removePayment.bind(null, i) } key={i} months={months} />;
            })}
          </div>
          <div className="col-md-4 col-md-offset-4">
            <button type="button" className="btn btn-primary" onClick={ this.onAddAdditionalPayment }><span className="glyphicon glyphicon-plus"></span> Add Payment</button>
          </div>
        </div>
      </form>
    );
  }
});


Payment = React.createClass({
  getInitialState: function () {
    return { 
      id: 0,
      name: 'Example Payment',
      amount: 0
    }
  },
  onAmountChange: function (e) {
    this.setState({ amount: Debtalyzer.parseMoney(e.target.value) });
  },
  onNameChange: function (e) {
    if (e.target.value.length < 1) return;
    this.setState({ name: e.target.value });
  },
  render: function () {
    months = this.props.months;

    return (
      <div>
        <div className="col-md-6">
          <label>Payment Name</label>
          <div className="form-group">
            <input type="text" placeholder={this.props.name} />
          </div>
        </div>
        <div className="col-md-3">
          <label>Amount</label>
          <div className="form-group">
            <input type="text" placeholder={'$' + this.state.amount.toFixed(2)} onChange={this.onAmountChanged}/>
          </div>
        </div>
        <div className="col-md-3">
          <button type="button" className="close" aria-label="Close" onClick={this.props.onClose}><span aria-hidden="true">×</span></button>
          <label>Month</label>
          <div className="form-group">
            <select name="paymentMonth">
              {months.map(function (month, i) {
                return <option value={i} key={i}>{month}</option>
              })}
            </select>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = DebtForm;

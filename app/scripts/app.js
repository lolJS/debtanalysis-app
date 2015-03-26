/** @jsx React.DOM */

var React = window.React = require('react'),
    DebtCalc = require('./ui/DebtCalc'),
    Graph = require('./ui/Graph'),
    DebtForm = require('./ui/DebtForm'),
    Debtalyzer = require('./ui/Debtalyzer'),
    mountNode = document.getElementById('app');

var DebtCalcModel = function () { 
  return {
     id: 0,
     name: 'Example Debt',
     data: {
       rate: 24.5,
       amount: 624.15,
       payment: 135.50,
       months: 6,
       addedPayments: [
         { name: 'Example Payment', amount: 0.00, month: 1 }
       ]
     }
  };
}

var DebtalyzerApp = React.createClass({
  getInitialState: function () {
    var debtModel = DebtCalcModel();
    return {
      debts: [ debtModel ]
    };
  },
  getDefaultProps: function () {
    return {
      index: 1
    }
  },
  onAddDebt: function (e) {
    var state = this.state.debts,
        newModel = DebtCalcModel();

    newModel.name += ' ' + this.props.index;
    newModel.id = this.props.index++;

    state.push( newModel );
    this.setState({ debts: state });
  },
  onRemoveDebt: function (debt) {
    var state = this.state.debts;
    state.splice(state.indexOf(debt), 1);

    this.props.index--;
    this.setState({ debts: state });
  },
  updateModel: function (newState) {
    var state = this.state.debts;

    state[newState.id] = newState;

    this.setState(state);
  },
  sumOfAllDebt: function (debts) {
    for (var i = debts.length, amount = 0; i--;) {
      amount += Number(debts[i].debt.total);
    }

    return amount;
  },
  sumOfAllInterest: function (debts) {
    for (var i = debts.length, amount = 0; i--;) {
      amount += Number(debts[i].debt.interest);
    }

    return amount;
  },
  combineDebts: function (debts) {
    var series = [];
    for (var i = debts.length; i--;)
      debts[i].debt.perMonth.map(function (amount, i) {
        series[i] = (series[i] == null) ? 0 : series[i];
        series[i] += Number(amount);
      });

    return series;
  },
  render: function () {
    var debts = this.state.debts,
        analyzedDebts = [],
        closeFn = this.onRemoveDebt,
        updateFn = this.updateModel,
        months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

    debts.map(function (debt, i) {
      var analyzed = Debtalyzer.calcInterest(debt.data.amount, debt.data.rate, debt.data.payment, debt.data.addedPayments, Number(debt.data.months));
      analyzedDebts.push({ debt: analyzed });
    });

    return (
      <div>
        <div className="row">
          <div className="col-lg-12">
            <div className="debt-calc col-lg-12">
              <div className="row">
                <div className="col-lg-12">
                  <h2>Total Debt Analysis</h2>
                </div>
                <div className="col-md-8">
                  <div className="total-chart"> 
                    <Graph data={ {
                      labels: months,
                      series: [ this.combineDebts(analyzedDebts) ]
                    } } chartType={'Line'} />
                  </div>
                </div>
                <div className="col-md-4">
                  <Graph data={ {
                    labels: [ 'Capital', 'Interest' ],
                    series: [ Number(this.sumOfAllDebt(analyzedDebts)), Number(this.sumOfAllInterest(analyzedDebts)) ]
                  } } chartType={'Pie'} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          {debts.map(function (debt, i) {
            var months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
            if (debt.data.months <= 12)
              months = months.splice(0, parseFloat(debt.data.months));
            else {
              var monthsMultiple = debt.data.months / 12;
              for (var i = 0; i < monthsMultiple; i++) {
                months.map(function (month) {
                  months.push(month);
                });
              }
            }
            return (
                <DebtCalc name={debt.name} closeFn={closeFn.bind(null, debt)} key={i}>
                  <Graph className="col-lg-12" data={ {
                        labels: months,
                        series: [ { name: 'Remaining', data: analyzedDebts[i].debt.perMonth }, { name: 'Interest', data: analyzedDebts[i].debt.intPerMonth } ]
                      } } chartType={'Line'} />
                  <DebtForm onUpdate={updateFn} data={debt} months={months} />
                </DebtCalc>
              );
          })}
          <div className="col-lg-6">
            <div className="calc-placeholder">
              <button type="button" className="btn btn-primary" onClick={this.onAddDebt}><span className="glyphicon glyphicon-plus"></span> Add New Debt</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});




React.render(<DebtalyzerApp />, mountNode);

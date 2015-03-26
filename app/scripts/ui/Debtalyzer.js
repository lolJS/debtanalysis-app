var Debtalyzer = {
  calcPayPeriod: function(amountOfDebt, interestRate, monthlyPayment, additionalPayment) {
    var a = 1 - ((amountOfDebt * (interestRate / 100)) / ((monthlyPayment * 12) + (additionalPayment * 12)));
    var months = 12 * (-Math.log(a)) / (12 * Math.log(1 + ((interestRate / 100) / 12)));
    if(months % 1 != 0) {
      months ++;
    }
    if(isNaN(months)) {
      return -1;
    } else {
      return (Math.round(months * 100) / 100).toFixed(0);
    }
  },
  calcInterest: function (amountOfDebt, interestRate, monthlyPayment, additionalPayments, months) {
    // assume they're giveing you the average daily balance
    // and rate is a % i.e. 14%
    var calculatedAmountOfDebt = 0,
        calculatedInterest = calculatedAmountOfDebt,
        debtSeries = [],
        interestSeries = [],
        payPeriod = 0,
        total = Number(amountOfDebt);

    calculatedAmountOfDebt += total;

    debtSeries.push(calculatedAmountOfDebt);
    interestSeries.push(0)
    
    for (var i = 1; i <= months / 12 * 365; i++) {
      var dailyInterest = calculatedAmountOfDebt * (interestRate / 100) / 365;
      
      dailyInterest = Math.round(dailyInterest * 100) / 100;

      calculatedAmountOfDebt += dailyInterest;
      
      calculatedInterest += dailyInterest;

      if (calculatedAmountOfDebt <= 0) break;
      
      if (i % 30 == 0) {
        if (calculatedAmountOfDebt > monthlyPayment) {
          var currentMonth = new Date(Date.parse('01/01/' + new Date().getFullYear()) + 20 * 86400000).getMonth();

          calculatedAmountOfDebt -= monthlyPayment;

          if (i % 30 < additionalPayments.length) {
            calculatedAmountOfDebt -= additionalPayments[i % 30].amount; 
          }

        } else {
          i = months / 12 * 365;
        }

        interestSeries.push(calculatedInterest.toFixed(2));

        if (Math.round(calculatedAmountOfDebt) > 0) {
          debtSeries.push(calculatedAmountOfDebt.toFixed(2));
          payPeriod++;
        }
      }
    }

    return {
      total: Number(amountOfDebt + calculatedInterest).toFixed(2),
      interest: calculatedInterest.toFixed(2),
      intPerMonth: interestSeries,
      perMonth: debtSeries,
      payPeriod: payPeriod
    };
  },
  parseMoney: function (dollar) {
    var value;
    if (dollar.length < 1) return;
    if (dollar.match(/(,|\s|\$)+/g) > -1)
      value = dollar.replace(/(,|\s|\$)+/g, '');

    return parseFloat(value | dollar).toFixed(2) || (0).toFixed(2);
  }
};

module.exports = Debtalyzer;

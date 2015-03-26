/** @jsx React.DOM */
var React = require('react'),
    ChartistGraph = require('react-chartist');

var Graph = React.createClass({
	tooltipTimeout: null,
	componentDidMount: function () {
		var tooltip = this.refs.tooltip,
				tooltipNode = this.refs.chart.getDOMNode(),
				tooltipTimeout = this.tooltipTimeout;

		tooltipNode.onmouseover = function (e) {
			if (e.target.classList[0] === 'ct-point') {
				var value = e.target.attributes['ct:value'].value,
						series = e.target.parentElement.attributes['ct:series-name'].value || 'Remaining',
						x = e.target.attributes['x1'].value,
						y = e.target.attributes['y1'].value,
						msg = function () { 
							return (<span><strong>{series}:</strong> ${value}</span>);
					  };

				clearTimeout(tooltipTimeout);

				tooltip.getDOMNode().style.top = Number(y) + 30 + 'px';
				tooltip.getDOMNode().style.left = x - 42 + 'px';

				tooltip.setMessage(msg());
				tooltip.toggle(true, x, y);
			};
		};

		tooltipNode.onmouseout = function (e) {
			if (e.originalTarget.classList[0] === 'ct-point') {
				tooltipTimeout = setTimeout(function() {
						tooltip.toggle(false);
					}, 550);
			}
		};
	},
	render: function () {
		var chartData = this.props.data,
				type = this.props.chartType || 'Line',
				lineDefaultOptions = {
		      fullWidth: true,
		      showPoint: true,
		      lineSmooth: true,
		      chartPadding: 5,
		      axisX: {
		        // We can disable the grid for this axis
		        showGrid: false,
		        showLabel: true,
		        labelOffset: {
		        	x: 5,
		        	y: 10
		        }
		      },
		      // Y-Axis specific configuration
		      axisY: {
		        // Lets offset the chart a bit from the labels
		        // The label interpolation function enables you to modify the values
		        // used for the labels on each axis.
		        labelInterpolationFnc: function (value) {
		        	value = Number(value);
		        	if (value >= 1000000) return '$' + value / 1000000 + 'M';
		        	if (value >= 1000) return '$' + value / 1000 + 'K';
		          return '$' + value.toFixed(0);
		        }
		      }
    		};

				if (type == 'Line')
					return (<div className="chart"><ChartistGraph data={chartData} type={type} options={lineDefaultOptions} ref="chart" /> <Tooltip ref="tooltip" /></div>);
		    else if (type == 'Pie')
		    	return <ChartistGraph data={chartData} type={type} options={ { chartPadding: 20, labelOffset: 40 } } ref="chart"/>;
		    else
		    	return <ChartistGraph data={chartData} type={type} ref="chart" />;
	}
});

var Tooltip = React.createClass({
  getInitialState: function () {
    return { tooltipActive: false };
  },
  setMessage: function (msg) {
  	this.props.message = msg;
  },
  render: function () {
    return (
      <div className="chart-tooltip" style={
      	{
      		//top: (Number(this.props.y) + 30) + 'px',
      		//left: this.props.x - 40 + 'px',
      		//display: (!this.state.tooltipActive) ? 'none' : 'block',
      		opacity: (!this.state.tooltipActive) ? '0' : '0.8'
      	}
      }>
        {this.props.message}
      </div>
    );
  },
  toggle: function (active) {
    this.setState({
      tooltipActive: active
    });
  }
});

module.exports = Graph;

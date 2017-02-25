import Chart from './Chart';
import regression from 'regression';

// generate a range of [start, end)
function range(start, end) {
  return [...Array(end-start).keys()].map(i => i + start);
}

// convert equation to javascript code
function eqToJs(eq) {
  return eq.reduce((acc, coef, idx) => {
    var coef = coef*10 >= 1 ? coef.toFixed(2) : coef.toExponential(2),
        term = '';
    if (idx == 1) {
      term = '*x';
    } else if (idx > 1) {
      term = `*Math.pow(x, ${idx})`;
    }
    return coef == 0 ? acc : `${acc ? `${acc} + ` : ''}${coef}${term}`;
  }, '');
}

function eqToHtml(eq) {
  return eq.reduce((acc, coef, idx) => {
    var coef = coef*10 >= 1 ? coef.toFixed(2) : coef.toExponential(2),
        term = '';
    if (idx == 1) {
      term = 'x';
    } else if (idx > 1) {
      term = `x<sup>${idx}</sup>`;
    }
    return coef == 0 ? acc : `${acc ? `${acc} + ` : ''}${coef}${term}`;
  }, '');
}

class App {
  constructor(id) {
    this.points = [];
    this.degree = 4;
    this.chart = new Chart(id);

    window.addEventListener('resize', () => {
      this.chart.canvas.width = document.body.clientWidth;
      this.chart.canvas.height = document.body.clientHeight;
      this.render();
    }, false);
  }

  get scale() {
    return this.chart.scale;
  }

  fit() {
    if (this.points.length <= 1) return;

    var result = regression('polynomial',
      this.points.map(pt => this.chart.canvasToChart(pt)),
      this.degree);

    return {
      html: eqToHtml(result.equation),
      code: eqToJs(result.equation),
      func: function(x) {
        return result.equation.reduce((acc, coef, idx) => {
          return acc + coef * Math.pow(x, idx);
        }, 0);
      }
    };
  }

  render() {
    this.chart.render();

    this.points.map(pt => {
      this.chart.draw(pt, 'red');
    });

    var fitted = this.fit();
    if (fitted) {
      var curve = range(-this.chart.mid.x, this.chart.mid.x).map(x => [x, fitted.func(x)]);
      curve.map(pt => {
        pt = this.chart.chartToCanvas(pt);
        this.chart.draw(pt, 'blue');
      });

      document.getElementById('equation').innerHTML = fitted.html;
      document.getElementById('code').innerHTML = fitted.code;
    }
  }

  reset() {
    this.points = [];
  }
}

export default App;

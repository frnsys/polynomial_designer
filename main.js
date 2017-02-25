import './css/main.sass';
import App from './app/App';

var app = new App('chart');
var mouseDown = false;

// extract position from mouse event
function pt(e) {
  return {
    x: e.clientX - app.chart.canvas.offsetLeft,
    y: e.clientY - app.chart.canvas.offsetTop
  };
}

app.chart.canvas.addEventListener('mousemove', e => {
  if (mouseDown) {
    app.points.push(pt(e));
    app.render();
  }
});
app.chart.canvas.addEventListener('mousedown', e => {
  app.points.push(pt(e));
  app.render();
  mouseDown = true;
});
app.chart.canvas.addEventListener('mouseup', e => {
  mouseDown = false;
});

document.getElementById('reset').addEventListener('click', () => {
  app.reset();
  app.render();
});
document.getElementById('degree').addEventListener('change', ev => {
  app.degree = ev.target.valueAsNumber;
  app.render();
});
document.getElementById('x_scale').addEventListener('change', ev => {
  app.scale.x = ev.target.valueAsNumber;
  app.render();
});
document.getElementById('y_scale').addEventListener('change', ev => {
  app.scale.y = ev.target.valueAsNumber;
  app.render();
});

app.render();

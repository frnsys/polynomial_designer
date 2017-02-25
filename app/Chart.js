const stepSize = 50;
const tickSize = 10;

class Chart {
  constructor(id) {
    this.canvas = document.getElementById(id);
    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight;

    this.ctx = this.canvas.getContext('2d');

    // pixels-to-1
    // e.g. if x scale is 20, 20 pixels equals 1
    this.scale = {
      x: 1,
      y: 1
    };
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  get mid() {
    return {
      x: this.canvas.width/2,
      y: this.canvas.height/2
    };
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawAxes();
    this.drawTicks();
  }

  draw(pt, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(pt.x, pt.y, 2, 2);
  }

  drawAxes() {
    var mid = this.mid;
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#222222';
    this.ctx.moveTo(0, mid.y);
    this.ctx.lineTo(this.width, mid.y);
    this.ctx.moveTo(mid.x, 0);
    this.ctx.lineTo(mid.x, this.height);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  drawTicks() {
    var mid = this.mid;
    this.ctx.font = '14px sans-serif';
    this.ctx.fillStyle = 'gray';

    var y = mid.y - stepSize;
    while (y > 0) {
      this.drawYTick(y);
      y -= stepSize;
    }
    var y = mid.y + stepSize;
    while (y < this.height) {
      this.drawYTick(y);
      y += stepSize;
    }

    var x = mid.x - stepSize;
    while (x > 0) {
      this.drawXTick(x);
      x -= stepSize;
    }
    var x = mid.x + stepSize;
    while (x < this.width) {
      this.drawXTick(x);
      x += stepSize;
    }
  }

  drawTick(from, to, labelPos, val) {
    this.ctx.beginPath();
    this.ctx.moveTo(from[0], from[1]);
    this.ctx.lineTo(to[0], to[1]);
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.fillText(val, labelPos[0], labelPos[1]);
  }

  drawYTick(y) {
    this.drawTick(
        [this.mid.x - tickSize/2, y],
        [this.mid.x + tickSize/2, y],
        [this.mid.x + tickSize,   y + tickSize],
        (-y + this.mid.y)/this.scale.y
      );
  }

  drawXTick(x) {
    this.drawTick(
        [x, this.mid.y - tickSize/2],
        [x, this.mid.y + tickSize/2],
        [x, this.mid.y + tickSize*2],
        (x - this.mid.x)/this.scale.x
      );
  }

  chartToCanvas(pt) {
    return {
      x: (pt[0]*this.scale.x) + this.mid.x,
      y: -((pt[1]*this.scale.y) - this.mid.y)
    };
  }

  canvasToChart(pt) {
    return [
      (pt.x - this.mid.x)/this.scale.x,
      (-pt.y + this.mid.y)/this.scale.y
    ];
  }
}

export default Chart;

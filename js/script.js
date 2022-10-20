document.querySelector('body').innerHTML = "<div class='content'><div class='menu'></div><div class='info'></div><canvas id='puzzle'></canvas><div class='settings'></div></div>";
document.querySelector('.menu').innerHTML = "<button class='start'>START</button><button class='stop'>STOP</button><button class='save'>SAVE</button><button class='results'>RESULTS</button>";
document.querySelector('.info').innerHTML = "<div class='OutMoves'>Moves:</div><div class='OutTime'>TIME:</div>";
document.querySelector('.settings').innerHTML = "<button class='size' value = '3'>3X3</button><button class='size' value = '4'>4X4</button><button class='size' value = '5'>5X5</button><button class='size' value = '6'>6X6</button><button class='size' value = '7'>7X7</button><button class='size' value = '8'>8X8</button>";





let game = {
  ctx: undefined,
  audio: {},
  sprites: {},
  fild:{
    width: 300,
    height: 300,
    size : 4,
    winResult: [],
    cellSize: undefined,
    scheme: [],
  },
  init: function() {
    let cvs = document.getElementById('puzzle');
    cvs.width = this.fild.width;
    cvs.height = this.fild.height;
    this.ctx = cvs.getContext('2d');
    this.fild.cellSize = cvs.width / this.fild.size;
    this.winResult = this.initWinResult();
    this.initScheme();
    this.render();
    cvs.addEventListener('click', e=>game.move(e));
  },
  initWinResult: function() {
    let count = 0;
    for (let col = 0; col < this.fild.size; col ++) {
      for (let row = 0; row < this.fild.size; row ++) {
        count++;
        this.fild.winResult.push(count);
      }
    }
    this.fild.winResult[this.fild.winResult.length-1] = 0;
  },
  initScheme: function() {
    this.fild.scheme = [];
    let existedNumbers = [];
    for (let i = 0; i < this.fild.size; i++) {
      let row = [];
      while (row.length < this.fild.size) {
        let num = Math.floor(Math.random() * this.fild.size * this.fild.size);
        if (!existedNumbers.includes(num)) {
          existedNumbers.push(num);
          row.push(num);
        }
      }
      this.fild.scheme.push(row);
    }
  },
  render: function() {
    game.ctx.clearRect(0, 0, game.fild.width, game.fild.height);

    for (let col = 0; col < game.fild.size; col ++) {
      for (let row = 0; row < game.fild.size; row ++) {
        let dx = col * game.fild.cellSize;
        let dy = row * game.fild.cellSize;

        game.ctx.beginPath();
        game.ctx.fillStyle = 'white';
        game.ctx.rect(dx, dy, game.fild.cellSize, game.fild.cellSize);
        game.ctx.fill();
        game.ctx.strokeStyle = 'black';
        game.ctx.stroke();

        game.ctx.font = `${game.fild.cellSize*0.7}px monospace`;
        game.ctx.fillStyle = 'black';
        game.ctx.textAlign = 'left';
        game.ctx.textBaseline = 'top';

        let txt = game.fild.scheme[col][row];
        let txtLength = game.ctx.measureText(txt);
        let offsetx = game.fild.cellSize-txtLength.width;
        let offsety = game.fild.cellSize-game.fild.cellSize*0.7;

        if (txt != 0) {
          game.ctx.fillText(txt, dx + offsetx / 2, dy + offsety / 2);
        }
      }
    }
 
    requestAnimationFrame(game.render);
  },
  changeFildSize: function () {
    game.fild.size = this.value;
    game.init();
  },
  move: function(e) {
    let x = e.offsetX;
    let y = e.offsetY;
    let currentCellRow = undefined;
    let currentCellCol = undefined;
     for (i = 0 ; i < game.fild.size; i++) {
      for( j = 0; j < game.fild.cellSize; j++) {
        if (x == Math.round(i*game.fild.cellSize + j)) {
          currentCellCol = i;
        }
        if (y == Math.round(i*game.fild.cellSize + j)) {
          currentCellRow = i;
        }
      }
    } 

    console.log(currentCellRow);
    console.log(currentCellCol);
    
  }



}
game.init();


const sizeBtns = document.querySelectorAll('.size');
for (let i = 0; i < sizeBtns.length; i++) {
  sizeBtns[i].addEventListener('click', game.changeFildSize);
}
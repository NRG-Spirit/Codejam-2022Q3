document.querySelector('body').innerHTML = "<div class='content'><div class='menu'></div><div class='info'></div><canvas id='puzzle'></canvas><div class='settings'></div></div>";
document.querySelector('.menu').innerHTML = "<button class='start'>START</button><button class='stop'>STOP</button><button class='save'>SAVE</button><button class='results'>RESULTS</button>";
document.querySelector('.info').innerHTML = "<div class='OutMoves'>Moves:</div><div class='OutTime'>TIME:</div>";
document.querySelector('.settings').innerHTML = "<button class='3x3'>3X3</button><button class='4x4'>4X4</button><button class='5x5'>5X5</button><button class='6x6'>6X6</button><button class='7x7'>7X7</button><button class='8x8'>8X8</button>";

let game = {
  ctx: undefined,
  audio: {},
  sprites: {},
  fild:{
    size : 4,
    winResult: [],
  },
  cell: {
    width: undefined,
  },
  init: function() {
    let cvs = document.getElementById('puzzle');
    this.ctx = cvs.getContext('2d');
    this.cell.width = cvs.width / this.fild.size;
    this.winResult = this.initWinResult();
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
  }




}
game.initWinResult()
console.log(game.fild.winResult);
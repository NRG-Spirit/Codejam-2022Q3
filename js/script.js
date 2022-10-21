document.querySelector('body').innerHTML = "<div class='content'><div class='menu'></div><div class='info'></div><canvas id='puzzle'></canvas><div class='settings'></div></div>";
document.querySelector('.menu').innerHTML = "<button class='shuffle'>SHUFFLE</button><button class='stop'>STOP</button><button class='save'>SAVE</button><button class='load'>LOAD</button><button class='results'>RESULTS</button>";
document.querySelector('.info').innerHTML = "<div class='OutMoves'>Mooves: 0</div><div class='sound'></div><div class='OutTime'>Time: 00:00</div>";
document.querySelector('.settings').innerHTML = "<button class='size' value = '3'>3X3</button><button class='size' value = '4'>4X4</button><button class='size' value = '5'>5X5</button><button class='size' value = '6'>6X6</button><button class='size' value = '7'>7X7</button><button class='size' value = '8'>8X8</button>";
document.querySelector('.sound').innerHTML = "<img src='./assets/img/sound-off.png'>" 




let game = {
  ctx: undefined,
  audio: {
    move: new Audio('./assets/audio/move.mp3'),
  },
  sprites: {},
  sound: false,
  fild:{
    width: 300,
    height: 300,
    size : 4,
    winResult: [],
    scheme: [],
  },
  cell: {
    size: undefined,
    current: {
      col: undefined,
      row: undefined,
    }
  },
  moves: 0,
  time: {
    s:0,
    m:0,
    time: '00:00',
    stop: true,
    start: function() {
      game.time.stop = false;
      let fuck = setInterval(tick, 1000);
      function tick () {
        if (game.time.stop) {
          clearInterval(fuck);
        }
        game.time.s++;
        if (game.time.s==60) {
          game.time.m++;
          game.time.s = 0;
        }
        let out = '';
        game.time.time =' ';
        game.time.m.toString().length < 2 ?  out = '0' + game.time.m : out = game.time.m;
        game.time.time += out;
        game.time.s.toString().length < 2 ?  out = '0' + game.time.s : out = game.time.s;
        game.time.time += ':'+out;
        document.querySelector('.OutTime').innerHTML = 'Time: ' + game.time.time; 
      }
    },
    pause: function() {
      game.time.stop = true;
    },
    clear: function() {
      game.time.m = 0;
      game.time.s = 0;
      game.time.time = '00:00';
      game.time.stop = true;
    }
  },
  save: {
    data: {
      size: 0,
      winResult: [],
      scheme: [],
      time: {
        m: 0,
        s:0,
      },
      moves: 0,
    },
    add: function() {
      console.log('save');
      game.save.data.size = game.fild.size;
      game.save.data.winResult = game.fild.winResult;
      game.save.data.scheme = game.fild.scheme;
      game.save.data.time.s = game.time.s;
      game.save.data.time.m = game.time.m;
      game.save.data.moves = game.moves;
      localStorage.clear('save');
      let obj = JSON.stringify(game.save.data);
      localStorage.setItem('save', obj)
    },
    load: function() {
      let obj = JSON.parse(localStorage.getItem('save'));
      if (obj) {
        game.fild.size = obj.size;
        game.fild.winResult = obj.winResult;
        game.fild.scheme = obj.scheme;
        game.time.s = obj.time.s;
        game.time.m = obj.time.m;
        game.moves = obj.moves;
        game.cell.size = document.getElementById('puzzle').width / game.fild.size;
        /* game.render(); */
        let out = '';
        game.time.time =' ';
        game.time.m.toString().length < 2 ?  out = '0' + game.time.m : out = game.time.m;
        game.time.time += out;
        game.time.s.toString().length < 2 ?  out = '0' + game.time.s : out = game.time.s;
        game.time.time += ':'+out;
        document.querySelector('.OutTime').innerHTML = 'Time: ' + game.time.time;
        document.querySelector('.OutMoves').innerHTML = 'Moves: ' + game.moves; 
      } else {
        alert('У вас нет сохраненных игр.')
      }
    },
  },
  init: function() {
    let cvs = document.getElementById('puzzle');
    cvs.width = this.fild.width;
    cvs.height = this.fild.height;
    this.ctx = cvs.getContext('2d');
    this.cell.size = cvs.width / this.fild.size;
    this.initWinResult();
    this.initScheme();
    this.render();
    cvs.addEventListener('click', e=>game.move(e));
  },
  initWinResult: function() {
    this.fild.winResult = [];
    let count = 0;
    for (let row = 0; row < this.fild.size; row ++) {
      let rowResult = [];
      for (let col = 0; col < this.fild.size; col ++) {
        count++;
        rowResult.push(count);
      }
      this.fild.winResult.push(rowResult);
    }
    this.fild.winResult[this.fild.winResult.length-1][this.fild.winResult.length-1] = 0;
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

    for (let row = 0; row < game.fild.size; row ++) {
      for (let col = 0; col < game.fild.size; col ++) {
        let dx = col * game.cell.size;
        let dy = row * game.cell.size;

        game.ctx.beginPath();
        game.ctx.fillStyle = 'white';
        game.ctx.rect(dx, dy, game.cell.size, game.cell.size);
        game.ctx.fill();
        game.ctx.strokeStyle = 'black';
        game.ctx.stroke();

        game.ctx.font = `${game.cell.size*0.7}px monospace`;
        game.ctx.fillStyle = 'black';
        game.ctx.textAlign = 'left';
        game.ctx.textBaseline = 'top';

        let txt = game.fild.scheme[row][col];
        let txtLength = game.ctx.measureText(txt);
        let offsetx = game.cell.size-txtLength.width;
        let offsety = game.cell.size-game.cell.size*0.7;

        if (txt != 0) {
          game.ctx.fillText(txt, dx + offsetx / 2, dy + offsety / 2);
        }
      }
    }
 
    requestAnimationFrame(game.render);
  },
  changeFildSize: function () {
    game.fild.size = this.value;
    game.time.clear();
    game.moves = 0;
    game.init();
    document.querySelector('.OutMoves').innerHTML = 'Moves: ' + game.moves;
    document.querySelector('.OutTime').innerHTML = 'Time: ' + game.time.time; 
  },
  move: function(e) {
    let x = e.offsetX;
    let y = e.offsetY;
     for (i = 0 ; i < game.fild.size; i++) {
      for( j = 0; j < game.cell.size; j++) {
        if (x == Math.round(i*game.cell.size + j)) {
          game.cell.current.col = i;
        }
        if (y == Math.round(i*game.cell.size + j)) {
          game.cell.current.row = i;
        }
      }
    } 

    if (game.cell.current.col > 0) {
      if (game.fild.scheme[game.cell.current.row][game.cell.current.col-1]==0) {
        game.fild.scheme[game.cell.current.row][game.cell.current.col-1] = game.fild.scheme[game.cell.current.row][game.cell.current.col];
        game.fild.scheme[game.cell.current.row][game.cell.current.col] = 0;
        if (game.sound) {
        game.audio.move.play();
        }
        if (game.time.stop == true) {
          game.time.start();
        }
        game.moves++;
      }
    }
    if (game.cell.current.col < game.fild.size-1) {
      if (game.fild.scheme[game.cell.current.row][game.cell.current.col+1]==0) {
        game.fild.scheme[game.cell.current.row][game.cell.current.col+1] = game.fild.scheme[game.cell.current.row][game.cell.current.col];
        game.fild.scheme[game.cell.current.row][game.cell.current.col] = 0;
        if (game.sound) {
          game.audio.move.play();
        }
        if (game.time.stop == true) {
          game.time.start();
        }
        game.moves++;
      }
    }
    if (game.cell.current.row > 0) {
      if (game.fild.scheme[game.cell.current.row-1][game.cell.current.col]==0) {
        game.fild.scheme[game.cell.current.row-1][game.cell.current.col] = game.fild.scheme[game.cell.current.row][game.cell.current.col];
        game.fild.scheme[game.cell.current.row][game.cell.current.col] = 0;
        if (game.sound) {
          game.audio.move.play();
        }
        if (game.time.stop == true) {
          game.time.start();
        }
        game.moves++;
      }
    }
    if (game.cell.current.row < game.fild.size-1) {
      if (game.fild.scheme[game.cell.current.row+1][game.cell.current.col]==0) {
        game.fild.scheme[game.cell.current.row+1][game.cell.current.col] = game.fild.scheme[game.cell.current.row][game.cell.current.col];
        game.fild.scheme[game.cell.current.row][game.cell.current.col] = 0;
        if (game.sound) {
          game.audio.move.play();
        }
        if (game.time.stop == true) {
          game.time.start();
        }
        game.moves++;
      }
    }
    game.cell.current.row = undefined;
    game.cell.current.col = undefined;

    document.querySelector('.OutMoves').innerHTML = 'Moves: ' + game.moves;

    if (game.over()) {
      alert('Hooray! You solved the' + game.fild.size + 'X' + game.fild.size + ' puzzle in ' + game.time.time + ' and ' + game.moves + ' moves!' );
      this.shuffle();
    }
  },
  over: function() {
    for (let row = 0; row < this.fild.size; row ++) {
      for (let col = 0; col < this.fild.size; col ++) {
        if (game.fild.winResult[row][col] != game.fild.scheme[row][col]) {
          return false;
        }
      }
    }
    return true;
  },  
  shuffle: function() {
    game.time.clear();
    game.moves = 0;
    game.init();
    document.querySelector('.OutMoves').innerHTML = 'Moves: ' + game.moves;
    document.querySelector('.OutTime').innerHTML = 'Time: ' + game.time.time; 
  },
  soundSwich: function() {
    if(!game.sound) {
      game.sound = true;
      document.querySelector('.sound').innerHTML = "<img src='./assets/img/sound-on.png'>" 
    } else {
      game.sound = false;
      document.querySelector('.sound').innerHTML = "<img src='./assets/img/sound-off.png'>" 
    }
  },
}
game.init();


const sizeBtns = document.querySelectorAll('.size');
for (let i = 0; i < sizeBtns.length; i++) {
  sizeBtns[i].addEventListener('click', game.changeFildSize);
}
document.querySelector('.stop').addEventListener('click', game.time.pause);
document.querySelector('.shuffle').addEventListener('click', game.shuffle);
document.querySelector('.sound').addEventListener('click', game.soundSwich);
document.querySelector('.save').addEventListener('click', game.save.add);
document.querySelector('.load').addEventListener('click', game.save.load);

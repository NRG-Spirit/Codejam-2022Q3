document.querySelector('body').innerHTML = "<div class='content'><div class='menu'></div><div class='info'></div><canvas id='puzzle'></canvas><div class='settings'></div></div>";
document.querySelector('.menu').innerHTML = "<button class='shuffle'>SHUFFLE</button><button class='stop'>STOP</button><button class='save'>SAVE</button><button class='load'>LOAD</button><button class='results'>RESULTS</button><div class='resultsOut resultsOut-hidden'></div>";
document.querySelector('.info').innerHTML = "<div class='OutMoves'>Mooves: 0</div><div class='sound'></div><div class='OutTime'>Time: 00:00</div>";
document.querySelector('.settings').innerHTML = "<button class='size' value = '3'>3X3</button><button class='size' value = '4'>4X4</button><button class='size' value = '5'>5X5</button><button class='size' value = '6'>6X6</button><button class='size' value = '7'>7X7</button><button class='size' value = '8'>8X8</button>";
document.querySelector('.sound').innerHTML = "<img src='./assets/img/sound-off.png'>"

let screenWidth = document.body.clientWidth;

if ( screenWidth > 1100 ) {
  gameWidth = 1000;
} else if ( screenWidth > 1000 && screenWidth <= 1100 ) {
  gameWidth = 900;
} else if ( screenWidth > 900 && screenWidth <= 1000 ) {
  gameWidth = 800;
} else if ( screenWidth > 800 && screenWidth <= 900 ) {
  gameWidth = 700;
} else if ( screenWidth > 700 && screenWidth <= 800 ) {
  gameWidth = 600;
} else if ( screenWidth > 600 && screenWidth <= 700 ) {
  gameWidth = 500;
} else if ( screenWidth > 500 && screenWidth <=600 ) {
  gameWidth = 400;
} else if ( screenWidth < 500 ) {
  gameWidth = 300;
};




let game = {
  ctx: undefined,
  cvs: document.getElementById('puzzle'),
  audio: {
    move: new Audio('./assets/audio/move.mp3'),
  },
  sprites: {},
  sound: false,
  fild: {
    width: gameWidth,
    height: gameWidth,
    size: 4,
    winResult: [],
    scheme: [],
  },
  cell: {
    size: undefined,
    current: {
      col: undefined,
      row: undefined,
      val: undefined,
    },
    dragAndDrop: false,
  },
  moves: 0,
  cursor: {
    dx: 0,
    dy: 0,
    x: undefined,
    y: undefined,
  },
  time: {
    s: 0,
    m: 0,
    time: '00:00',
    stop: true,
    start: function () {
      game.time.stop = false;
      let fuck = setInterval(tick, 1000);
      function tick() {
        if (game.time.stop) {
          clearInterval(fuck);
        }
        game.time.s++;
        if (game.time.s == 60) {
          game.time.m++;
          game.time.s = 0;
        }
        let out = '';
        game.time.time = ' ';
        game.time.m.toString().length < 2 ? out = '0' + game.time.m : out = game.time.m;
        game.time.time += out;
        game.time.s.toString().length < 2 ? out = '0' + game.time.s : out = game.time.s;
        game.time.time += ':' + out;
        document.querySelector('.OutTime').innerHTML = 'Time: ' + game.time.time;
      }
    },
    pause: function () {
      game.time.stop = true;
    },
    clear: function () {
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
        s: 0,
      },
      moves: 0,
    },
    add: function () {
      console.log('save');
      game.save.data.size = game.fild.size;
      game.save.data.winResult = game.fild.winResult;
      game.save.data.scheme = game.fild.scheme;
      game.save.data.time.s = game.time.s;
      game.save.data.time.m = game.time.m;
      game.save.data.moves = game.moves;
      localStorage.removeItem('save');
      let obj = JSON.stringify(game.save.data);
      localStorage.setItem('save', obj)
    },
    load: function () {
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
        game.time.time = ' ';
        game.time.m.toString().length < 2 ? out = '0' + game.time.m : out = game.time.m;
        game.time.time += out;
        game.time.s.toString().length < 2 ? out = '0' + game.time.s : out = game.time.s;
        game.time.time += ':' + out;
        document.querySelector('.OutTime').innerHTML = 'Time: ' + game.time.time;
        document.querySelector('.OutMoves').innerHTML = 'Moves: ' + game.moves;
      } else {
        alert('У вас нет сохраненных игр.')
      }
    },
  },
  results: {
    data: [[], [], [], [], [], []],
    check: function () {
      if (localStorage.getItem('results')) {
        game.results.data = JSON.parse(localStorage.getItem('results'));
      }
      game.results.data[game.fild.size - 3].push([game.moves, game.time.time]);
      game.results.data[game.fild.size - 3].sort((a, b) => {
        return a[0] - b[0];
      });
      if (game.results.data[game.fild.size - 3].length > 10) {
        game.results.data[game.fild.size - 3].length = 10;
      }
      let obj = JSON.stringify(game.results.data);
      localStorage.removeItem('results');
      localStorage.setItem('results', obj)
    },
    show: function () {
      if (localStorage.getItem('results')) {
        game.results.data = JSON.parse(localStorage.getItem('results'));
      };
      let tbl = 'TOP RESULTS: <br>';
      if (game.results.data[game.fild.size-3].length > 0) {
        for (let i=0; i<game.results.data[game.fild.size-3].length; i++) {
          tbl += i+1 + '.&nbsp &nbsp ' + game.results.data[game.fild.size-3][i][0] + ' moves in ' + game.results.data[game.fild.size-3][i][1] + '<br>';
        }
      } else {
        tbl += "you don't have any records";
      }
      document.querySelector('.resultsOut').innerHTML = "" + tbl + "</div";
      document.querySelector('.resultsOut').classList.remove('resultsOut-hidden');
    },
    hide: function() {
      document.querySelector('.resultsOut').classList.add('resultsOut-hidden');
    }
  },
  init: function () {
    this.cvs.width = this.fild.width;
    this.cvs.height = this.fild.height;
    this.ctx = this.cvs.getContext('2d');
    this.cell.size = this.fild.width / this.fild.size;
    this.initWinResult();
    this.initScheme();
    this.render();
/*      this.cvs.addEventListener('click', game.move);  */
    this.cvs.addEventListener('mousedown', game.drugAndDrop);
  },
  initWinResult: function () {
    this.fild.winResult = [];
    let count = 0;
    for (let row = 0; row < this.fild.size; row++) {
      let rowResult = [];
      for (let col = 0; col < this.fild.size; col++) {
        count++;
        rowResult.push(count);
      }
      this.fild.winResult.push(rowResult);
    }
    this.fild.winResult[this.fild.winResult.length - 1][this.fild.winResult.length - 1] = 0;
  },
  initScheme: function () {
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
  render: function () {
    game.ctx.clearRect(0, 0, game.fild.width, game.fild.height);

    for (let row = 0; row < game.fild.size; row++) {
      for (let col = 0; col < game.fild.size; col++) {
        let dx = col * game.cell.size;
        let dy = row * game.cell.size;
        let txt = game.fild.scheme[row][col];

        game.ctx.beginPath();
        game.ctx.fillStyle = 'white';
        if (txt != 0 && txt != game.cell.current.val) {
          game.ctx.rect(dx, dy, game.cell.size, game.cell.size);
        }
        game.ctx.fill();
        game.ctx.strokeStyle = 'black';
        game.ctx.stroke();

        game.ctx.font = `${game.cell.size * 0.7}px monospace`;
        game.ctx.fillStyle = 'black';
        game.ctx.textAlign = 'left';
        game.ctx.textBaseline = 'top';


        let txtLength = game.ctx.measureText(txt);
        let offsetx = game.cell.size - txtLength.width;
        let offsety = game.cell.size - game.cell.size * 0.7;

        if (txt != 0 && txt != game.cell.current.val) {
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
  move: function (e) {
    let x = e.offsetX;
    let y = e.offsetY;
    for (i = 0; i < game.fild.size; i++) {
      for (j = 0; j < game.cell.size; j++) {
        if (x == Math.round(i * game.cell.size + j)) {
          game.cell.current.col = i;
        }
        if (y == Math.round(i * game.cell.size + j)) {
          game.cell.current.row = i;
        }
      }
    }

    if (game.cell.current.col > 0) {
      if (game.fild.scheme[game.cell.current.row][game.cell.current.col - 1] == 0) {
        game.fild.scheme[game.cell.current.row][game.cell.current.col - 1] = game.fild.scheme[game.cell.current.row][game.cell.current.col];
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
    if (game.cell.current.col < game.fild.size - 1) {
      if (game.fild.scheme[game.cell.current.row][game.cell.current.col + 1] == 0) {
        game.fild.scheme[game.cell.current.row][game.cell.current.col + 1] = game.fild.scheme[game.cell.current.row][game.cell.current.col];
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
      if (game.fild.scheme[game.cell.current.row - 1][game.cell.current.col] == 0) {
        game.fild.scheme[game.cell.current.row - 1][game.cell.current.col] = game.fild.scheme[game.cell.current.row][game.cell.current.col];
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
    if (game.cell.current.row < game.fild.size - 1) {
      if (game.fild.scheme[game.cell.current.row + 1][game.cell.current.col] == 0) {
        game.fild.scheme[game.cell.current.row + 1][game.cell.current.col] = game.fild.scheme[game.cell.current.row][game.cell.current.col];
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
      this.results.check();
      alert('Hooray! You solved the' + game.fild.size + 'X' + game.fild.size + ' puzzle in ' + game.time.time + ' and ' + game.moves + ' moves!');
      this.shuffle();
    }
  },
  over: function () {
    for (let row = 0; row < this.fild.size; row++) {
      for (let col = 0; col < this.fild.size; col++) {
        if (game.fild.winResult[row][col] != game.fild.scheme[row][col]) {
          return false;
        }
      }
    }
    return true;
  },
  shuffle: function () {
    game.time.clear();
    game.moves = 0;
    game.init();
    document.querySelector('.OutMoves').innerHTML = 'Moves: ' + game.moves;
    document.querySelector('.OutTime').innerHTML = 'Time: ' + game.time.time;
  },
  soundSwich: function () {
    if (!game.sound) {
      game.sound = true;
      document.querySelector('.sound').innerHTML = "<img src='./assets/img/sound-on.png'>"
    } else {
      game.sound = false;
      document.querySelector('.sound').innerHTML = "<img src='./assets/img/sound-off.png'>"
    }
  },
  drugAndDrop: function (e) {
    let x = e.offsetX;
    let y = e.offsetY;
    for (i = 0; i < game.fild.size; i++) {
      for (j = 0; j < game.cell.size; j++) {
        if (x == Math.round(i * game.cell.size + j)) {
          game.cell.current.col = i;
        }
        if (y == Math.round(i * game.cell.size + j)) {
          game.cell.current.row = i;
        }
      }
    }

    if (game.cell.current.col > 0 && game.fild.scheme[game.cell.current.row][game.cell.current.col - 1] == 0) {
      game.cell.current.val = game.fild.scheme[game.cell.current.row][game.cell.current.col];
    }
    if (game.cell.current.col < game.fild.size - 1 && game.fild.scheme[game.cell.current.row][game.cell.current.col + 1] == 0) {
      game.cell.current.val = game.fild.scheme[game.cell.current.row][game.cell.current.col];
    }
    if (game.cell.current.row > 0 && game.fild.scheme[game.cell.current.row - 1][game.cell.current.col] == 0) {
      game.cell.current.val = game.fild.scheme[game.cell.current.row][game.cell.current.col];
    }
    if (game.cell.current.row < game.fild.size - 1 && game.fild.scheme[game.cell.current.row + 1][game.cell.current.col] == 0) {
      game.cell.current.val = game.fild.scheme[game.cell.current.row][game.cell.current.col];
    }

    if (game.cell.current.val) {
      game.cell.dragAndDrop = false;
      game.drug();
      window.addEventListener('mousemove', game.drugMove);
      game.cvs.addEventListener('mouseup', game.drop);
    }


  },
  drug: function() {
    if (game.cell.dragAndDrop != true) {
      let cursorDX = game.cursor.dx;
      let cursorDY = game.cursor.dy;
      console.log('dx' + cursorDX);
      let dx = game.cell.current.col * game.cell.size + cursorDX;
      let dy = game.cell.current.row * game.cell.size + cursorDY;
      let txt = game.cell.current.val;

      game.ctx.beginPath();
      game.ctx.fillStyle = 'greenyellow'; 
      game.ctx.rect(dx, dy, game.cell.size, game.cell.size);
      game.ctx.fill();
      game.ctx.strokeStyle = 'black';
      game.ctx.stroke();

      game.ctx.font = `${game.cell.size * 0.7}px monospace`;
      game.ctx.fillStyle = 'black'; 
      game.ctx.textAlign = 'left';
      game.ctx.textBaseline = 'top';
      let txtLength = game.ctx.measureText(txt);
      let offsetx = game.cell.size - txtLength.width;
      let offsety = game.cell.size - game.cell.size * 0.7;
      game.ctx.fillText(txt, dx + offsetx / 2, dy + offsety / 2);
      requestAnimationFrame(game.drug);
    } else {
      cancelAnimationFrame(game.drug);
    }
  },
  drugMove: function(e) {
    if (game.cell.dragAndDrop != true) {
    if (!game.cursor.x) {
      game.cursor.x = e.pageX;
    } 
    if (!game.cursor.y) {
      game.cursor.y = e.pageY;
    }
    game.cursor.dx = e.pageX - game.cursor.x;
    game.cursor.dy = e.pageY - game.cursor.y;
  }
  },
  drop: function(e) {
    window.removeEventListener('mousemove', game.drugMove);
    console.log(game.cell.current.row)
    console.log(game.fild.scheme[game.cell.current.row][game.cell.current.col]);
    if (game.cell.current.col>0) {
      if (game.fild.scheme[game.cell.current.row][game.cell.current.col-1] == 0 && game.cursor.dx > -game.cell.size*1.3 && game.cursor.dx < -game.cell.size*0.3 && game.cursor.dy < game.cell.size && game.cursor.dy > -game.cell.size) {
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
    if (game.cell.current.col<game.fild.size) {
      if (game.fild.scheme[game.cell.current.row][game.cell.current.col+1] == 0 && game.cursor.dx < game.cell.size*1.3 && game.cursor.dx > game.cell.size*0.3 && game.cursor.dy < game.cell.size && game.cursor.dy > -game.cell.size) {
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
    if (game.cell.current.row>0) {
      if (game.fild.scheme[game.cell.current.row-1][game.cell.current.col] == 0 && game.cursor.dy > -game.cell.size*1.3 && game.cursor.dy < -game.cell.size*0.3 && game.cursor.dx < game.cell.size && game.cursor.dx > -game.cell.size) {
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

    if (game.fild.scheme[game.cell.current.row+1]) {
      if (game.fild.scheme[game.cell.current.row+1][game.cell.current.col] == 0 && game.cursor.dy < game.cell.size*1.3 && game.cursor.dy > game.cell.size*0.3 && game.cursor.dx < game.cell.size && game.cursor.dx > -game.cell.size) {
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

    if (game.over()) {
      game.results.check();
      alert('Hooray! You solved the' + game.fild.size + 'X' + game.fild.size + ' puzzle in ' + game.time.time + ' and ' + game.moves + ' moves!');
      game.shuffle();
    }




    if (game.cursor.dx >= -game.cell.size * 0.3 && game.cursor.dx <= game.cell.size * 0.3 && game.cursor.dy >= -game.cell.size * 0.3 && game.cursor.dy <= game.cell.size * 0.3) {
    game.move(e);
    }
    
    game.cell.dragAndDrop = true;
    game.cursor.x = undefined;
    game.cursor.y = undefined;
    game.cursor.dx = 0;
    game.cursor.dy = 0;
    game.cell.current.col = undefined;
    game.cell.current.row = undefined;
    game.cell.current.val = undefined;
  }
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
document.querySelector('.results').addEventListener('mousedown', game.results.show);
document.querySelector('.results').addEventListener('mouseup', game.results.hide);




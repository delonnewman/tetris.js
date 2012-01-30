/*
 * tetris.js
 *
 */

var tetris = { VERSION : '0.0.0' };

tetris.model = function(){
    var EMPTY  = 0;
    var WIDTH  = 500;
    var HEIGHT = 500;

	var TYPES = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

	var MATRICES = {
		'I' : [[0,0,0,0],
			   [1,1,1,1],
               [0,0,0,0],
               [0,0,0,0]],
    
		'J' : [[0,0,0,0],
               [2,2,2,0],
               [0,0,2,0],
               [0,0,0,0]],
             
		'L' : [[0,0,0,0],
               [3,3,3,0],
               [3,0,0,0],
               [0,0,0,0]],

		'O' : [[0,0,0,0],
               [0,4,4,0],
               [0,4,4,0],
               [0,0,0,0]],

		'S' : [[0,0,0,0],
               [0,5,5,0],
               [5,5,0,0],
               [0,0,0,0]],

		'T' : [[0,0,0,0],
               [0,6,6,6],
               [0,0,6,0],
               [0,0,0,0]],

		'Z' : [[0,0,0,0],
               [7,7,0,0],
               [0,7,7,0],
			   [0,0,0,0]]
	};

    function Tetrimino(type, position) {
		this.type     = type;
        this.matrix   = MATRICES[type];
        this.position = position;
        this.paused   = false;

        this.pause = function() {
            if ( this.paused && this.rate ) this.drop(this.rate);
            this.paused = !this.paused;
        };

        this.isPaused = function() {
            return this.paused;
        };

        this.getMatrix = function() {
            return this.matrix;
        };

        this.drop = function(rate) {
            this.rate = rate;

            var that = this;
            setTimeout(function(){
                if ( !that.isPaused() && that.position[1] < HEIGHT ) {
                    that.position[1]++;
                    that.drop(rate);
                }
            }, rate);
        }

        this.getPosition = function() {
            return this.position;
        }

		this.setPosition = function(val) {
			this.position = val;
		}

        this.move = function(direction, degree, test) {
            var p = this.position[direction];

            if ( test(p) ) {
                this.position[direction] = p + degree;
                return true;
            }
            return false;
        }

        this.width = function() {

        };

        this.moveRight = function() {
            console.log("move right");
            return this.move(0, 5, function(p){ return p < (WIDTH - 1) });
        }

        this.moveLeft = function() {
            console.log("move left");
            return this.move(0, -5, function(p){ return p > 0 });
        }

        this.moveDown = function() {
            console.log("move down");
            return this.move(1, 5, function(p){ return p > 0 });
        }

        this.rotate = function() {
            console.log("rotate");
            var i = 0;
            var t = [];
            for ( ; i < this.matrix.length; i++ ) {
                var j = 0;
                for ( ; j < this.matrix[0].length; j++ ) {
                    t[j] = t[j] || [];
                    t[j][this.matrix[0].length - 1 - i] = this.matrix[i][j];
                }
            }
            this.matrix = t;
        }

        this.display = function() {
            var i = 0;
            for ( ; i < this.matrix.length; i++ ) {
                console.log(this.matrix[i]);
            }
        }
    }

	/*
	 *	A running queue of tetriminos of random 'type'
	 *
	 */
	function Queue(size) {
		this.size = size || 10;
		this.list = [];

		this.queue = function() {
			var n = Math.floor(Math.random() * TYPES.length);
			this.list.push(new Tetrimino(TYPES[n]));
		};

		// fill initial queue
		var i = 0;
		for ( ; i < this.size; i++ ) this.queue();
		
		this.dequeue = function() {
			this.queue(); // keep queue filled with 'size' (10 by default)
			return this.list.shift();
		};
	}

	/*
	 *	The Grid
	 */
	function Grid(width, height, squareSize) {
		this.squareSize = squareSize || 30;
		this.width      = this.squareSize * width;
		this.height     = this.squareSize * height;
	}

    return {
        Tetrimino:Tetrimino,
		Grid:Grid,
		Queue:Queue,
    }
}();

tetris.view = function ( $ ) {
    var SQUARE_PX = 30;
    var COLORS    = {
        'I' : "#ff0000",
        'J' : "#00ff00",
        'L' : "#0000ff",
        'O' : "#ffff00",
        'S' : "#ff00ff",
        'T' : "#ffffff",
        'Z' : "#00ffff"
    };

    // drop rates for each level
    var RATES = {
        1 : 30,
        2 : 20,
        3 : 10,
        4 : 0.8,
        5 : 0.6,
        6 : 0.4,
        7 : 0.2
    };

    function Game(canvas, context, level) {
        this.canvas  = canvas;
        this.context = context;
        this.level   = level || 1;
		this.refresh = 33;

		this.grid          = new tetris.model.Grid(20, 20);
		this.canvas.width  = this.grid.width;
		this.canvas.height = this.grid.height;

		this.queue = new tetris.model.Queue();
		this.currentTetrimino = this.queue.dequeue();
		this.currentTetrimino.setPosition([canvas.width / 2, 0]);

        this.renderSquare = function(x, y, color) {
            color = color || "#ff0000";

            var fill = this.context.fillStyle;
            this.context.fillStyle = color;
            this.context.fillRect(x, y, SQUARE_PX, SQUARE_PX);
            this.context.fillStyle = fill;
        }

        this.renderTetrimino = function(t) {
            var pos = t.getPosition();
            var matrix = t.getMatrix();
            var i = 0;
            var vertical = pos[1];
            for ( ; i < matrix.length; i++ ) {
                var j = 0;
                var horizontal = pos[0];
                var y = i > 0 ? vertical += (SQUARE_PX + 2) : vertical;
                for ( ; j < matrix[i].length; j++ ) {
                    var x = j > 0 ? horizontal += (SQUARE_PX + 2) : horizontal;
                    if ( matrix[i][j] != 0 ) {
                        this.renderSquare(x, y, COLORS[t.type]);
                    }
                }
            }
        };

        this.render = function() {
            this.context.fillStyle = "#000000";
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.renderTetrimino(this.currentTetrimino);
        };

        this.start = function() {
            var canvas  = this.canvas;
            var context = this.context;

            var that = this;
            setInterval(function(){ that.render() }, this.refresh);
            this.currentTetrimino.drop(RATES[this.level]);
        };

        this.pause = function() { this.currentTetrimino.pause() };

        this.quit = function() { };
    }

	return { Game:Game };
}();

tetris.controller = function( $ ){

    $.fn.renderGame = function(opts) {
        if ( !this[0] ) {
            throw("could not find canvas");
        }

        opts = opts || {};
        var level = opts.level;

        var canvas  = this[0];
        var context = canvas.getContext("2d");
        var game    = new tetris.view.Game(canvas, context, level);
        game.render();

        $('*').keydown(function(e){
            switch(e.keyCode) {
                case 37: // left arrow
                    game.currentTetrimino.moveLeft();
                    break;
                case 39: // right arrow
                    game.currentTetrimino.moveRight();
                    break;
                case 38: // up arrrow
                    game.currentTetrimino.rotate();
                    break;
                case 40: // down arrrow
                    game.currentTetrimino.moveDown();
                    break;
                case 83: // 's' key
                    game.start();
                    break;
                case 32: // space key
                    game.pause();
                    break;
                default:
                    console.log(e.keyCode);
            }
        });

        $("#startButton").click(function(){ game.start() });
        $("#pauseButton").click(function(){ game.pause() });
        $("#quitButton").click(function(){ game.quit() });
    };

}( jQuery );

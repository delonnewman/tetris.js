/*
 * tetris.js
 */

var tetris = { VERSION : '0.0.0' };


tetris.model = function(){
    var EMPTY  = 0;
	var WIDTH  = 10;
	var HEIGHT = 20;

	// drop rates for each level
	var RATES = {
		1 : 0.5,
		2 : 0.75,
		3 : 1,
		4 : 1.25,
		5 : 1.5,
		6 : 1.75,
		7 : 2
	};

    // tetriminos
    var I = [[0,0,0,0],
             [1,1,1,1],
             [0,0,0,0],
             [0,0,0,0]];
    
    var J = [[0,0,0,0],
             [2,2,2,0],
             [0,0,2,0],
             [0,0,0,0]];
             
    var L = [[0,0,0,0],
             [3,3,3,0],
             [3,0,0,0],
             [0,0,0,0]];

    var O = [[0,0,0,0],
             [0,4,4,0],
             [0,4,4,0],
             [0,0,0,0]];

    var S = [[0,0,0,0],
             [0,5,5,0],
             [5,5,0,0],
             [0,0,0,0]];

    var T = [[0,0,0,0],
             [0,6,6,6],
             [0,0,6,0],
             [0,0,0,0]];

    var Z = [[0,0,0,0],
             [7,7,0,0],
             [0,7,7,0],
             [0,0,0,0]];

    function Tetrimino(tetrimino, position) {
		this.matrix = tetrimino;

		this.getMatrix = function() {
			return this.matrix;
		};

        this.drop = function(rate) {
            var that = this;
            setTimeout(function(){
	            if ( position[1] > 0 ) {
	                console.log(position);
	                position[1]--;
                    that.drop();
	            }
            }, rate);
        }

        this.getPosition = function() {
            return position;
        }

        function move(direction, degree, test) {
            var p = position[direction];

            if ( test(p) ) {
                position[direction] = p + degree;
                return true;
            }
            return false;
        }

        this.moveRight = function() {
            return move(0, 1, function(p){ return p < (WIDTH - 1) });
        }

        this.moveLeft = function() {
            return move(0, -1, function(p){ return p > 0 });
        }

        this.moveDown = function() {
            return move(1, -1, function(p){ return p > 0 });
        }

        this.rotate = function() {
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

		this.map = function(fn) {
			var i = 0;
			for ( ; this.matrix.length; i++ ) {
				fn.apply(this, this.matrix[i], i);
			}
		};

        return this;
    }

    return {
        Tetrimino:Tetrimino,
		RATES:RATES,
        I:I,
        J:J,
        T:T,
        S:S,
        Z:Z,
        O:O,
        L:L
    }
}();

tetris.view = function ( $ ) {
	var SQUARE_PX = 30;
	var COLORS    = {
		1 : "#ff0000",
	};

	function Game(canvas, context, level) {
		this.canvas  = canvas;
		this.context = context;
		this.level   = level || 1;

		this.currentTetrimino = new tetris.model.Tetrimino(tetris.model.L, [canvas.width / 2, 30]);

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
						this.renderSquare(x, y);
					}
				}
			}
		};

		this.start = function() {
			var canvas  = this.canvas;
			var context = this.context;

			context.fillStyle = "#000000";
			context.fillRect(0, 0, canvas.width, canvas.height);

			this.renderTetrimino(this.currentTetrimino);
		};

		this.pause = function() { };

		this.end = function() { };
	}

	$.fn.renderGame = function(opts) {
		if (!this[0]) {
			throw("could not find canvas");
		}

		opts = opts || {};
		var level = opts.level;

		var canvas  = this[0];
		var context = canvas.getContext("2d");
		var game    = new Game(canvas, context, level);
		game.start();
	};

}( jQuery );

/*
 * tetris.js
 *
 */

var tetris = { VERSION : '0.0.0' };

tetris.model = function(){
    var EMPTY  = 0;
    var WIDTH  = 500;
    var HEIGHT = 500;

    // drop rates for each level
    var RATES = {
        1 : 30,
        2 : 1.75,
        3 : 1.5,
        4 : 1.25,
        5 : 1,
        6 : 0.75,
        7 : 0.5
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
        this.matrix   = tetrimino;
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

        this.currentTetrimino = new tetris.model.Tetrimino(tetris.model.L, [canvas.width / 2, 0]);

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

        this.render = function() {
            this.context.fillStyle = "#000000";
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.renderTetrimino(this.currentTetrimino);
        };

        this.start = function() {
            var canvas  = this.canvas;
            var context = this.context;

            var that = this;
            setInterval(function(){ that.render() }, 33);
            this.currentTetrimino.drop(tetris.model.RATES[this.level]);
        };

        this.pause = function() { this.currentTetrimino.pause() };

        this.quit = function() { };
    }

    $.fn.renderGame = function(opts) {
        if ( !this[0] ) {
            throw("could not find canvas");
        }

        opts = opts || {};
        var level = opts.level;

        var canvas  = this[0];
        var context = canvas.getContext("2d");
        var game    = new Game(canvas, context, level);
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

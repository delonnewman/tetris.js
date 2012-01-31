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
        this.type  = type;
        this._     = {};

        // private scope
        var _  = this._;
        _.position = position;
        _.paused   = false;
        _.state    = 'init';
        _.matrix   = MATRICES[type];
        _.rate     = undefined;


        this.isPaused = function() {
            return _.paused;
        };

        this.pause = function() {
            var _ = this._;

            if ( _.paused && _.rate ) this.drop(_.rate);
            _.paused = !_.paused;
        };

        this.matrix = function() {
            return this._.matrix;
        };

        this.drop = function(rate) {
            var _   = this._;
            _.rate  = rate;
            _.state = 'dropping';

            var that = this;
            setTimeout(function(){
                if ( !that.isPaused() && _.position[1] < HEIGHT ) {
                    _.position[1]++;
                    that.drop(rate);
                }
                else {
                    _.state = 'fallen';
                }

                if ( _.state == 'fallen' ) that.fallen(); // call trigger
            }, rate);
        };

        this.fallen = function(fn) {
            if ( fn ) { this._.onFallen = fn }
            else      { this._.onFallen.call(this, this) }
        };

        this.isFallen = function() { return this._.state == 'fallen' };

        this.isDropping = function() {
            return this._.state == 'dropping';
        };

        this.position = function(val) {
            if ( val ) { this._.position = val  }
            else       { return this._.position }
        };

        this.move = function(direction, degree, test) {
            var p = this._.position[direction];

            if ( test(p) ) {
                this._.position[direction] = p + degree;
                return true;
            }
            return false;
        };

        this.width = function() {

        };

        this.moveRight = function() {
            console.log("move right");
            return this.move(0, 5, function(p){ return p < (WIDTH - 1) });
        };

        this.moveLeft = function() {
            console.log("move left");
            return this.move(0, -5, function(p){ return p > 0 });
        };

        this.moveDown = function() {
            console.log("move down");
            return this.move(1, 5, function(p){ return p < HEIGHT });
        };

        this.rotate = function() {
            console.log("rotate");
            var _ = this._;
            var i = 0;
            var t = [];
            for ( ; i < _.matrix.length; i++ ) {
                var j = 0;
                for ( ; j < _.matrix[0].length; j++ ) {
                    t[j] = t[j] || [];
                    t[j][_.matrix[0].length - 1 - i] = _.matrix[i][j];
                }
            }
            _.matrix = t;
        };

        this.display = function() {
            var i = 0;
            for ( ; i < this._.matrix.length; i++ ) {
                console.log(this._.matrix[i]);
            }
        };
    }

    /*
     *    A running queue of tetriminos of random 'type'
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
     *    The Grid
     */
    function Grid(width, height) {
        this.width  = width;
        this.height = height;
        this.grid   = [];

        /*
         *    t (Tetrimino), position ([x, y]) corresponding to Grid position
         */
        this.storeTetrimino = function(t) {
            var matrix = t.matrix();
            var pos    = t.position();

            var i = 0;
            for ( ; i < this.width; i++ ) {
                
            }
        };
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
        this.canvas.width  = this.grid.width  * SQUARE_PX;
        this.canvas.height = this.grid.height * SQUARE_PX;

        this.queue = new tetris.model.Queue();
        this.currentTetrimino = this.queue.dequeue();
        this.currentTetrimino.position([canvas.width / 2, 0]);

        this.onFallen = function f(t) {
            console.log(this);
            this.grid.storeTetrimino(t);
            this.currentTetrimino = this.queue.dequeue();
            this.currentTetrimino.position([canvas.width / 2, 0]);
            this.currentTetrimino.drop(RATES[this.level]);

            var that = this;
            this.currentTetrimino.fallen(function(t){
                f.call(that, t);
            });
        };

        var that = this;
        this.currentTetrimino.fallen(function(t){
            that.onFallen.call(that, t);    
        });

        this.renderSquare = function(x, y, color) {
            color = color || "#ff0000";

            var fill = this.context.fillStyle;
            this.context.fillStyle = color;
            this.context.fillRect(x, y, SQUARE_PX, SQUARE_PX);
            this.context.fillStyle = fill;
        }

        this.renderTetrimino = function(t) {
            var pos    = t.position();
            var matrix = t.matrix();

            var i = 0;
            var vertical = pos[1];
            for ( ; i < matrix.length; i++ ) {
                var j = 0;
                var horizontal = pos[0];
                var y = i > 0 ? vertical += (SQUARE_PX + 2) : vertical;
                for ( ; j < matrix[i].length; j++ ) {
                    var x = j > 0 ? horizontal += (SQUARE_PX + 2) : horizontal;
                    if ( matrix[i][j] != 0 ) this.renderSquare(x, y, COLORS[t.type]);
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

        var rotated = 0;
        $('*').keydown(function(e){
            switch(e.keyCode) {
                case 37: // left arrow
                    game.currentTetrimino.moveLeft();
                    break;
                case 39: // right arrow
                    game.currentTetrimino.moveRight();
                    break;
                case 38: // up arrrow
                    if      ( rotated == 1 ) rotated = 0;
                    else if ( rotated >  0 );
                    else {
                        game.currentTetrimino.rotate();
                        rotated++;
                    }
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

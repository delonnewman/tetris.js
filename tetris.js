/*
 * tetris.js
 */

var tetris = { VERSION : '0.0.0' };

tetris.model = function(){
    var EMPTY  = 0;
    var WIDTH  = 10;
    var HEIGHT = 20;

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

    function Tetrimino(t) {
        var tetrimino = t;

        var position = [5, (HEIGHT-1)];

        var rate = 1;

        this.drop = function() {
            while ( position[1] > 0 ) {
                position[1] -= rate;
            }
        }

        this.getPostion = function() {
            return position;
        }

        this.moveRight = function() {
            if ( position[0] < (WIDTH-1) ) position[0]++;
        }

        this.moveLeft = function() {
            if ( position[0] > 0 ) position[0]--;
        }

        this.moveDown = function() {
            if ( postion[0] > 0 ) position[1]--;
        }

        this.rotate = function() {
            var i = 0;
            var t = [];
            for ( ; i < tetrimino.length; i++ ) {
                var j = 0;
                for ( ; j < tetrimino[0].length; j++ ) {
                    t[j] = t[j] || [];
                    t[j][tetrimino[0].length - 1 - i] = tetrimino[i][j];
                }
            }
            tetrimino = t;
        }

        this.display = function() {
            var i = 0;
            for ( ; i < tetrimino.length; i++ ) {
                console.log(tetrimino[i]);
            }
        }

        return this;
    }


    function Board() {

        var board = function (w, h) {
            var b = [];
            var i = 0;
            for ( ; i < w; i++ ) {
                b[i] = [];
                var j = 0;
                for ( ; j < h; j++ ) {
                    b[i][j] = EMPTY 
                }
            }
            return b;
        }(WIDTH, HEIGHT);
    }

    return {
        Tetrimino:Tetrimino,
        Board:Board,
        I:I,
        J:J,
        T:T,
        S:S,
        Z:Z,
        O:O,
        L:L
    }
}();

tetris.test = function(){
    function testSuite() {

    }
    return { suite:testSuite }
}();

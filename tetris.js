/*
 * tetris.js
 */

var tetris = { VERSION : '0.0.0' };

tetris.model = function(){
    var EMPTY  = 0;
    var WIDTH  = 10;
    var HEIGHT = 20;

    // tetriminos
    var I = [[1,1,1,1]];
    
    var J = [[2,2,2],
             [0,0,2]];
             
    var L = [[3,3,3],
             [3,0,0]];

    var O = [[4,4],
             [4,4]];

    var S = [[0,5,5],
             [5,5,0]];

    var T = [[6,6,6],
             [0,6,0]];

    var Z = [[7,7,0],
             [0,7,7]];

    function Tetrimino(t) {
        var R = [[0,-1],
                 [1, 0]];

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
            x = (position[0] * R[0][0]) + (position[1] * R[0][1]);
            y = (position[0] * R[1][0]) + (position[1] * R[1][1]);
            position[0] = x;
            position[1] = y;
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
    return { suite:testSuite }
}();

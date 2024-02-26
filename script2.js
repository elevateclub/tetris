class MinoBase {
    constructor(x, y, color, sq) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.sq = sq
    }

    /*
        rotate applies a transformation to the this.sq matrix.
        dir determines direction of rotation
        0: clockwise (cw)
        1: counter-cw (ccw)
        2: 180 flip
    */
    rotate(dir) {
        const a = [], n = this.sq.length;

        switch (dir) {
            case 0:
                for (var i = 0; i < n; i++) {
                    var row = [];
                    for (var j = n-1; j >= 0; j--) {
                        row.push(this.sq[j][i])
                    }    
                    a.push(row);
                }
                break;
            case 1:
                for (var i = n-1; i >= 0; i--) {
                    var row = [];
                    for (var j = 0; j < n; j++) {
                        row.push(this.sq[j][i])
                    }    
                    a.push(row);
                }
                break;
            case 2:
                for (var i = n-1; i >= 0; i--) {
                    var row = [];
                    for (var j = 0; j < n; j++) {
                        row.push(this.sq[i][j])
                    }
                    a.push(row);
                }
                break;    
        }

        return a;
    }

    /*
        draw renders a rect at the given board position represented by this.sq
    */
    draw(ctx, sc) {
        ctx.fillStyle = this.color;

        const n = this.sq.length;
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
                if (this.sq[i][j]) {
                    ctx.fillRect(sc*(this.x+j), sc*(this.y+i), sc, sc);
                }
            }
        }
    }
}

let Minos = {
    T: class extends MinoBase {
        constructor(x, y) {
            super(x, y, "red", [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0]
            ]);
        }
    },

    I: class extends MinoBase {
       constructor(x, y) {
           super(x, y, "orange", [
               [0, 0, 0, 0],
               [1, 1, 1, 1],
               [0, 0, 0, 0],
               [0, 0, 0, 0],
           ]);
       }
    },

    O: class extends MinoBase {
        constructor(x, y) {
            super(x, y, "yellow", [
                [1, 1],
                [1, 1],
            ]);
        }
    },

    S: class extends MinoBase {
        constructor(x, y) {
            super(x, y, "green", [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0]
            ]);
        }
    },

    Z: class extends MinoBase {
       constructor(x, y) {
           super(x, y, "blue", [
               [0, 1, 1],
               [1, 1, 0],
               [0, 0, 0]
           ]);
       }
    },

    L: class extends MinoBase {
        constructor(x, y) {
            super(x, y, "purple", [
                [0, 0, 1],
                [1, 1, 1],
                [0, 0, 0]
            ]);
        }
    },

    J: class extends MinoBase {
        constructor(x, y) {
            super(x, y, "brown", [
                [1, 0, 0],
                [1, 1, 1],
                [0, 0, 0]
            ]);
        }
    }
}

const allminos = [Minos.T, Minos.I, Minos.O, Minos.S, Minos.Z, Minos.L, Minos.J];

function randmino(x, y) {
    var rand = Math.floor(Math.random() * 7);
    return new allminos[rand](x, y);
}


class TetrisCanvas {
    constructor(ctx, sc, ox, oy) {
        this.ctx = ctx;
        this.sc = sc;
        this.ox = ox;
        this.oy = oy;
    }

    drawFrame() {
        this.ctx.clearRect(this.ox, this.oy, this.sc*10, this.sc*20);
        this.ctx.beginPath();
        this.ctx.rect(this.ox, this.oy, this.sc*10, this.sc*20);
        this.ctx.stroke();
    }

    tick(pc, rows) {
        this.drawFrame();
        pc.draw(this.ctx, this.sc);
    }
}

class TetrisEngine {
    constructor(sc) {
        this.lvl = 0;
        this.G = 0;
        this.lastDrop = 0;
        this.setLevel(1);

        this.currentPiece = randmino(3, -1);

        this.rows = [];
    }

    gravity(lvl) {
        return Math.pow(0.8 - ((lvl-1) * 0.007), lvl-1);
    }

    handleKeyPress = (evt) => {
        switch (evt.code) {
            case "KeyH":
            case "ArrowLeft":
                this.currentPiece.x--;
                break;
            case "KeyL":
            case "ArrowRight":
                this.currentPiece.x++;
                break;
            case "KeyK":
            case"ArrowUp":
                this.currentPiece.sq = this.currentPiece.rotate(0);
                break;
            case "KeyJ":
            case"ArrowDown":
                this.currentPiece.y++;
                break;
            case "KeyA":
                this.currentPiece.sq = this.currentPiece.rotate(1);
                break;
            case "KeyS":
                this.currentPiece.sq = this.currentPiece.rotate(2);
                break;
        }
    }

    setLevel(lvl) {
        this.lvl = lvl;
        this.G = this.gravity(lvl) * 1000;
    }

    tick(ts) {
        if (ts - this.lastDrop >= this.G) {
            this.currentPiece.y++;
            this.lastDrop = ts;
        }
    }
}

class Tetris {
    constructor(ctx) {
        this.sc = 20;
        this.engine = new TetrisEngine(ctx, this.sc);
        this.canvas = new TetrisCanvas(ctx, this.sc, 0, 0);
    }

    tick(ts) {
        this.engine.tick(ts);
        this.canvas.tick(this.engine.currentPiece);
    }
}

let tetris;

function run(ts) {
    tick(ts);
}

function tick(ts) {
    tetris.tick(ts);
    requestAnimationFrame(tick);
}

(function() {
    var canvas = document.querySelector("#canvas");
    tetris = new Tetris(canvas.getContext("2d"));
    window.addEventListener("keydown", tetris.engine.handleKeyPress);
    requestAnimationFrame(run);
})();
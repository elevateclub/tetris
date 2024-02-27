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
    */
    rotate(dir) {
        const a = [], n = this.sq.length;

        switch (dir) {
            case RotateDirection.None:
                a = JSON.parse(JSON.stringify(this.sq));
                break;
            case RotateDirection.Clockwise:
                for (var i = 0; i < n; i++) {
                    var row = [];
                    for (var j = n-1; j >= 0; j--) {
                        row.push(this.sq[j][i])
                    }    
                    a.push(row);
                }
                break;
            case RotateDirection.CounterClockwise:
                for (var i = n-1; i >= 0; i--) {
                    var row = [];
                    for (var j = 0; j < n; j++) {
                        row.push(this.sq[j][i])
                    }    
                    a.push(row);
                }
                break;
            case RotateDirection.Flip180:
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

RotateDirection = {
    None: 0,
    Clockwise: 1,
    CounterClockwise: 2,
    Flip180: 3,
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

function randmino() {
    var rand = Math.floor(Math.random() * 7);
    return new allminos[rand](3, -1);
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

    tick(engine) {
        this.drawFrame();
        engine.getCurrentPiece().draw(this.ctx, this.sc);

        const rows = engine.getRows();
        this.ctx.beginPath();
        for (var i = 0; i < 20; i++) {
            for (var j = 0; j < 10; j++) {
                if (rows[i][j] > 0) {
                    const x = j * this.sc;
                    const y = i * this.sc;
                    this.ctx.rect(x, y, this.sc, this.sc);
                }
            }
        }
        this.ctx.stroke();
    }
}

class TetrisEngine {
    constructor() {
        this.lvl = 0;
        this.G = 0;
        this.lastDrop = 0;
        this.setLevel(1);

        this.currentPiece = randmino();

        this.rows = TetrisEngine.clearRows();
    }

    static clearRows() {
        const a = [];
        for (var i = 0; i < 20; i++) {
            a.push(Array(10).fill(0));
        }
        return a;
    }

    static gravity(lvl) {
        return Math.pow(0.8 - ((lvl-1) * 0.007), lvl-1);
    }

    canMovePieceLeft() {
        const nextx = this.currentPiece.x-1, n = this.currentPiece.sq.length;
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
                if (this.currentPiece.sq[i][j] > 0 && nextx + j < 0) {
                    return false;
                }
            }
        }
        return true;
    }

    canMovePieceRight() {
        const nextx = this.currentPiece.x+1, n = this.currentPiece.sq.length;
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
                if (this.currentPiece.sq[i][j] > 0 && nextx + j > 9) {
                    return false;
                }
            }
        }
        return true;
    }

    canMovePieceDown() {
        // determine if floor
        const nexty = this.currentPiece.y+1, n = this.currentPiece.sq.length;
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
                // if the piece consumes a sq and computed y index is out of bounds.
                if (this.currentPiece.sq[i][j] > 0 && nexty + i > 19) {
                    return false;
                }
            }
        }
        // determine if blocks underneath
        for (var i = 0; i < n; i++) {
            const y = nexty + i;
            if (y > 19) {
                continue
            }
            for (var j = 0; j < n; j++) {
                const x = this.currentPiece.x + j;
                const below = this.rows[y][x];
                if (below !== 0 && this.currentPiece.sq[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    drop() {
        if (this.canMovePieceDown()) {
            this.currentPiece.y++;
        } else {
            const n = this.currentPiece.sq.length;
            for (var i = 0; i < n; i++) {
                const row = this.currentPiece.y + i;
                if (row >= 20) {
                    break;
                }
                for (var j = 0; j < n; j++) {
                    const col = this.currentPiece.x + j;
                    this.rows[row][col] += this.currentPiece.sq[i][j];
                }
            }
            this.currentPiece = randmino();
        }
    }

    moveLeft() {
        if (this.canMovePieceLeft()) {
            this.currentPiece.x--;
        }
    }

    moveRight() {
        if (this.canMovePieceRight()) {
            this.currentPiece.x++;
        }
    }

    handleKeyPress = (evt) => {
        evt.preventDefault();

        switch (evt.code) {
            case "KeyH":
            case "ArrowLeft":
                this.moveLeft();
                break;
            case "KeyL":
            case "ArrowRight":
                this.moveRight();
                break;
            case "KeyK":
            case"ArrowUp":
                this.currentPiece.sq = this.currentPiece.rotate(RotateDirection.Clockwise);
                break;
            case "KeyJ":
            case"ArrowDown":
                this.drop();
                break;
            case "KeyA":
                this.currentPiece.sq = this.currentPiece.rotate(RotateDirection.CounterClockwise);
                break;
            case "KeyS":
                this.currentPiece.sq = this.currentPiece.rotate(RotateDirection.Flip180);
                break;
        }
    }

    setLevel(lvl) {
        this.lvl = lvl;
        this.G = TetrisEngine.gravity(lvl) * 1000;
    }

    tick(ts) {
        if (ts - this.lastDrop >= this.G) {
            this.drop();
            this.lastDrop = ts;
        }
    }

    getCurrentPiece() {
        return this.currentPiece;
    }

    getRows() {
        return this.rows;
    }
}

class Tetris {
    constructor(ctx) {
        this.sc = 20;
        this.engine = new TetrisEngine();
        this.canvas = new TetrisCanvas(ctx, this.sc, 0, 0);
    }

    tick(ts) {
        this.engine.tick(ts);
        this.canvas.tick(this.engine);
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
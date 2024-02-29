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
    draw(ctx, sc, ox, oy) {
        ctx.fillStyle = this.color;

        const n = this.sq.length;
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
                if (this.sq[i][j]) {
                    ctx.fillRect(ox + sc*(this.x+j), oy + sc*(this.y+i), sc, sc);
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
        this.width = this.sc*20;
        this.height = this.sc*21;

        this.box = ox + 10;
        this.boy = oy + 10;
        this.bw = this.sc*10;
        this.bh = this.sc*20;

        this.iox = this.ox + this.sc*11;
        this.ioy = this.oy + 10;
        this.iw = this.sc*8;
        this.ih = this.sc*20;
    }

    drawFrame() {
        this.ctx.clearRect(this.ox, this.oy, this.width, this.height);
        this.ctx.beginPath();
        this.ctx.rect(this.ox, this.oy, this.width, this.height);
        this.ctx.stroke();
    }

    drawInfo() {
        this.ctx.clearRect(this.iox, this.ioy, this.iw, this.ih);
        this.ctx.beginPath();
        this.ctx.rect(this.iox, this.ioy, this.iw, this.ih);
        this.ctx.stroke();
    }

    drawBoard() {
        this.ctx.clearRect(this.box, this.boy, this.bw, this.bh);
        this.ctx.beginPath();
        this.ctx.rect(this.box, this.boy, this.bw, this.bh);
        this.ctx.stroke();
    }

    tick(engine) {
        this.drawFrame();
        this.drawBoard();
        this.drawInfo();
        engine.getCurrentPiece().draw(this.ctx, this.sc, this.box, this.boy);

        const rows = engine.getRows();
        this.ctx.beginPath();
        for (var i = 0; i < 20; i++) {
            for (var j = 0; j < 10; j++) {
                if (rows[i][j] > 0) {
                    const x = this.box + j * this.sc;
                    const y = this.boy + i * this.sc;
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
        this.lines = 0;
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

    /*
        isValidBoardState checks if the piece at the input x, y, and sq matrix
        would be a valid placement. 
    */
    isValidBoardState(x, y, sq) {
        var n = this.currentPiece.sq.length;
        for (var i = 0; i < n; i++) {
            const nexty = y + i;
            
            for (var j = 0; j < n; j++) {
                const nextx = x + j;
                const pieceExistsInSq = sq[i][j] > 0;

                // check bottom bound
                if (nexty > 19 && pieceExistsInSq) {
                    return false;
                }

                // check left bound
                if (pieceExistsInSq && nextx < 0) {
                    return false;
                }

                // check right bound
                if (pieceExistsInSq && nextx > 9) {
                    return false;
                }
               
                // pass if empty block in sq
                if (nexty > 19) {
                    continue
                }
                
                // determine if blocks conflict
                const pieceExistsInRow = this.rows[nexty][nextx] > 0; 
                if (pieceExistsInSq && pieceExistsInRow) {
                    return false;
                }
            }
        }
        return true;
    }

    canMovePieceLeft() {
        return this.isValidBoardState(this.currentPiece.x-1, this.currentPiece.y, this.currentPiece.sq);
    }

    canMovePieceRight() {
        return this.isValidBoardState(this.currentPiece.x+1, this.currentPiece.y, this.currentPiece.sq);
    }

    canMovePieceDown() {
        return this.isValidBoardState(this.currentPiece.x, this.currentPiece.y+1, this.currentPiece.sq);
    }

    drop() {
        if (this.canMovePieceDown()) {
            this.currentPiece.y++;
        } else {
            // capture piece
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
            // detect if line
            for (var i = 0; i < this.rows.length; i++) {
                var isLine = true;
                for (var j = 0; j < this.rows[i].length; j++) {
                    if (this.rows[i][j] === 0) {
                        isLine = false;
                        break;
                    }
                }
                if (isLine) {
                    // increment line counter, clear line, and bring all previous lines down.
                    this.line++;
                    if (this.line % 10) {
                        this.setLevel(this.level+1);
                    }
                    for (var j = i; j >= 0; j--) {
                        for (var k = 0; k < this.rows[j].length; k++) {
                            var prev = j-1 >= 0 ? this.rows[j-1][k] : 0;
                            this.rows[j][k] = prev;
                        }
                    }
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
                var next = this.currentPiece.rotate(RotateDirection.Clockwise);
                if (this.isValidBoardState(this.currentPiece.x, this.currentPiece.y, next)) {
                    this.currentPiece.sq = next;
                }
                break;
            case "KeyJ":
            case"ArrowDown":
                this.drop();
                break;
            case "KeyA":
                var next = this.currentPiece.rotate(RotateDirection.CounterClockwise);
                if (this.isValidBoardState(this.currentPiece.x, this.currentPiece.y, next)) {
                    this.currentPiece.sq = next;
                }
                break;
            case "KeyS":
                var next = this.currentPiece.rotate(RotateDirection.Flip180);
                if (this.isValidBoardState(this.currentPiece.x, this.currentPiece.y, next)) {
                    this.currentPiece.sq = next;
                }
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
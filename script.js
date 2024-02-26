var canvas = document.querySelector("#canvas");
var ctx = canvas.getContext("2d");

var s = 20;
var ox = 0;
var oy = 0;

function frame(){
    ctx.clearRect(ox, oy, 10*s, 20*s);

    ctx.beginPath();
    ctx.rect(ox, oy, 10*s, 20*s);
    ctx.stroke();
}

function scale(o, n) {
    return o + n * s
}

function tmino(ctx, pox, poy) {
    pox = scale(ox, pox);
    poy = scale(oy, poy);
    ctx.fillStyle = "red";
    ctx.fillRect(pox, poy, s, s);
    ctx.fillRect(pox+s, poy, s, s);
    ctx.fillRect(pox+s+s, poy, s, s);
    ctx.fillRect(pox+s, poy+s, s, s);
}

function omino(ctx, pox, poy) {
    pox = scale(ox, pox);
    poy = scale(oy, poy);
    ctx.fillStyle = "orange";
    ctx.fillRect(pox, poy, s, s);
    ctx.fillRect(pox+s, poy, s, s);
    ctx.fillRect(pox, poy+s, s, s);
    ctx.fillRect(pox+s, poy+s, s, s);
}

function smino(ctx, pox, poy) {
    pox = scale(ox, pox);
    poy = scale(oy, poy);
    ctx.fillStyle = "yellow";
    ctx.fillRect(pox+s, poy, s, s);
    ctx.fillRect(pox+s+s, poy, s, s);
    ctx.fillRect(pox, poy+s, s, s);
    ctx.fillRect(pox+s, poy+s, s, s);
}

function zmino(ctx, pox, poy) {
    pox = scale(ox, pox);
    poy = scale(oy, poy);
    ctx.fillStyle = "green";
    ctx.fillRect(pox, poy, s, s);
    ctx.fillRect(pox+s, poy, s, s);
    ctx.fillRect(pox+s, poy+s, s, s);
    ctx.fillRect(pox+s+s, poy+s, s, s);
}

function imino(ctx, pox, poy) {
    pox = scale(ox, pox);
    poy = scale(oy, poy);
    ctx.fillStyle = "blue";
    ctx.fillRect(pox, poy, s, s);
    ctx.fillRect(pox+s, poy, s, s);
    ctx.fillRect(pox+s+s, poy, s, s);
    ctx.fillRect(pox+s+s+s, poy, s, s);
}

function lmino(ctx, pox, poy) {
    pox = scale(ox, pox);
    poy = scale(oy, poy);
    ctx.fillStyle = "purple";
    ctx.fillRect(pox, poy+s, s, s);
    ctx.fillRect(pox+s, poy+s, s, s);
    ctx.fillRect(pox+s+s, poy+s, s, s);
    ctx.fillRect(pox+s+s, poy, s, s);
}

function jmino(ctx, pox, poy) {
    pox = scale(ox, pox);
    poy = scale(oy, poy);
    ctx.fillStyle = "brown";
    ctx.fillRect(pox, poy, s, s);
    ctx.fillRect(pox, poy+s, s, s);
    ctx.fillRect(pox+s, poy+s, s, s);
    ctx.fillRect(pox+s+s, poy+s, s, s);
}

function drawmino(pc, px, py) {
    return [tmino, omino, imino, jmino, lmino, smino, zmino][pc](ctx, px, py);
}

function nextmino() {
    return Math.floor(Math.random() * 7);
}

var currmino = nextmino();
var currmino_pos = [3, 0];

function draw(ts) {
    frame();
    drawmino(currmino, currmino_pos[0], currmino_pos[1]);
}

function gravity(lvl) {
    return Math.pow(0.8 - ((lvl-1) * 0.007), lvl-1);
}

var lvl = 0, G = 0;

function setLevel(l) {
    lvl = l;
    G = gravity(lvl) * 1000;
}

var lastDrop = 0;

function update(ts) {
    if (ts - lastDrop >= G) {
        currmino_pos[1]++;
        lastDrop = ts;
    }
}

function tick(ts){
    update(ts);
    draw(ts);
    requestAnimationFrame(tick);
}

function init(ts){
    setLevel(1);
        tick(ts);
}

function handleKeyPress(evt) {
    switch (evt.code) {
        case "KeyH":
        case "ArrowLeft":
            currmino_pos[0]--;
            break;
        case "KeyL":
        case "ArrowRight":
            currmino_pos[0]++;
            break;
        case "KeyJ":
        case "ArrowRight":
            currmino_pos[1]++;
            break;
    }
}

requestAnimationFrame(init);
window.addEventListener("keydown", handleKeyPress);
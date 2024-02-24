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

function tmino(ctx, pox, poy) {
    pox *= s;
    poy *= s;
    ctx.beginPath();
    ctx.rect(pox, poy, s, s);
    ctx.rect(pox+s, poy, s, s);
    ctx.rect(pox+s+s, poy, s, s);
    ctx.rect(pox+s, poy+s, s, s);
    ctx.stroke();
}

function omino(ctx, pox, poy) {
    pox *= s;
    poy *= s;
    ctx.beginPath();
    ctx.rect(pox, poy, s, s);
    ctx.rect(pox+s, poy, s, s);
    ctx.rect(pox, poy+s, s, s);
    ctx.rect(pox+s, poy+s, s, s);
    ctx.stroke();
}

function smino(ctx, pox, poy) {
    pox *= s;
    poy *= s;
    ctx.beginPath();
    ctx.rect(pox+s, poy, s, s);
    ctx.rect(pox+s+s, poy, s, s);
    ctx.rect(pox, poy+s, s, s);
    ctx.rect(pox+s, poy+s, s, s);
    ctx.stroke();
}

function zmino(ctx, pox, poy) {
    pox *= s;
    poy *= s;
    ctx.beginPath();
    ctx.rect(pox, poy, s, s);
    ctx.rect(pox+s, poy, s, s);
    ctx.rect(pox+s, poy+s, s, s);
    ctx.rect(pox+s+s, poy+s, s, s);
    ctx.stroke();
}

function imino(ctx, pox, poy) {
    pox *= s;
    poy *= s;
    ctx.beginPath();
    ctx.rect(pox, poy, s, s);
    ctx.rect(pox+s, poy, s, s);
    ctx.rect(pox+s+s, poy, s, s);
    ctx.rect(pox+s+s+s, poy, s, s);
    ctx.stroke();
}

function lmino(ctx, pox, poy) {
    pox *= s;
    poy *= s;
    ctx.beginPath();
    ctx.rect(pox, poy+s, s, s);
    ctx.rect(pox+s, poy+s, s, s);
    ctx.rect(pox+s+s, poy+s, s, s);
    ctx.rect(pox+s+s, poy, s, s);
    ctx.stroke();
}

function jmino(ctx, pox, poy) {
    pox *= s;
    poy *= s;
    ctx.beginPath();
    ctx.rect(pox, poy, s, s);
    ctx.rect(pox, poy+s, s, s);
    ctx.rect(pox+s, poy+s, s, s);
    ctx.rect(pox+s+s, poy+s, s, s);
    ctx.stroke();
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

requestAnimationFrame(init);
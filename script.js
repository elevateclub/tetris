var canvas = document.querySelector("#canvas");
var ctx = canvas.getContext("2d");

var s = 20;
var ox = 0;
var oy = 0;

function frame(){
    ctx.beginPath();
    ctx.rect(ox, oy, 10*s, 20*s);
    ctx.stroke();
}

function tmino(pox, poy) {
    pox *= s;
    poy *= s;
    ctx.beginPath();
    ctx.rect(pox, poy, s, s);
    ctx.rect(pox+s, poy, s, s);
    ctx.rect(pox+s+s, poy, s, s);
    ctx.rect(pox+s, poy+s, s, s);
    ctx.stroke();
}

function omino(pox, poy) {
    pox *= s;
    poy *= s;
    ctx.beginPath();
    ctx.rect(pox, poy, s, s);
    ctx.rect(pox+s, poy, s, s);
    ctx.rect(pox, poy+s, s, s);
    ctx.rect(pox+s, poy+s, s, s);
    ctx.stroke();
}

function smino(pox, poy) {
    pox *= s;
    poy *= s;
    ctx.beginPath();
    ctx.rect(pox+s, poy, s, s);
    ctx.rect(pox+s+s, poy, s, s);
    ctx.rect(pox, poy+s, s, s);
    ctx.rect(pox+s, poy+s, s, s);
    ctx.stroke();
}

function zmino(pox, poy) {
    pox *= s;
    poy *= s;
    ctx.beginPath();
    ctx.rect(pox, poy, s, s);
    ctx.rect(pox+s, poy, s, s);
    ctx.rect(pox+s, poy+s, s, s);
    ctx.rect(pox+s+s, poy+s, s, s);
    ctx.stroke();
}

function imino(pox, poy) {
    pox *= s;
    poy *= s;
    ctx.beginPath();
    ctx.rect(pox, poy, s, s);
    ctx.rect(pox+s, poy, s, s);
    ctx.rect(pox+s+s, poy, s, s);
    ctx.rect(pox+s+s+s, poy, s, s);
    ctx.stroke();
}

function lmino(pox, poy) {
    pox *= s;
    poy *= s;
    ctx.beginPath();
    ctx.rect(pox, poy+s, s, s);
    ctx.rect(pox+s, poy+s, s, s);
    ctx.rect(pox+s+s, poy+s, s, s);
    ctx.rect(pox+s+s, poy, s, s);
    ctx.stroke();
}

function jmino(pox, poy) {
    pox *= s;
    poy *= s;
    ctx.beginPath();
    ctx.rect(pox, poy, s, s);
    ctx.rect(pox, poy+s, s, s);
    ctx.rect(pox+s, poy+s, s, s);
    ctx.rect(pox+s+s, poy+s, s, s);
    ctx.stroke();
}

function draw(ts){
    frame();
    tmino(3, 0);
    imino(0, 19);
}

function run(ts){
    draw(ts);
    requestAnimationFrame(tick);
}

function tick(ts){
    draw(ts);
    requestAnimationFrame(tick);
}

requestAnimationFrame(run);
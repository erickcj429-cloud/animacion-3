const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');


const PIXEL = 8;
const SPRITE_SIZE = 35;
const SPRITE_SCALE = PIXEL;
const spriteDrawSize = SPRITE_SIZE * SPRITE_SCALE;

const PALETTE = {
'T': null,
'W': '#ffffff',
'P': '#f01b49ff',
'B': '#000000',
};

const FRAME_TONGUE = [
"TTTTTTTTTTTTTTTTTTTTTTTTTTTT",
"TTTTTTTTTBBBBBBBBBTTTTTTTTTT",
"TTTTTBBBBWWWWWWWWWBBBBTTTTTT",
"TTTBBWWWWWWWWWWWWWWWWWBBTTTT",
"TTBBWWWWWWWWWWWWWWWWWWWWWWBBT",
"TTBBWWTTWWTTWWWWWWWWWWWWWWBBTT",
"BBWWWWTTWWTTWWWWWWWWWTTTWWWBBTTT",
"BBWWWWWWWWWWWWWWWWWTTWWWTTWBBTTT",
"BBWWPPWWPPWWPPWWWWWWWWWWTTWBBTTT",
"BBWWPPPPPPPPPPWWWWWWWWTTWWWBBTTTT",
"BBWWPPPPPPPPPPWWWWWWWWWWWWWBBTTT",
"TTBWPPPPPPPPPPPPWWWWWWWWWWWWBBTTT",
"TTBWWPPPPPPPPPPPWWWWWWWWWWWWBBTTT",
"TTTBWPPWWPPPWWPPWWWWWWWWWWWWBBT",
"TTTTBWWWWWWWWWWWWWWWWWWWWWBBTTT",
"TTTTTBBBBWWWWWWWWWWWWBBBBTTT",
"TTTTTTTTTBBBBBBBBBBBBTTTTTTT",
];
function drawBackground(ctx, w, h){
const g = ctx.createLinearGradient(0,0,0,h);
g.addColorStop(0,'#070709');
g.addColorStop(1,'#0d0d0f');
ctx.fillStyle = g;
ctx.fillRect(0,0,w,h);


ctx.beginPath();
ctx.fillStyle = '#dfe6e9';
ctx.globalAlpha = 0.08;
ctx.arc(w*0.8, h*0.18, 48, 0, Math.PI*2);
ctx.fill();
ctx.globalAlpha = 1;


ctx.fillStyle = '#111';
ctx.fillRect(0, h*0.6, w, h*0.4);


ctx.fillStyle = '#0e0e0e';
for(let i=0;i<5;i++){
const tw = 40 + (i%2)*20;
const tx = i*(w/5) + 30;
const th = 80 + (i%3)*40;
ctx.fillRect(tx, h*0.6 - th, tw, th);
for(let c=0;c<4;c++) ctx.fillRect(tx + c*(tw/4), h*0.6 - th - 12, tw/8, 12);
}


ctx.fillStyle = '#2a2b2c';
for(let i=0;i<20;i++) ctx.fillRect(Math.random()*w, h*0.6 + Math.random()*h*0.35, 6, 10);


ctx.strokeStyle = 'rgba(255,255,255,0.02)';
ctx.lineWidth = 1;
for(let y = h*0.6; y < h; y += 8){
for(let x = 0; x < w; x += 24){
ctx.strokeRect(x + ((y/8)%2?12:0), y, 24, 8);
}
}
}
function drawPixel(x,y,color){
if(!color) return;
ctx.fillStyle = color;
ctx.fillRect(x, y, SPRITE_SCALE, SPRITE_SCALE);
}


function initCanvas(){
drawBackground(ctx, canvas.width, canvas.height);
ctx.font = '14px monospace';
ctx.fillStyle = '#999';
ctx.fillText('', 18, canvas.height - 22);
}


initCanvas();


startBtn.addEventListener('click', ()=>{
startBtn.style.transition = 'opacity 400ms, transform 300ms';
startBtn.style.opacity = 0;
startBtn.style.transform = 'translate(-50%,-50%) scale(0.9)';
setTimeout(()=> startBtn.remove(), 450);


drawBackground(ctx, canvas.width, canvas.height);


const px = canvas.width/2 - spriteDrawSize/2;
const py = canvas.height*0.45 - spriteDrawSize/2;


let r = 0, c = 0;


function step(){
const code = FRAME_TONGUE[r][c];
drawPixel(px + c*SPRITE_SCALE, py + r*SPRITE_SCALE, PALETTE[code]);


c++;
if(c >= SPRITE_SIZE){ c = 0; r++; }
if(r < SPRITE_SIZE) setTimeout(step, 30);
}


step();
});
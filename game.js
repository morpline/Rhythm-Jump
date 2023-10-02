const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const feet = document.getElementById("distance");

const music = document.getElementById("music");
const land = document.getElementById("land");
const fire = document.getElementById("fire");
const hit = document.getElementById("hit");
const bpm = 90;
let newBpm = 0;
let fps = 0;
let dispfps = 0;

let keys = {};


let game = {
    lives:3,
    speed:10,
    j:0,
    y:0,
    ym:0,
    distance:0,
    iframes:0,
}

function updatePlayer () {
    game.y+=game.ym;
    game.ym-= game.speed/10;
    game.distance+=game.speed;
    if(game.y<0){
        game.y=0;
        game.ym=-game.speed/10;
        game.j++;
        if(game.ym<-1){
            // land.play();
        }
    }
    if(keys[" "] && game.j>0){
        game.ym=game.speed;
        game.j=0;
    }
}

let blocks = [
    
]
function updateBlocks () {
    ctx.fillStyle = "brown"
    blocks.forEach((b,i) => {
        ctx.fillRect(b,275,25,25);
        blocks[i]-=game.speed;
        if(b<50 && b>25 && game.y<5){
            if(game.iframes<0)
            {
                game.lives--;
                game.iframes=8;
            }
        } else if (b<50 && b>25 && game.y<25) {
            blocks.splice(i,1);
            land.currentTime = 0;
            land.play();
            game.ym=8;
        }
        if(b<-25){
            blocks.splice(i,1);
        }
    })
}

let clouds = [];
for (let index = 0; index < 16; index++) {
    clouds.push([[Math.round(Math.random()*800),Math.random()*200, Math.random()*0.5+0.5]])
}
function updateClouds () {
    ctx.fillStyle = "white"
    clouds.forEach((b,i) => {
        ctx.fillRect(b[0],b[1],25*b[2],25*b[2]);
        clouds[i][0]-=game.speed*b[2];
        if(b[0]<-25){
            // clouds.splice(i,1);
            clouds[i][0]+=800;
        }
    })
}

function animate () {
    // console.clear();
    // console.log(game.iframes);
    fps++;
    if(game.lives<1){
        feet.innerText = "You died."
        music.pause();
        return;
    }
    requestAnimationFrame(animate);
    game.iframes--;
    game.speed+=0.001;
    newBpm = bpm*game.speed/10;
    music.playbackRate = Math.round(newBpm/bpm);
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, 720,480);
    ctx.fillStyle = "green";
    ctx.fillRect(0, 300, 720,180);
    ctx.fillStyle = "gray";
    // if((Math.round(game.distance)/10)%(bpm/4) == 0){
    console.log((fps/dispfps)%Math.round((newBpm / (dispfps))*100));
    if((fps/dispfps)%Math.round((newBpm / (dispfps))*100)==1){
        //calculate how many frames until next beat
        // newBpm / (dispfps*60) = how many second it should be to next bump
        hit.play();
        blocks.push((bpm*10));
        if(Math.random()>0.5){
            blocks.push((bpm*12));
        }
        ctx.fillRect(30,285-game.y,25,15);

    } else {

        ctx.fillRect(30,275-game.y,25,25);
    }
    updatePlayer();
    updateBlocks();
    updateClouds();
    feet.innerText = `${Math.round(game.distance/10)} ft. ${game.lives} Lives ${Math.round(game.speed)} Mph ${dispfps} FPS`
}
function start () {
    if(game.lives>0)
    {

        music.currentTime = 0;
        music.play();
        game = {
            lives:3,
            speed:10,
            j:0,
            y:0,
            ym:0,
            distance:0
        }
        blocks = [
            
        ]
        animate();
    }
}
setInterval(() => {
    dispfps=fps;
    fps=0;
}, 1000);
document.addEventListener("click",()=>{start()})
document.addEventListener("keydown",(e)=>{keys[e.key]=true})
document.addEventListener("keyup",(e)=>{keys[e.key]=false})
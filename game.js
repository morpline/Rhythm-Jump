const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const feet = document.getElementById("distance");
const selector = document.getElementById("selector");


//Sounds
const songs = [
    {
        "name":"Newer Wave",
        "src":"Newer Wave.mp3",
        "bpm":110,
        "credits":'"Newer Wave" Kevin MacLeod (incompetech.com) <br> Licensed under Creative Commons: By Attribution 4.0 License <br> http://creativecommons.org/licenses/by/4.0/ <!-- It needs to say that when the song is set to Newer Wave -->'
    },
    {
        "name":"Factory",
        "src":"Factory.mp3",
        "bpm":90,
        "credits":'Written by Ririe Nielsen'
    },
    {
        "name":" Blends",
        "src":"MusMus-BGM-082.mp3",
        "bpm":85,
        "credits":"Free BGM / Music Material MusMus https://musmus.main.jp"
    },
    {
        "name":" Bwop",
        "src":"bwop.mp3",
        "bpm":90,
        "credits":"Test"
    },
];
const music = document.getElementById("music");
const land = document.getElementById("land");
const fire = document.getElementById("fire");
const hit = document.getElementById("hit");

//Images
const cloud = document.getElementById("cloud");
const man3 = document.getElementById("man3");
const man3hurt = document.getElementById("man3-hurt");
const mtn = document.getElementById("mtn");


let bpm = 85;
let newBpm = 0;
let actbpm = 0;
let fps = 30;
let dispfps = 0;

let keys = {};


let game = {
    lives:0,
    speed:10,
    j:0,
    y:0,
    ym:0,
    distance:0,
    iframes:0,
    score:0,
    coins:0,
}



function Background() {
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, 720,480);
    updateClouds();
    ctx.fillStyle = "#383226";
    ctx.fillRect(0, 300, 720,180);
    ctx.fillStyle = "#a18f6b";
    for (let index = 0; index < 720; index++) {
        ctx.fillRect(index,300,1,Math.sin(game.distance+index/10)*5+15)
    }
}



function updatePlayer () {
    game.y+=game.ym;
    game.ym-= actbpm*1;
    game.distance+=actbpm*1;
    if(game.y<0){
        game.y=0;
        game.ym=-actbpm*1;
        game.j++;
        if(game.ym<-1){
            // land.play();
        }
    }
}



let coins = [
    9999,
]
function updateCoins () {
    ctx.fillStyle = "yellow"
    coins.forEach((b,i) => {
        ctx.fillRect(b,200,25,25);
        coins[i]-=actbpm*10;
        // ctx.fillStyle = "rgba(255,255,0,0.5)"
        // ctx.fillRect(25,175,25,75);
        if(b<50 && b>25 && game.y<125 && game.y>50){
            coins.splice(i,1);
            game.score+=20;
            game.coins++;
            fire.currentTime = 0;
            fire.play();
        }
        if(b<-25){
            coins.splice(i,1);
        }
    })
}



let blocks = [
    
]
function updateBlocks () {
    ctx.fillStyle = "red"
    blocks.forEach((b,i) => {
        ctx.fillRect(b,275,25,25);
        blocks[i]-=actbpm*10;
        if(b<50 && b>0 && game.y<5){
            if(game.iframes<0)
            {
                game.lives--;
                game.iframes=8;
            }
        } else if (b<50 && b>0 && game.y<25) {
            blocks.splice(i,1);
            game.score+=25;
            land.currentTime = 0;
            land.play();
            game.ym=9*actbpm;
        }
        if(b<-25){
            blocks.splice(i,1);
            game.score+=10;
        }
    })
}



let robber = [
    360
]
function updaterobber () {
    ctx.fillStyle = "green"
    robber.forEach((b,i) => {
        ctx.fillRect(b,275,25,25);
        robber[i]-=actbpm*15;
        if(b<50 && b>0 && game.y<5){
            if(game.iframes<0)
            {
                game.lives=0;
                game.iframes=8;
            }
        } else if (b<50 && b>0 && game.y<25) {
            robber.splice(i,1);
            game.score+=25;
            land.currentTime = 0;
            land.play();
            game.ym=9*actbpm;
        }
        if(b<-25){
            robber.splice(i,1);
            game.score+=10;
        }
    })
}



let clouds = [];
for (let index = 0; index < 32; index++) {
    clouds.push(
            [
                Math.round(Math.random()*800),
                Math.random()*200-75, 
                Math.random()*0.5+0.5,
                Math.round(Math.random())
            ]
    );
    clouds.sort((a,b)=>{
        return a[2]-b[2];
    })
}
function updateClouds () {
    ctx.fillStyle = "white"
    clouds.forEach((b,i) => {
        // ctx.fillRect(b[0],b[1],25*b[2],25*b[2]);
        if(b[3]){
            ctx.drawImage(cloud, b[0],b[1],75*b[2],75*b[2]);
            clouds[i][0]-=actbpm*b[2];
            if(b[0]<-75){
                // clouds.splice(i,1);
                clouds[i][0]+=795;
            }
        } else {
            ctx.drawImage(mtn, b[0],b[1]+150,450*b[2],450*b[2]);
            clouds[i][0]-=actbpm*b[2]*0.3;
            if(b[0]<-450){
                // clouds.splice(i,1);
                clouds[i][0]+=720+450;
            }
        }
        
    })
}


let ti = 0;
let ls = 0;
let bitm = 0;
let frame = 0;
function animate () {
    // console.clear();
    // console.log(game.ym);
    fps++;
    ti++;
    // ti+=music.currentTime*60-ti;
    console.log(ti);
    if(game.lives<1){
        feet.innerText = `You died. Score: ${game.score}`;
        music.pause();
        selector.style.display = "grid";
        return;
    }
    requestAnimationFrame(animate);
    
    if(music.currentTime-ls<0.03){
        ls=music.currentTime;
        return;
    }
    ls=music.currentTime;

    game.iframes--;
    game.speed+=0.0001;
    newBpm = bpm*game.speed/10;
    actbpm = Math.round(newBpm/bpm*10)/10;
    // console.log(actbpm);
    music.playbackRate = actbpm;
    Background();
    // if((Math.round(game.distance)/10)%(bpm/4) == 0){
    // console.log((fps/dispfps)%Math.round((newBpm / (dispfps))*100));
    if(Math.round((ti/60)%((60 / 4) / (actbpm*bpm))*100) < Math.round(((ti-1)/60)%((60 / 4) / (actbpm*bpm))*100)){
        frame++;
    }
    if(Math.round((ti/60)%((60) / (actbpm*bpm))*100) < Math.round(((ti-1)/60)%((60) / (actbpm*bpm))*100)){
        bitm++;
        if(bitm===3)
        {
            hit.play();
            switch(Math.round(Math.random()*3))
            {
                case 1:
                    blocks.push((actbpm*bpm*12));
                case 0:
                    blocks.push((actbpm*bpm*8));
                    break;
                case 2:
                    coins.push((actbpm*bpm*8));
                    break;
                case 3:
                    robber.push((actbpm*bpm*8));
                    break;
            }
            bitm=0;
        }
    }
    if(Math.round((ti+5/60)%((60) / (actbpm*bpm*4))*100) < Math.round(((ti-5)/60)%((60) / (actbpm*bpm*4))*100)) {
        if(keys[" "] && game.j>0){
            game.ym=actbpm*11;
            game.j=0;
            console.warn(ti%bpm/4);
            land.play();
        }
    } else {
        if(keys[" "] && game.j>0){
            game.ym=actbpm*4;
            game.j=0;
            console.log(ti%bpm/4);
            hit.play();
        }
    }
    if(game.y>0){
        console.log(game.ym);
    }
    updateBlocks();
    updaterobber();
    updatePlayer();
    ctx.fillStyle = "gray";
    ctx.fillRect(30,275-game.y,25,25);
    if(game.iframes>0){
        ctx.drawImage(man3hurt,30,275-game.y,25,25);
    } else {
        ctx.drawImage(man3,frame%4*25,0,25,25,30,275-game.y,25,25);
    }
    updateCoins();
    feet.innerHTML = `
        <span>${Math.round(game.distance)} ft.</span>
        <span>${game.lives} Lives</span>
        <span>${Math.round(actbpm*60*60/2580*1000)/100} Mph</span>
        <span>${dispfps} FPS</span>
        <span>${game.score} Pts.</span>
        <span>${game.coins} Coins</span>
        <span>${Math.round((ti/60)%((60) / (actbpm*bpm*4))*100)}</span>
    `
}
function start (song = 0) {
    if(game.lives==0)
    {
        music.src = songs[song].src;
        music.currentTime = 0;
        ti=0;
        music.play();
        game = {
            lives:3,
            speed:10,
            j:0,
            y:0,
            ym:0,
            distance:0,
            iframes:0,
            score:0,
            coins:0,
        };
        blocks = [];
        coins = [];
        animate();
        selector.style.display = "none";
    }
}
setInterval(() => {
    dispfps=fps;
    fps=0;
    // console.log(game.distance);
}, 1000);

songs.forEach((s,i) => {
    let li = document.createElement("li");
    let html = `
        <p>
            ${s.name}
        </p>
        <p>
            ${s.credits}
        </p>
        <p>
            ${s.bpm}
        </p>
    `
    li.innerHTML = html;
    selector.append(li);
    li.addEventListener("click",()=>{
        bpm = s.bpm;
        start(i);
    })
});

// document.addEventListener("click",()=>{start()})
document.addEventListener("keydown",(e)=>{keys[e.key]=true})
document.addEventListener("keyup",(e)=>{keys[e.key]=false})


//Background that displays on load
Background()    ;
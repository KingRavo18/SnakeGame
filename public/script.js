document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("start_btn").onclick = () => startGame();
});

const player_avatar = document.createElement("div");
const game_tick = 100;
let interval = null;
let positionX = 0;
let positionY = 0;

function startGame(){
    document.getElementById("start_btn").style.display = "none";
    document.getElementById("restart_btn").style.display = "none";
    const game_screen = document.getElementById("game_screen");
    const game_screen_width = game_screen.clientWidth; 
    const game_screen_height = game_screen.clientHeight; 

    player_avatar.classList.add("player_avatar");
    player_avatar.style.height = `${Math.ceil(game_screen_height / 12)}px`;
    player_avatar.style.width = `${Math.ceil(game_screen_width / 12)}px`;
    game_screen.appendChild(player_avatar);
    player_avatar.style.marginLeft = `${positionX}px`;
    player_avatar.style.marginTop = `${positionY}px`;

    interval = setInterval(() => avatar_move(game_screen_width, game_screen_height), game_tick);
}

function avatar_move(game_screen_width, game_screen_height){
    positionX += Math.ceil(game_screen_width / 12 / 2);
    if(positionX >= game_screen_width){
        gameOver();
    }
    player_avatar.style.marginLeft = `${positionX}px`;
}

function gameOver(){
    clearInterval(interval);
    const restartButton = document.getElementById("restart_btn");
    restartButton.style.display = "block";
    restartButton.onclick = restartGame;
    
}

function restartGame(){
    positionX = 0;
    positionY = 0;
    startGame();
}
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("start_btn").onclick = () => startGame();
});

//const player_avatar = document.createElement("div");
const start_button = document.getElementById("start_btn");
const tile_size = 40; 
//const game_tick = 100;
//let interval = null;
//let positionX = 0;
//let positionY = 0;


function startGame(){
    start_button.style.display = "none";
    gameSetup();
    //interval = setInterval(() => avatarMove(game_screen_width, game_screen_height), game_tick);
}

function gameSetup() {
    const tile_x_amount = 12; 
    const tile_y_amount = 12; 
    const total_tile_amount = tile_x_amount * tile_y_amount;
    const game_screen = document.getElementById("game_screen");
    game_screen.style.width = `${tile_size * tile_x_amount + 18}px`;
    game_screen.style.height = `${tile_size * tile_y_amount + 18}px`;

    for(let i = 1; i < total_tile_amount; i++){
        let grid_tile = document.createElement("div");
        grid_tile.style.height = `${tile_size}px`;
        grid_tile.style.width = `${tile_size}px`;
        grid_tile.classList.add("grid_tile");
        game_screen.appendChild(grid_tile);
    }
    

    //player_avatar.classList.add("player_avatar");
    //player_avatar.style.height = `${Math.ceil(game_screen_height / 12)}px`;
    //player_avatar.style.width = `${Math.ceil(game_screen_width / 12)}px`;
    //player_avatar.style.marginLeft = `${positionX}px`;
    //player_avatar.style.marginTop = `${positionY}px`;
    //game_screen.appendChild(player_avatar);
}

/*
function avatarMove(game_screen_width, game_screen_height){
    positionX += Math.ceil(game_screen_width / 12 / 2);
    if(positionX >= game_screen_width){
        gameOver();
    }
    player_avatar.style.marginLeft = `${positionX}px`;
}

function gameOver(){
    clearInterval(interval);
    start_button.textContent = "RESTART";
    start_button.style.display = "block";
    start_button.onclick = restartGame;
    
}

function restartGame(){
    positionX = 0;
    positionY = 0;
    startGame();
}
*/
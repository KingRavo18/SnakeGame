document.addEventListener("DOMContentLoaded", () => {
    start_button.onclick = () => startGame();
});

const player_avatar = document.createElement("div");
const start_button = document.getElementById("start_btn");
const tile_x_amount = 12; 
const tile_y_amount = 12; 
const game_tick = 100;
const grid = [];
let positionX = 0;
let positionY = 0;
let interval = null;

function startGame(){
    start_button.style.display = "none";
    gameSetup();
    interval = setInterval(avatarMove, game_tick);
}

function gameSetup(){
    const tile_size = 40; 
    const game_screen = document.getElementById("game_screen");
    game_screen.style.width = `${tile_size * tile_x_amount + 18}px`;
    game_screen.style.height = `${tile_size * tile_y_amount + 18}px`;

    // Loop to create the game 2.5D grid node array
    for(let i = 0; i < tile_y_amount; i++){
        const x_array = [];
        for(let j = 0; j < tile_x_amount; j++){
            const grid_tile = document.createElement("div");
            grid_tile.style.height = `${tile_size}px`;
            grid_tile.style.width = `${tile_size}px`;
            grid_tile.classList.add("grid_tile");
            game_screen.appendChild(grid_tile);
            x_array.push(grid_tile);
        }  
        grid.push(x_array);
    }
    console.log(grid[positionY][positionX]);

    player_avatar.classList.add("player_avatar");
    player_avatar.style.height = `${tile_size}px`;
    player_avatar.style.width = `${tile_size}px`;
    grid[positionY][positionX].appendChild(player_avatar);
}

function avatarMove(){
    grid[positionY][positionX].removeChild(player_avatar);
    positionX += 1;
    grid[positionY][positionX].appendChild(player_avatar);
}

/*
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
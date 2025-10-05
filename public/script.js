document.addEventListener("DOMContentLoaded", () => {
    start_button.onclick = () => startGame();
});

const player_avatar = document.createElement("div");
const start_button = document.getElementById("start_btn");
const tile_x_amount = 12; 
const tile_y_amount = 12; 
const game_tick = 400;
const grid = [];
let direction;
let positionX = 6;
let positionY = 6;
let interval = null;

function startGame(){
    start_button.style.display = "none";
    gameSetup();
    avatarDirection();
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

    player_avatar.classList.add("player_avatar");
    player_avatar.style.height = `${tile_size}px`;
    player_avatar.style.width = `${tile_size}px`;
    grid[positionY][positionX].appendChild(player_avatar);
}

function avatarDirection(){
    direction = "right";
    document.addEventListener("keydown", event => {
        switch(event.key){
            case "ArrowRight":
                direction = "right";
                break;
            case "ArrowDown":
                direction = "down";
                break;
            case "ArrowLeft":
                direction = "left";
                break;
            case "ArrowUp":
                direction = "up";
                break;
        }
    });
}

function avatarMove(){
    grid[positionY][positionX].removeChild(player_avatar);

    switch(direction){
        case "right":
            positionX += 1;
            break;
        case "down":
            positionY += 1;
            break;
        case "left":
            positionX -= 1;
            break;
        case "up":
            positionY -= 1;
            break;
    }
    if(positionX >= tile_x_amount || positionY >= tile_y_amount || positionX < 0 || positionY < 0){
        return gameOver();
    }
    
    grid[positionY][positionX].appendChild(player_avatar);
}

function gameOver(){
    clearInterval(interval);
    start_button.textContent = "RESTART";
    start_button.style.display = "block";
    start_button.onclick = restartGame;
}

function restartGame(){
    positionX = 6;
    positionY = 6;
    avatarDirection();
    grid[positionY][positionX].appendChild(player_avatar);
    start_button.style.display = "none";
    interval = setInterval(avatarMove, game_tick);
}

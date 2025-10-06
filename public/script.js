document.addEventListener("DOMContentLoaded", () => {
    start_button.onclick = () => startGame();
});

const start_button = document.getElementById("start_btn");
const player_avatar = document.createElement("div");
const fruit_item = document.createElement("div");
const tile_size = 40;
const tile_x_amount = 12; 
const tile_y_amount = 12; 
const game_tick = 400;
const grid = [];
let direction;
let positionX;
let positionY;
let fruitAmount = 0;
let interval = null;
let isBoardGenerated = false;

function startGame(){
    start_button.style.display = "none";
    gameSetup();
    avatarDirection();
    interval = setInterval(game, game_tick);
}

function gameSetup(){
    if(!isBoardGenerated){
         
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
    }
    positionX = 6;
    positionY = 6;
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

function game(){
    fruit();
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

function fruit(){
    if(fruitAmount < 1){
        fruit_item.classList.add("fruit");
        fruit_item.style.height = `${tile_size}px`;
        fruit_item.style.width = `${tile_size}px`;
        let fruit_Y_position;
        let fruit_X_position;
        do{
            fruit_Y_position = Math.round(Math.random() * (tile_y_amount + 1));
            fruit_X_position = Math.round(Math.random() * (tile_x_amount + 1));
        }while(fruit_Y_position === positionY && fruit_X_position === positionX);
        grid[fruit_Y_position][fruit_X_position].appendChild(fruit_item);
        fruitAmount++;
    }
}

function gameOver(){
    clearInterval(interval);
    start_button.textContent = "RESTART";
    start_button.style.display = "block";
    start_button.onclick = startGame;
}


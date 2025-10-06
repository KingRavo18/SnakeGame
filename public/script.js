document.addEventListener("DOMContentLoaded", () => {
    start_button.onclick = () => startGame();
});

const start_button = document.getElementById("start_btn");
const tile_size = 40;
const Player = {
    avatar: document.createElement("div"),
    move_direction: undefined,
    positionX: undefined,
    positionY: undefined,
};
const Fruit = {
    item: document.createElement("div"),
    positionX: undefined,
    positionY: undefined,
};
const tile_x_amount = 12; 
const tile_y_amount = 12; 
const game_tick = 400;
const grid = [];
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
        isBoardGenerated = true;
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
        Player.avatar.classList.add("player_avatar");
        Player.avatar.style.height = `${tile_size}px`;
        Player.avatar.style.width = `${tile_size}px`;
    }
    Player.positionX = 6;
    Player.positionY = 6;
    grid[Player.positionY][Player.positionX].appendChild(Player.avatar);
}

function avatarDirection(){
    Player.move_direction = "right";
    document.addEventListener("keydown", event => {
        switch(event.key){
            case "ArrowRight":
                Player.move_direction = "right";
                break;
            case "ArrowDown":
                Player.move_direction = "down";
                break;
            case "ArrowLeft":
                Player.move_direction = "left";
                break;
            case "ArrowUp":
                Player.move_direction = "up";
                break;
        }
    });
}

function game(){
    fruit();
    grid[Player.positionY][Player.positionX].removeChild(Player.avatar);

    switch(Player.move_direction){
        case "right":
            Player.positionX += 1;
            break;
        case "down":
            Player.positionY += 1;
            break;
        case "left":
            Player.positionX -= 1;
            break;
        case "up":
            Player.positionY -= 1;
            break;
    }
    if(Player.positionX >= tile_x_amount || Player.positionY >= tile_y_amount || Player.positionX < 0 || Player.positionY < 0){
        return gameOver();
    }
    
    grid[Player.positionY][Player.positionX].appendChild(Player.avatar);
}

function fruit(){
    if(fruitAmount < 1){
        Fruit.item.classList.add("fruit");
        Fruit.item.style.height = `${tile_size}px`;
        Fruit.item.style.width = `${tile_size}px`;
        do{
            Fruit.positionY = Math.round(Math.random() * (tile_y_amount + 1));
            Fruit.positionX = Math.round(Math.random() * (tile_x_amount + 1));
        }while(Fruit.positionY === Player.positionY && Fruit.positionX === Player.positionX);
        grid[Fruit.positionY][Fruit.positionX].appendChild(Fruit.item);
        fruitAmount++;
    }
}

function gameOver(){
    clearInterval(interval);
    start_button.textContent = "RESTART";
    start_button.style.display = "block";
    start_button.onclick = startGame;
}


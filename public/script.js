document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("start_btn").onclick = () => startGame();
});

const Player = {
    avatar: document.createElement("div"),
    move_direction: "right",
    positionX: 0,
    positionY: 0, 
    fruit_picked_up: 0,
};
const Fruit = {
    item: document.createElement("div"),
    positionX: 0,
    positionY: 0,
    amount_generated: 0,
};
const GameBoard = {
    tile_size: 40,
    tile_x_amount: 12,
    tile_y_amount: 12,
    grid: [],
    isGenerated: false,
};

//For now, these stay here
Fruit.item.classList.add("fruit");
Fruit.item.style.height = `${GameBoard.tile_size}px`;
Fruit.item.style.width = `${GameBoard.tile_size}px`;


function startGame(){
    const game_tick = 400;
    const start_button = document.getElementById("start_btn");
    start_button.style.display = "none";
    Player.fruit_picked_up = 0;

    createAvatar();
    setupBoard();
    avatarDirection();
    let interval = setInterval(() => game(start_button, interval), game_tick);
}

function createAvatar(){
    Player.avatar.classList.add("player_avatar");
    Player.avatar.style.height = `${GameBoard.tile_size}px`;
    Player.avatar.style.width = `${GameBoard.tile_size}px`;
}

function setupBoard(){
    if(!GameBoard.isGenerated){
        GameBoard.isGenerated = true;
        const game_screen = document.getElementById("game_screen");
        game_screen.style.width = `${GameBoard.tile_size * GameBoard.tile_x_amount + 18}px`;
        game_screen.style.height = `${GameBoard.tile_size * GameBoard.tile_y_amount + 18}px`;

        // Loop to create the game 2.5D grid array
        for(let i = 0; i < GameBoard.tile_y_amount; i++){
            const x_array = [];
            for(let j = 0; j < GameBoard.tile_x_amount; j++){
                const grid_tile = document.createElement("div");
                grid_tile.style.height = `${GameBoard.tile_size}px`;
                grid_tile.style.width = `${GameBoard.tile_size}px`;
                grid_tile.classList.add("grid_tile");
                game_screen.appendChild(grid_tile);
                x_array.push(grid_tile);
            }  
            GameBoard.grid.push(x_array);
        }
    }
    Player.positionX = 6;
    Player.positionY = 6;
    GameBoard.grid[Player.positionY][Player.positionX].appendChild(Player.avatar);
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

function game(start_button, interval){
    document.getElementById("score").textContent = `SCORE: ${Player.fruit_picked_up * 100}`;
    fruit();
    GameBoard.grid[Player.positionY][Player.positionX].removeChild(Player.avatar);
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
    if(Player.positionX >= GameBoard.tile_x_amount || Player.positionY >= GameBoard.tile_y_amount || Player.positionX < 0 || Player.positionY < 0){
        return gameOver(start_button, interval);
    }
    
    GameBoard.grid[Player.positionY][Player.positionX].appendChild(Player.avatar);
    if(Player.positionX === Fruit.positionX && Player.positionY === Fruit.positionY){
        Player.fruit_picked_up++;
        GameBoard.grid[Fruit.positionY][Fruit.positionX].removeChild(Fruit.item);
        Fruit.amount_generated--;
    }
}
// If there is no fruit, this function places the fruit on a random tile
function fruit(){
    if(Fruit.amount_generated < 1){
        do{
            Fruit.positionY = Math.floor(Math.random() * GameBoard.tile_y_amount);
            Fruit.positionX = Math.floor(Math.random() * GameBoard.tile_x_amount);
        }while(Fruit.positionY === Player.positionY && Fruit.positionX === Player.positionX);
        GameBoard.grid[Fruit.positionY][Fruit.positionX].appendChild(Fruit.item);
        Fruit.amount_generated++;
    }
}

function gameOver(start_button, interval){
    clearInterval(interval);
    new Audio("Assets/Audio/explosion-312361.mp3").play();
    start_button.textContent = "RESTART";
    start_button.style.display = "block";
    start_button.onclick = startGame;
}


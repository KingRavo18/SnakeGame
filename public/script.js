document.addEventListener("DOMContentLoaded", () => {
    start_button.onclick = () => startGame();
});

const start_button = document.getElementById("start_btn");
const Player = {
    avatar: document.createElement("div"),
    move_direction: undefined,
    positionX: undefined,
    positionY: undefined,
    death_sound: new Audio("Assets/Audio/explosion-312361.mp3"),    
    score: 0,
};
const Fruit = {
    item: document.createElement("div"),
    positionX: undefined,
    positionY: undefined,
    amount_generated: 0,
};
const GameBoard = {
    tile_size: 40,
    tile_x_amount: 12,
    tile_y_amount: 12,
    grid: [],
    isGenerated: false,
};
const game_tick = 400;
let interval = null;

function startGame(){
    start_button.style.display = "none";
    setupGame();
    avatarDirection();
    interval = setInterval(game, game_tick);
}

function setupGame(){
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
        Player.avatar.classList.add("player_avatar");
        Player.avatar.style.height = `${GameBoard.tile_size}px`;
        Player.avatar.style.width = `${GameBoard.tile_size}px`;
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

function game(){
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
        return gameOver();
    }
    GameBoard.grid[Player.positionY][Player.positionX].appendChild(Player.avatar);
    if(Player.positionX === Fruit.positionX && Player.positionY === Fruit.positionY){
        GameBoard.grid[Fruit.positionY][Fruit.positionX].removeChild(Fruit.item);
        Fruit.amount_generated--;
    }
}

function fruit(){
    if(Fruit.amount_generated < 1){
        Fruit.item.classList.add("fruit");
        Fruit.item.style.height = `${GameBoard.tile_size}px`;
        Fruit.item.style.width = `${GameBoard.tile_size}px`;
        do{
            Fruit.positionY = Math.round(Math.random() * (GameBoard.tile_y_amount + 1));
            Fruit.positionX = Math.round(Math.random() * (GameBoard.tile_x_amount + 1));
        }while(Fruit.positionY === Player.positionY && Fruit.positionX === Player.positionX);
        GameBoard.grid[Fruit.positionY][Fruit.positionX].appendChild(Fruit.item);
        Fruit.amount_generated++;
    }
}

function gameOver(){
    Player.death_sound.play();
    clearInterval(interval);
    start_button.textContent = "RESTART";
    start_button.style.display = "block";
    start_button.onclick = startGame;
}

